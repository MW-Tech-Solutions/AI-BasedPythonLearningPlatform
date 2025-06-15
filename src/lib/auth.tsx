// src/lib/auth.tsx
"use client";

import type { User as FirebaseUser } from 'firebase/auth';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc, updateDoc, setDoc } from 'firebase/firestore';
import { useRouter, usePathname } from 'next/navigation';
import type { ReactNode } from 'react';
import React, { createContext, useEffect, useState, useCallback } from 'react'; // Added useCallback
import { auth, db } from './firebase';
import type { UserProfile, UserProgress } from './types';

interface AuthContextType {
  user: FirebaseUser | null;
  userProfile: UserProfile | null;
  loading: boolean;
  isAuthenticated: boolean;
  updateUserProgress: (progressUpdates: Partial<UserProgress>) => Promise<void>;
}

export const AuthContext = createContext<AuthContextType>({
  user: null,
  userProfile: null,
  loading: true,
  isAuthenticated: false,
  updateUserProgress: async () => {},
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  const updateUserProgress = useCallback(async (progressUpdates: Partial<UserProgress>) => {
    if (!user) {
      console.warn("User not authenticated, cannot update progress. Attempted updates:", progressUpdates);
      return;
    }
    // userProfile is a dependency of this useCallback, so if it's null here,
    // it means it was null when this specific instance of updateUserProgress was created.
    // Effects calling this should ideally wait for userProfile to be available.
    if (!userProfile) {
      console.warn("UserProfile not yet loaded when updateUserProgress was defined, cannot update progress. Attempted updates:", progressUpdates);
      return;
    }

    try {
      const userDocRef = doc(db, "users", user.uid);
      
      const currentProgress = userProfile.progress || { 
        completedLessons: [], 
        exerciseScores: {}, 
        quizScores: {},
        currentLesson: undefined 
      };
      
      const newProgressState: UserProgress = {
        ...currentProgress,
        ...progressUpdates,
      };

      // If completedLessons is part of the update, ensure it's merged correctly as a Set.
      if (progressUpdates.completedLessons) {
        newProgressState.completedLessons = Array.from(new Set([
          ...(currentProgress.completedLessons || []),
          ...(progressUpdates.completedLessons || [])
        ]));
      }


      await updateDoc(userDocRef, {
        progress: newProgressState,
      });

      setUserProfile(prevProfile => {
        if (!prevProfile) return null; 
        return {
          ...prevProfile,
          progress: newProgressState,
        };
      });
    } catch (error) {
      console.error("Error updating user progress:", error);
      throw error;
    }
  }, [user, userProfile]); // updateUserProgress depends on user and userProfile

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setLoading(true); // Start loading when auth state changes
      if (firebaseUser) {
        setUser(firebaseUser);
        const userDocRef = doc(db, "users", firebaseUser.uid);
        try {
          const userDocSnap = await getDoc(userDocRef);
          if (userDocSnap.exists()) {
            let profileData = userDocSnap.data() as UserProfile;
            // Ensure progress object and its fields are initialized
            const currentProgress = profileData.progress;
            if (!currentProgress || 
                !currentProgress.hasOwnProperty('completedLessons') ||
                !currentProgress.hasOwnProperty('exerciseScores') ||
                !currentProgress.hasOwnProperty('quizScores')) {
              const defaultProgress: UserProgress = {
                completedLessons: currentProgress?.completedLessons || [],
                exerciseScores: currentProgress?.exerciseScores || {},
                quizScores: currentProgress?.quizScores || {},
                currentLesson: currentProgress?.currentLesson || undefined, 
              };
              profileData = { ...profileData, progress: defaultProgress };
              await updateDoc(userDocRef, { progress: defaultProgress });
            }
            setUserProfile(profileData);
          } else {
            const defaultProgress: UserProgress = {
                completedLessons: [], exerciseScores: {}, quizScores: {}, currentLesson: "1", // Start with lesson 1
            };
            const defaultProfileData: UserProfile = {
              uid: firebaseUser.uid,
              displayName: firebaseUser.displayName,
              email: firebaseUser.email,
              photoURL: firebaseUser.photoURL,
              createdAt: new Date(), 
              progress: defaultProgress,
            };
            await setDoc(userDocRef, defaultProfileData);
            setUserProfile(defaultProfileData);
          }
        } catch (error) {
            console.error("Error fetching/setting user profile:", error);
             const fallbackProgress: UserProgress = { completedLessons: [], exerciseScores: {}, quizScores: {} };
             setUserProfile({
                uid: firebaseUser.uid,
                displayName: firebaseUser.displayName,
                email: firebaseUser.email,
                photoURL: firebaseUser.photoURL,
                createdAt: new Date(),
                progress: fallbackProgress
            });
        }
      } else {
        setUser(null);
        setUserProfile(null);
      }
      setLoading(false); // Finished processing auth state
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (!loading && !user && !['/auth/login', '/auth/signup', '/'].includes(pathname)) {
      router.push('/auth/login');
    }
  }, [user, loading, pathname, router]);

  const value = { 
    user, 
    userProfile, 
    loading, 
    isAuthenticated: !!user,
    updateUserProgress,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

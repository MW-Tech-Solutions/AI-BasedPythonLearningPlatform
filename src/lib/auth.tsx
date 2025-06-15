// src/lib/auth.tsx
"use client";

import type { User as FirebaseUser } from 'firebase/auth';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc, updateDoc, setDoc } from 'firebase/firestore'; // Added updateDoc, setDoc
import { useRouter, usePathname } from 'next/navigation';
import type { ReactNode } from 'react';
import React, { createContext, useEffect, useState } from 'react';
import { auth, db } from './firebase';
import type { UserProfile, UserProgress } from './types'; // Added UserProgress

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
  updateUserProgress: async () => {}, // Default empty implementation
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  const updateUserProgress = async (progressUpdates: Partial<UserProgress>) => {
    if (!user) { // userProfile might not be fully loaded yet, but user should exist
      console.error("User not available for updating progress.");
      return;
    }

    // Fetch the latest profile again to ensure we're not overwriting concurrently, or rely on local state
    // For simplicity, we'll rely on the local userProfile state for the current progress base.
    // A more robust solution might re-fetch or use transactions if concurrent updates are a concern.
    const baseProfile = userProfile; 
    if (!baseProfile) {
        console.error("UserProfile not loaded, cannot update progress.");
        return;
    }

    try {
      const userDocRef = doc(db, "users", user.uid);
      
      const currentProgress = baseProfile.progress || { 
        completedLessons: [], 
        exerciseScores: {}, 
        quizScores: {},
        currentLesson: undefined 
      };
      
      const newProgressState: UserProgress = {
        ...currentProgress,
        ...progressUpdates,
      };

      if (progressUpdates.completedLessons) {
        newProgressState.completedLessons = Array.from(new Set(progressUpdates.completedLessons));
      }

      await updateDoc(userDocRef, {
        progress: newProgressState,
      });

      setUserProfile(prevProfile => {
        if (!prevProfile) return null; // Should not happen if user is set
        return {
          ...prevProfile,
          progress: newProgressState,
        };
      });
    } catch (error) {
      console.error("Error updating user progress:", error);
      throw error;
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        setUser(firebaseUser);
        const userDocRef = doc(db, "users", firebaseUser.uid);
        try {
          const userDocSnap = await getDoc(userDocRef);
          if (userDocSnap.exists()) {
            let profileData = userDocSnap.data() as UserProfile;
            if (!profileData.progress) {
              // console.log(`User ${firebaseUser.uid} is missing progress object. Initializing and backfilling.`);
              const defaultProgress: UserProgress = {
                completedLessons: [],
                exerciseScores: {},
                quizScores: {},
                currentLesson: undefined, // Or a sensible default like the first lesson ID
              };
              profileData = { ...profileData, progress: defaultProgress };
              // Persist this backfilled progress to Firestore
              await updateDoc(userDocRef, { progress: defaultProgress });
            }
            setUserProfile(profileData);
          } else {
            // This case should ideally be handled by signup or if a user doc was manually deleted.
            // For robustness, create a default profile here if it's missing.
            // console.log(`User document for ${firebaseUser.uid} not found. Creating default profile.`);
            const defaultProfile: UserProfile = {
              uid: firebaseUser.uid,
              displayName: firebaseUser.displayName,
              email: firebaseUser.email,
              photoURL: firebaseUser.photoURL,
              createdAt: new Date(), 
              progress: {
                completedLessons: [],
                exerciseScores: {},
                quizScores: {},
                currentLesson: undefined,
              },
            };
            await setDoc(userDocRef, defaultProfile); // Create the document
            setUserProfile(defaultProfile);
          }
        } catch (error) {
            console.error("Error fetching/setting user profile:", error);
            setUserProfile({ // Fallback minimal profile
                uid: firebaseUser.uid,
                displayName: firebaseUser.displayName,
                email: firebaseUser.email,
                photoURL: firebaseUser.photoURL,
                createdAt: new Date(),
                progress: { completedLessons: [], exerciseScores: {}, quizScores: {} }
            });
        }
      } else {
        setUser(null);
        setUserProfile(null);
      }
      setLoading(false);
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

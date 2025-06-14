// src/app/dashboard/profile/page.tsx
"use client";

import { AppLayout } from "@/components/layout/AppLayout";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { auth, db } from "@/lib/firebase";
import { updateProfile } from "firebase/auth";
import { doc, updateDoc } from "firebase/firestore";
import { Loader2 } from "lucide-react";
import { useState, useEffect } from "react";

export default function ProfilePage() {
  const { user, userProfile, loading: authLoading } = useAuth();
  const { toast } = useToast();
  const [displayName, setDisplayName] = useState("");
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (userProfile) {
      setDisplayName(userProfile.displayName || "");
      setEmail(userProfile.email || "");
    } else if (user) {
      setDisplayName(user.displayName || "");
      setEmail(user.email || "");
    }
  }, [user, userProfile]);

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setIsLoading(true);

    try {
      // Update Firebase Auth profile
      if (auth.currentUser) {
         await updateProfile(auth.currentUser, { displayName });
      }

      // Update Firestore profile
      const userDocRef = doc(db, "users", user.uid);
      await updateDoc(userDocRef, { displayName });

      toast({
        title: "Profile Updated",
        description: "Your profile information has been successfully updated.",
      });
      // Potentially refresh auth context or trigger a re-fetch of userProfile
    } catch (error) {
      console.error("Error updating profile:", error);
      toast({
        title: "Update Failed",
        description: "Could not update your profile. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const getInitials = (name?: string | null) => {
    if (!name) return "U";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };


  if (authLoading) {
    return <AppLayout><div>Loading profile...</div></AppLayout>;
  }

  return (
    <AppLayout>
      <div className="container mx-auto py-8 px-4 md:px-6 lg:px-8">
        <h1 className="text-3xl font-bold mb-8 font-headline">Your Profile</h1>
        <Card className="max-w-2xl mx-auto shadow-lg">
          <CardHeader>
            <div className="flex items-center space-x-4 mb-4">
              <Avatar className="h-20 w-20">
                <AvatarImage src={userProfile?.photoURL || user?.photoURL || undefined} alt={displayName} data-ai-hint="user avatar"/>
                <AvatarFallback className="text-3xl">{getInitials(displayName)}</AvatarFallback>
              </Avatar>
              <div>
                <CardTitle className="text-2xl">{displayName}</CardTitle>
                <CardDescription>{email}</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleProfileUpdate} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="displayName">Display Name</Label>
                <Input
                  id="displayName"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  disabled={isLoading}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  disabled // Email usually not changed directly here for simplicity
                  readOnly
                />
                 <p className="text-xs text-muted-foreground">Email cannot be changed here. Contact support if needed.</p>
              </div>
              {/* Add more fields like photoURL upload if needed */}
              <Button type="submit" disabled={isLoading} className="w-full sm:w-auto">
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Save Changes
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}

// src/app/dashboard/page.tsx
"use client";

import { AppLayout } from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useAuth } from "@/hooks/useAuth";
import type { Lesson, UserProgress } from "@/lib/types"; // Assuming types are defined
import { BookOpen, CheckCircle, Zap } from "lucide-react";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";

// Mock data - replace with actual data fetching from Firestore
const mockLessons: Lesson[] = [
  { id: "1", slug: "introduction-to-python", title: "Introduction to Python", description: "Learn the basics of Python syntax and concepts.", category: "Basics", estimatedTime: "20 mins", content: [], exercises: [{id: 'ex1', description: 'Print Hello World', starterCode: 'print("Hello World")'}] },
  { id: "2", slug: "variables-and-data-types", title: "Variables and Data Types", description: "Understand how to store and manage data.", category: "Basics", estimatedTime: "25 mins", content: [], exercises: [] },
  { id: "3", slug: "control-flow", title: "Control Flow", description: "Learn about if-statements and loops.", category: "Basics", estimatedTime: "30 mins", content: [], exercises: [] },
  { id: "4", slug: "functions", title: "Functions", description: "Master reusable blocks of code.", category: "Intermediate", estimatedTime: "35 mins", content: [], exercises: [] },
];


export default function DashboardPage() {
  const { user, userProfile, loading: authLoading } = useAuth();
  const [userProgress, setUserProgress] = useState<UserProgress | null>(null);
  const [lessons, setLessons] = useState<Lesson[]>(mockLessons); // Use mock lessons
  const [loadingData, setLoadingData] = useState(true);

  useEffect(() => {
    // Simulate fetching user progress
    if (userProfile && userProfile.progress) {
      setUserProgress(userProfile.progress);
    } else if (!authLoading && user) {
      // If no progress in profile, initialize or fetch default
      setUserProgress({
        completedLessons: [],
        exerciseScores: {},
        quizScores: {},
        currentLesson: mockLessons[0]?.id // Start with the first lesson
      });
    }
    // Simulate data loading
    const timer = setTimeout(() => setLoadingData(false), 500);
    return () => clearTimeout(timer);

  }, [user, userProfile, authLoading]);

  if (authLoading || loadingData) {
    return (
      <AppLayout>
        <div className="container mx-auto py-8 px-4 md:px-6 lg:px-8">
          <Skeleton className="h-10 w-1/3 mb-6" />
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mb-8">
            {[1,2,3].map(i => <Skeleton key={i} className="h-36 rounded-lg" />)}
          </div>
          <Skeleton className="h-8 w-1/4 mb-4" />
          <div className="space-y-4">
            {[1,2,3].map(i => <Skeleton key={i} className="h-24 rounded-lg" />)}
          </div>
        </div>
      </AppLayout>
    );
  }

  const totalLessons = lessons.length;
  const completedLessonsCount = userProgress?.completedLessons?.length || 0;
  const overallProgress = totalLessons > 0 ? (completedLessonsCount / totalLessons) * 100 : 0;

  const nextLesson = lessons.find(lesson => !userProgress?.completedLessons?.includes(lesson.id)) || 
                     (userProgress?.currentLesson ? lessons.find(l => l.id === userProgress.currentLesson) : lessons[0]);


  return (
    <AppLayout>
      <div className="container mx-auto py-8 px-4 md:px-6 lg:px-8">
        <h1 className="text-3xl font-bold mb-2 font-headline">
          Welcome back, {user?.displayName || "Learner"}!
        </h1>
        <p className="text-muted-foreground mb-8 text-lg">
          Continue your Python journey and track your progress.
        </p>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 mb-8">
          <Card className="shadow-md">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Overall Progress</CardTitle>
              <BookOpen className="h-5 w-5 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{completedLessonsCount} / {totalLessons} Lessons</div>
              <Progress value={overallProgress} className="mt-2 h-3" />
              <p className="text-xs text-muted-foreground mt-1">
                {Math.round(overallProgress)}% completed
              </p>
            </CardContent>
          </Card>

          <Card className="shadow-md">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Completed Lessons</CardTitle>
              <CheckCircle className="h-5 w-5 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{completedLessonsCount}</div>
              <p className="text-xs text-muted-foreground">
                Keep up the great work!
              </p>
            </CardContent>
          </Card>
          
          {nextLesson && (
            <Card className="shadow-md bg-primary/10 border-primary">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-primary-foreground">Next Lesson</CardTitle>
                <Zap className="h-5 w-5 text-primary-foreground/80" />
              </CardHeader>
              <CardContent>
                <div className="text-xl font-semibold text-primary-foreground">{nextLesson.title}</div>
                <p className="text-xs text-primary-foreground/80 mb-3">
                  {nextLesson.description}
                </p>
                <Button asChild size="sm" variant="default" className="bg-primary text-primary-foreground hover:bg-primary/90">
                  <Link href={`/lessons/${nextLesson.slug}`}>Start Lesson</Link>
                </Button>
              </CardContent>
            </Card>
          )}
        </div>

        <div>
          <h2 className="text-2xl font-semibold mb-4 font-headline">Available Lessons</h2>
          {lessons.length > 0 ? (
            <div className="space-y-4">
              {lessons.map((lesson) => (
                <Card key={lesson.id} className="shadow-md hover:shadow-lg transition-shadow">
                  <CardContent className="p-4 flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-semibold">{lesson.title}</h3>
                      <p className="text-sm text-muted-foreground">{lesson.description}</p>
                      <div className="mt-1 text-xs text-muted-foreground">
                        <span>{lesson.category}</span> &middot; <span>{lesson.estimatedTime}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {userProgress?.completedLessons?.includes(lesson.id) && (
                        <CheckCircle className="h-5 w-5 text-green-500" />
                      )}
                       <Button asChild variant={userProgress?.completedLessons?.includes(lesson.id) ? "outline" : "default"}>
                        <Link href={`/lessons/${lesson.slug}`}>
                          {userProgress?.completedLessons?.includes(lesson.id) ? "Review" : "Start"}
                        </Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <p className="text-muted-foreground">No lessons available yet. Check back soon!</p>
          )}
        </div>
      </div>
    </AppLayout>
  );
}

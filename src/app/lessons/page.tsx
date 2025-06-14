// src/app/lessons/page.tsx
"use client";

import { AppLayout } from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import type { Lesson, UserProgress } from "@/lib/types";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { CheckCircle, BookOpen, Filter } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { Skeleton } from "@/components/ui/skeleton";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

// Mock data - replace with actual data fetching from Firestore
const mockLessons: Lesson[] = [
  { id: "1", slug: "introduction-to-python", title: "Introduction to Python", description: "Learn the basics of Python syntax, variables, and simple I/O operations.", category: "Basics", estimatedTime: "20 mins", content: [], exercises: [{id: 'ex1', description: 'Print Hello World', starterCode: 'print("Hello World")'}] },
  { id: "2", slug: "variables-and-data-types", title: "Variables and Data Types", description: "Understand integers, floats, strings, booleans, and how to store them in variables.", category: "Basics", estimatedTime: "25 mins", content: [], exercises: [] },
  { id: "3", slug: "control-flow", title: "Control Flow: If, Elif, Else", description: "Master conditional logic with if, elif, and else statements to make decisions in your code.", category: "Basics", estimatedTime: "30 mins", content: [], exercises: [] },
  { id: "4", slug: "loops", title: "Loops: For and While", description: "Learn to repeat blocks of code using for and while loops for efficient programming.", category: "Basics", estimatedTime: "30 mins", content: [], exercises: [] },
  { id: "5", slug: "functions", title: "Functions", description: "Create reusable blocks of code with functions, arguments, and return values.", category: "Intermediate", estimatedTime: "35 mins", content: [], exercises: [] },
  { id: "6", slug: "data-structures-lists", title: "Data Structures: Lists", description: "Explore Python lists, their methods, and common use cases for storing collections of items.", category: "Intermediate", estimatedTime: "40 mins", content: [], exercises: [] },
  { id: "7", slug: "data-structures-dictionaries", title: "Data Structures: Dictionaries", description: "Understand key-value pairs using dictionaries for flexible data storage and retrieval.", category: "Intermediate", estimatedTime: "40 mins", content: [], exercises: [] },
];

const categories = ["All", ...new Set(mockLessons.map(lesson => lesson.category))];

export default function LessonsPage() {
  const { userProfile, loading: authLoading } = useAuth();
  const [lessons, setLessons] = useState<Lesson[]>(mockLessons);
  const [userProgress, setUserProgress] = useState<UserProgress | null>(null);
  const [loadingData, setLoadingData] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>("All");

  useEffect(() => {
    if (userProfile && userProfile.progress) {
      setUserProgress(userProfile.progress);
    } else if (!authLoading) {
       setUserProgress({ completedLessons: [], exerciseScores: {}, quizScores: {} });
    }
    // Simulate data loading
    const timer = setTimeout(() => setLoadingData(false), 300);
    return () => clearTimeout(timer);
  }, [userProfile, authLoading]);

  const filteredLessons = selectedCategory === "All" 
    ? lessons 
    : lessons.filter(lesson => lesson.category === selectedCategory);

  if (authLoading || loadingData) {
    return (
      <AppLayout>
        <div className="container mx-auto py-8 px-4 md:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-8">
            <Skeleton className="h-10 w-48" />
            <Skeleton className="h-10 w-32" />
          </div>
          <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <Card key={i} className="shadow-md">
                <CardHeader>
                  <Skeleton className="h-6 w-3/4 mb-2" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-2/3 mt-1" />
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-4 w-1/2 mb-2" />
                </CardContent>
                <CardFooter>
                  <Skeleton className="h-10 w-24" />
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      </AppLayout>
    );
  }
  
  return (
    <AppLayout>
      <div className="container mx-auto py-8 px-4 md:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row justify-between items-center mb-8 gap-4">
          <h1 className="text-3xl font-bold font-headline">All Python Lessons</h1>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">
                <Filter className="mr-2 h-4 w-4" />
                Filter by Category ({selectedCategory})
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Select Category</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {categories.map(category => (
                <DropdownMenuCheckboxItem
                  key={category}
                  checked={selectedCategory === category}
                  onCheckedChange={() => setSelectedCategory(category)}
                >
                  {category}
                </DropdownMenuCheckboxItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {filteredLessons.length > 0 ? (
          <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filteredLessons.map((lesson) => (
              <Card key={lesson.id} className="flex flex-col shadow-lg hover:shadow-xl transition-shadow duration-300">
                <CardHeader>
                  <div className="flex justify-between items-start mb-2">
                     <BookOpen className="h-8 w-8 text-primary" />
                     {userProgress?.completedLessons?.includes(lesson.id) && (
                        <CheckCircle className="h-6 w-6 text-green-500" title="Completed" />
                      )}
                  </div>
                  <CardTitle className="text-xl font-semibold">{lesson.title}</CardTitle>
                  <CardDescription className="text-sm h-16 overflow-hidden text-ellipsis"> {/* Fixed height for description */}
                    {lesson.description}
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex-grow">
                  <div className="text-xs text-muted-foreground">
                    <span className="font-medium">{lesson.category}</span> &middot; <span>{lesson.estimatedTime}</span>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button asChild className="w-full">
                    <Link href={`/lessons/${lesson.slug}`}>
                      {userProgress?.completedLessons?.includes(lesson.id) ? "Review Lesson" : "Start Lesson"}
                    </Link>
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <BookOpen className="mx-auto h-16 w-16 text-muted-foreground mb-4" />
            <p className="text-xl text-muted-foreground">No lessons found for &quot;{selectedCategory}&quot;.</p>
            {selectedCategory !== "All" && (
                 <Button variant="link" onClick={() => setSelectedCategory("All")}>
                    Show all lessons
                 </Button>
            )}
          </div>
        )}
      </div>
    </AppLayout>
  );
}

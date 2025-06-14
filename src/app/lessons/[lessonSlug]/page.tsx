// src/app/lessons/[lessonSlug]/page.tsx
"use client";

import { AppLayout } from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import type { Lesson, LessonContentPart, Exercise } from "@/lib/types";
import { ArrowLeft, ArrowRight, Check, Lightbulb, MessageSquare, Sparkles, Code } from "lucide-react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import React, { useEffect, useState, Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/hooks/useAuth";
import { Textarea } from "@/components/ui/textarea";
import { answerPythonQuestion, AnswerPythonQuestionInput } from "@/ai/flows/answer-python-questions";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/hooks/use-toast";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";


// Mock data - replace with actual data fetching from Firestore
const mockLessons: Lesson[] = [
   { 
    id: "1", slug: "introduction-to-python", title: "Introduction to Python", 
    description: "Learn the basics of Python syntax and concepts.", 
    category: "Basics", estimatedTime: "20 mins", 
    content: [
      { type: "heading", value: "Welcome to Python!", level: 1 },
      { type: "text", value: "Python is a versatile and powerful programming language known for its readability and simplicity. It's widely used in web development, data science, artificial intelligence, and more." },
      { type: "heading", value: "Your First Python Code", level: 2 },
      { type: "text", value: "The most common way to start with any new language is by printing 'Hello, World!'. In Python, it's very straightforward:" },
      { type: "code", language: "python", value: 'print("Hello, World!")' },
      { type: "text", value: "The `print()` function is used to display output to the console." },
      { type: "heading", value: "Variables", level: 2 },
      { type: "text", value: "Variables are used to store data. You can think of them as containers. Here's how you declare a variable:" },
      { type: "code", language: "python", value: 'message = "Hello, Python!"\nprint(message)' },
      { type: "text", value: "In this example, `message` is a variable storing the string \"Hello, Python!\"." },
    ], 
    exercises: [
      { id: "ex1-1", description: "Write Python code to print your name.", starterCode: '# Your code here\nprint("")' },
      { id: "ex1-2", description: "Create a variable called `age` and assign your age to it. Then print the variable.", starterCode: '# Your code here\n\n\n# Print the age variable' }
    ] 
  },
  { 
    id: "2", slug: "variables-and-data-types", title: "Variables and Data Types", 
    description: "Understand how to store and manage data.", 
    category: "Basics", estimatedTime: "25 mins", 
    content: [
      { type: "heading", value: "Understanding Variables", level: 1 },
      { type: "text", value: "Variables are fundamental to programming. They are names that refer to values stored in memory. Python is dynamically typed, meaning you don't need to declare the type of a variable explicitly." },
      { type: "heading", value: "Common Data Types", level: 2 },
      { type: "text", value: "Python has several built-in data types:" },
      { type: "text", value: "**Integers (int):** Whole numbers, e.g., `10`, `-3`." },
      { type: "code", language: "python", value: "count = 100\nnegative_count = -50" },
      { type: "text", value: "**Floating-Point Numbers (float):** Numbers with a decimal point, e.g., `3.14`, `-0.5`." },
      { type: "code", language: "python", value: "pi = 3.14159\ntemperature = -10.5" },
      { type: "text", value: "**Strings (str):** Sequences of characters, enclosed in single or double quotes, e.g., `'hello'`, `\"Python\"`." },
      { type: "code", language: "python", value: 'greeting = "Good Morning"\nname = \'Alice\'' },
      { type: "text", value: "**Booleans (bool):** Represent truth values, either `True` or `False`." },
      { type: "code", language: "python", value: "is_active = True\nhas_permission = False" },
    ], 
    exercises: [
      { id: "ex2-1", description: "Create a variable `item_name` storing the string \"Laptop\" and another variable `price` storing the float `999.99`. Print both variables.", starterCode: "# Define item_name\n\n# Define price\n\n# Print both variables" }
    ] 
  },
  // Add more lessons slugs to match dashboard
   { id: "3", slug: "control-flow", title: "Control Flow", description: "Learn about if-statements and loops.", category: "Basics", estimatedTime: "30 mins", content: [{type: 'text', value: 'Control flow content here...'}], exercises: [] },
   { id: "4", slug: "loops", title: "Loops: For and While", description: "Learn to repeat blocks of code using for and while loops for efficient programming.", category: "Basics", estimatedTime: "30 mins", content: [{type: 'text', value: 'Loop content here...'}], exercises: [] },
   { id: "5", slug: "functions", title: "Functions", description: "Master reusable blocks of code.", category: "Intermediate", estimatedTime: "35 mins", content: [{type: 'text', value: 'Functions content here...'}], exercises: [] },
   { id: "6", slug: "data-structures-lists", title: "Data Structures: Lists", description: "Explore Python lists, their methods, and common use cases for storing collections of items.", category: "Intermediate", estimatedTime: "40 mins", content: [{type: 'text', value: 'List content here...'}], exercises: [] },
   { id: "7", slug: "data-structures-dictionaries", title: "Data Structures: Dictionaries", description: "Understand key-value pairs using dictionaries for flexible data storage and retrieval.", category: "Intermediate", estimatedTime: "40 mins", content: [{type: 'text', value: 'Dictionary content here...'}], exercises: [] },
];

function LessonContentDisplay({ content }: { content: LessonContentPart[] }) {
  return (
    <div className="prose prose-lg max-w-none dark:prose-invert">
      {content.map((part, index) => {
        if (part.type === "heading") {
          const Tag = `h${part.level || 2}` as keyof JSX.IntrinsicElements;
          return <Tag key={index} className="font-headline mt-6 mb-3">{part.value}</Tag>;
        }
        if (part.type === "text") {
          return <p key={index}>{part.value}</p>;
        }
        if (part.type === "code") {
          return (
            <pre key={index} className="bg-muted p-4 rounded-md overflow-x-auto text-sm">
              <code className={`language-${part.language || "python"}`}>{part.value}</code>
            </pre>
          );
        }
        return null;
      })}
    </div>
  );
}

function ExerciseAttempt({ exercise, onSubmit }: { exercise: Exercise; onSubmit: (exerciseId: string, code: string) => void }) {
  const [code, setCode] = useState(exercise.starterCode);
  const [output, setOutput] = useState<string | null>(null); // Placeholder for code execution output
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null); // Placeholder

  const handleRunCode = () => {
    // Placeholder for actual code execution
    // For now, just simulate output and check if it's "Hello World" for first exercise
    setOutput(`Simulated output for: \n${code}`);
    if (exercise.id === "ex1-1" && code.includes(`print("${useAuth().user?.displayName || 'Your Name'}")`)) {
      setIsCorrect(true);
    } else if (exercise.id === "ex1-1" && code.includes('print("')) { // basic check
      setIsCorrect(Math.random() > 0.5); // Random success for demo
    } else {
      setIsCorrect(false);
    }
    onSubmit(exercise.id, code); // Notify parent about submission
  };

  return (
    <Card className="mt-6 shadow-md">
      <CardHeader>
        <CardTitle className="text-lg font-semibold">Exercise: {exercise.description}</CardTitle>
      </CardHeader>
      <CardContent>
        <Textarea
          value={code}
          onChange={(e) => setCode(e.target.value)}
          placeholder="Write your Python code here..."
          className="min-h-[150px] font-code text-sm bg-background border rounded-md"
          aria-label={`Code editor for exercise: ${exercise.description}`}
        />
        <Button onClick={handleRunCode} className="mt-4">
          <Code className="mr-2 h-4 w-4"/> Run Code
        </Button>
        {output && (
          <Alert className="mt-4" variant={isCorrect === null ? "default" : isCorrect ? "default" : "destructive"}>
            <Sparkles className="h-4 w-4" />
            <AlertTitle>{isCorrect === null ? "Output" : isCorrect ? "Correct!" : "Needs Improvement"}</AlertTitle>
            <AlertDescription className="whitespace-pre-wrap font-code text-sm">{output}</AlertDescription>
          </Alert>
        )}
      </CardContent>
    </Card>
  );
}

function ChatbotWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [question, setQuestion] = useState("");
  const [chatHistory, setChatHistory] = useState<{ type: 'user' | 'ai'; text: string }[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSendMessage = async () => {
    if (!question.trim()) return;
    
    const newHistory = [...chatHistory, { type: 'user' as 'user', text: question }];
    setChatHistory(newHistory);
    setQuestion("");
    setIsLoading(true);

    try {
      const input: AnswerPythonQuestionInput = { question };
      const result = await answerPythonQuestion(input);
      setChatHistory([...newHistory, { type: 'ai' as 'ai', text: result.answer }]);
    } catch (error) {
      console.error("AI Assistant Error:", error);
      setChatHistory([...newHistory, { type: 'ai' as 'ai', text: "Sorry, I couldn't process your request right now." }]);
      toast({ title: "AI Error", description: "Failed to get response from AI assistant.", variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {isOpen && (
        <Card className="w-80 h-[400px] shadow-xl flex flex-col">
          <CardHeader className="bg-primary text-primary-foreground p-4">
            <CardTitle className="text-lg">PyRoutes AI Assistant</CardTitle>
          </CardHeader>
          <ScrollArea className="flex-grow p-4 space-y-3">
            {chatHistory.map((entry, index) => (
              <div key={index} className={`flex ${entry.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`p-2 rounded-lg max-w-[80%] text-sm ${entry.type === 'user' ? 'bg-primary/20' : 'bg-muted'}`}>
                  {entry.text}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                 <div className="p-2 rounded-lg bg-muted text-sm">Thinking... <Loader2 className="inline h-3 w-3 animate-spin"/></div>
              </div>
            )}
          </ScrollArea>
          <CardContent className="p-4 border-t">
            <div className="flex gap-2">
              <Input 
                value={question} 
                onChange={(e) => setQuestion(e.target.value)}
                placeholder="Ask about Python..."
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                disabled={isLoading}
              />
              <Button onClick={handleSendMessage} disabled={isLoading || !question.trim()}>Send</Button>
            </div>
          </CardContent>
        </Card>
      )}
      <Button
        size="icon"
        className="rounded-full w-14 h-14 shadow-lg"
        onClick={() => setIsOpen(!isOpen)}
        aria-label={isOpen ? "Close AI Assistant" : "Open AI Assistant"}
      >
        {isOpen ? <Check className="h-6 w-6" /> : <MessageSquare className="h-6 w-6" />}
      </Button>
    </div>
  );
}


export default function LessonPage() {
  const params = useParams();
  const router = useRouter();
  const { lessonSlug } = params;
  const [lesson, setLesson] = useState<Lesson | null>(null);
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const { user, userProfile, loading: authLoading } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    if (lessonSlug) {
      const foundLesson = mockLessons.find(l => l.slug === lessonSlug);
      if (foundLesson) {
        setLesson(foundLesson);
      } else {
        // Handle lesson not found, e.g., redirect or show 404
        router.push("/lessons"); 
      }
    }
    // Simulate loading
    const timer = setTimeout(() => setLoading(false), 300);
    return () => clearTimeout(timer);
  }, [lessonSlug, router]);

  const handleExerciseSubmit = (exerciseId: string, code: string) => {
    // This is where you'd integrate with an automated code grader.
    // For now, just log it and potentially update local progress.
    console.log(`Submitted code for exercise ${exerciseId}:`, code);
    toast({ title: "Code Submitted!", description: "Your solution is being evaluated (simulated)." });
    // Potentially update user progress in Firestore here
  };
  
  const currentLessonIndex = mockLessons.findIndex(l => l.slug === lessonSlug);
  const prevLesson = currentLessonIndex > 0 ? mockLessons[currentLessonIndex - 1] : null;
  const nextLesson = currentLessonIndex < mockLessons.length - 1 ? mockLessons[currentLessonIndex + 1] : null;


  if (authLoading || loading || !lesson) {
    return (
      <AppLayout>
        <div className="container mx-auto py-8 px-4 md:px-6 lg:px-8 max-w-4xl">
          <Skeleton className="h-10 w-3/4 mb-4" />
          <Skeleton className="h-6 w-1/2 mb-8" />
          <Skeleton className="h-48 w-full mb-6" />
          <Skeleton className="h-32 w-full mb-6" />
          <Skeleton className="h-64 w-full" />
        </div>
        <Suspense fallback={null}><ChatbotWidget /></Suspense>
      </AppLayout>
    );
  }
  
  const currentExercise = lesson.exercises[currentExerciseIndex];

  return (
    <AppLayout>
      <div className="container mx-auto py-8 px-4 md:px-6 lg:px-8 max-w-4xl">
        <Button variant="outline" onClick={() => router.push('/lessons')} className="mb-6">
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Lessons
        </Button>
        <article>
          <header className="mb-8">
            <h1 className="text-4xl font-bold mb-2 font-headline">{lesson.title}</h1>
            <p className="text-lg text-muted-foreground">{lesson.description}</p>
            <div className="mt-2 text-sm text-muted-foreground">
              <span>{lesson.category}</span> &middot; <span>Estimated time: {lesson.estimatedTime}</span>
            </div>
          </header>

          <LessonContentDisplay content={lesson.content} />

          {lesson.exercises.length > 0 && (
            <section className="mt-12">
              <h2 className="text-2xl font-semibold mb-4 font-headline">Exercises</h2>
               {currentExercise && (
                 <ExerciseAttempt exercise={currentExercise} onSubmit={handleExerciseSubmit} />
               )}
              <div className="mt-4 flex justify-between">
                <Button 
                  onClick={() => setCurrentExerciseIndex(prev => Math.max(0, prev -1))} 
                  disabled={currentExerciseIndex === 0}
                  variant="outline"
                >
                  <ArrowLeft className="mr-2 h-4 w-4"/> Previous Exercise
                </Button>
                <span className="text-sm text-muted-foreground self-center">
                  Exercise {currentExerciseIndex + 1} of {lesson.exercises.length}
                </span>
                <Button 
                  onClick={() => setCurrentExerciseIndex(prev => Math.min(lesson.exercises.length -1, prev + 1))}
                  disabled={currentExerciseIndex === lesson.exercises.length - 1}
                  variant="outline"
                >
                  Next Exercise <ArrowRight className="ml-2 h-4 w-4"/>
                </Button>
              </div>
            </section>
          )}
        </article>
        
        <div className="mt-12 pt-8 border-t flex justify-between">
            {prevLesson ? (
                <Button variant="outline" asChild>
                    <Link href={`/lessons/${prevLesson.slug}`}>
                        <ArrowLeft className="mr-2 h-4 w-4" /> Previous: {prevLesson.title}
                    </Link>
                </Button>
            ) : <div /> }
            {nextLesson ? (
                 <Button variant="default" asChild>
                    <Link href={`/lessons/${nextLesson.slug}`}>
                        Next: {nextLesson.title} <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                </Button>
            ) : (
                <Button variant="default" onClick={() => router.push('/lessons')}>
                    <Check className="mr-2 h-4 w-4" /> All Lessons Completed!
                </Button>
            )}
        </div>
      </div>
      <Suspense fallback={null}><ChatbotWidget /></Suspense>
    </AppLayout>
  );
}

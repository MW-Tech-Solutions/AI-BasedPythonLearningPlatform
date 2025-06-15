// src/app/lessons/[lessonSlug]/page.tsx
"use client";

import { AppLayout } from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import type { Lesson, LessonContentPart, Exercise, UserProgress } from "@/lib/types";
import { ArrowLeft, ArrowRight, Check, Lightbulb, MessageSquare, Sparkles, Code, Loader2, BookOpen } from "lucide-react";
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
import { Progress } from "@/components/ui/progress"; // Added for the embedded DashboardPage part
import { CheckCircle, Zap } from "lucide-react"; // Added for the embedded DashboardPage part


const mockLessons: Lesson[] = [
  { 
    id: "1", 
    slug: "introduction-to-python", 
    title: "Introduction to Python", 
    description: "Learn the basics of Python syntax, variables, and simple I/O operations.", 
    category: "Basics", 
    estimatedTime: "20 mins", 
    content: [
      { type: "heading", value: "Welcome to Python!", level: 1 },
      { type: "text", value: "Python is a versatile and powerful programming language known for its readability and simplicity. It's widely used in web development, data science, artificial intelligence, and more." },
      { type: "heading", value: "Your First Python Code", level: 2 },
      { type: "text", value: "The most common way to start with any new language is by printing 'Hello, World!'. In Python, it's very straightforward:" },
      { type: "code", language: "python", value: 'print("Hello, World!")' },
      { type: "text", value: "The `print()` function is used to display output to the console." },
      { type: "heading", value: "Understanding Variables", level: 2 },
      { type: "text", value: "Variables are used to store data. You can think of them as containers. In Python, you assign a value to a variable using the equals sign (`=`)." },
      { type: "code", language: "python", value: 'message = "Hello, Python!"\nprint(message)' },
      { type: "text", value: "In this example, `message` is a variable storing the string \"Hello, Python!\". Python is dynamically typed, meaning you don't need to declare the variable's type." },
      { type: "heading", value: "Basic Input", level: 2 },
      { type: "text", value: "You can also get input from the user using the `input()` function." },
      { type: "code", language: "python", value: 'name = input("Enter your name: ")\nprint("Hello, " + name)' },
      { type: "text", value: "The `input()` function reads a line from the input (usually the keyboard), converts it to a string, and returns it." }
    ], 
    exercises: [
      { id: "ex1-1", description: "Write Python code to print your full name.", starterCode: '# Your code here\nprint("")', solution: 'print("Your Full Name") # Replace with actual name', tests: [] },
      { id: "ex1-2", description: "Create a variable called `city` and assign the name of your city to it. Then print the variable.", starterCode: '# Your code here\n\n\n# Print the city variable', solution: 'city = "Your City"\nprint(city)', tests: [] }
    ] 
  },
  { 
    id: "2", 
    slug: "variables-and-data-types", 
    title: "Variables and Data Types", 
    description: "Understand integers, floats, strings, booleans, and how to store and manage data using variables.", 
    category: "Basics", 
    estimatedTime: "25 mins", 
    content: [
      { type: "heading", value: "Revisiting Variables", level: 1 },
      { type: "text", value: "Variables are names that refer to values stored in memory. Python is dynamically typed, meaning you don't need to declare the type of a variable explicitly. The type is inferred at runtime." },
      { type: "code", language: "python", value: 'x = 10          # x is an integer\ny = "Python"    # y is a string\nz = 3.14        # z is a float' },
      { type: "heading", value: "Common Data Types", level: 2 },
      { type: "text", value: "Python has several built-in data types:" },
      { type: "heading", value: "Integers (int)", level: 3 },
      { type: "text", value: "Whole numbers, positive or negative, without decimals. Example: `100`, `-50`." },
      { type: "code", language: "python", value: "count = 100\nnegative_count = -50\nprint(type(count))  # Output: <class 'int'>" },
      { type: "heading", value: "Floating-Point Numbers (float)", level: 3 },
      { type: "text", value: "Numbers with a decimal point, or numbers in exponential notation. Example: `3.14`, `-0.5`, `2.5e2` (which is 2.5 * 10^2 = 250.0)." },
      { type: "code", language: "python", value: "pi_value = 3.14159\ntemperature = -10.5\nscientific_notation = 1.2E3 # 1.2 * 1000 = 1200.0\nprint(type(pi_value))  # Output: <class 'float'>" },
      { type: "heading", value: "Strings (str)", level: 3 },
      { type: "text", value: "Sequences of characters, enclosed in single (`'`) or double (`\"`) quotes. Multi-line strings can be created using triple quotes (`'''` or `\"\"\"`). Example: `'hello'`, `\"Python is fun\"`." },
      { type: "code", language: "python", value: 'greeting = "Good Morning"\nname = \'Alice\'\nmulti_line = """This is a\nmulti-line string."""\nprint(type(greeting))  # Output: <class \'str\'>' },
      { type: "heading", value: "Booleans (bool)", level: 3 },
      { type: "text", value: "Represent truth values, either `True` or `False`. These are often the result of comparison operations." },
      { type: "code", language: "python", value: "is_active = True\nhas_permission = False\nprint(type(is_active))  # Output: <class 'bool'>\n\nresult = 5 > 3\nprint(result)  # Output: True" },
      { type: "heading", value: "Type Conversion", level: 2 },
      { type: "text", value: "You can convert between different data types using built-in functions like `int()`, `float()`, `str()`." },
      { type: "code", language: "python", value: 'num_str = "123"\nnum_int = int(num_str)\nprint(num_int + 7) # Output: 130\n\nfloat_val = float("3.14")\nprint(float_val)\n\nint_val = 100\nstr_val = str(int_val)\nprint("Value: " + str_val)' },
    ], 
    exercises: [
      { id: "ex2-1", description: "Create a variable `item_name` storing the string \"Laptop\" and another variable `price` storing the float `999.99`. Print both variables, each on a new line.", starterCode: "# Define item_name\n\n# Define price\n\n# Print both variables", solution: 'item_name = "Laptop"\nprice = 999.99\nprint(item_name)\nprint(price)', tests: [] },
      { id: "ex2-2", description: "A variable `value_str` holds the string \"42\". Convert it to an integer, add 10 to it, and print the result.", starterCode: 'value_str = "42"\n# Convert, add, and print', solution: 'value_str = "42"\nvalue_int = int(value_str)\nresult = value_int + 10\nprint(result)', tests: [] }
    ] 
  },
  { 
    id: "3", 
    slug: "control-flow", 
    title: "Control Flow: If, Elif, Else", 
    description: "Master conditional logic with if, elif, and else statements to make decisions in your code.", 
    category: "Basics", 
    estimatedTime: "30 mins", 
    content: [
      { type: "heading", value: "Making Decisions in Code", level: 1 },
      { type: "text", value: "Often in programming, you need to execute certain code only if a specific condition is met. Python uses `if`, `elif` (else if), and `else` statements for this." },
      { type: "heading", value: "The `if` Statement", level: 2 },
      { type: "text", value: "The `if` statement executes a block of code if its condition is `True`." },
      { type: "code", language: "python", value: 'age = 20\nif age >= 18:\n    print("You are an adult.")\n    print("You can vote.")\n\nprint("This line always executes.")' },
      { type: "text", value: "Notice the colon (`:`) at the end of the `if` line and the indentation for the code block that belongs to the `if` statement. Indentation is crucial in Python." },
      { type: "heading", value: "The `else` Statement", level: 2 },
      { type: "text", value: "The `else` statement provides an alternative block of code to execute if the `if` condition is `False`." },
      { type: "code", language: "python", value: 'temperature = 15\nif temperature > 25:\n    print("It\'s a warm day.")\nelse:\n    print("It\'s a cool day.")' },
      { type: "heading", value: "The `elif` Statement", level: 2 },
      { type: "text", value: "When you have multiple conditions to check, you can use `elif` (short for \"else if\"). Python checks `elif` conditions only if the preceding `if` or `elif` conditions were `False`." },
      { type: "code", language: "python", value: 'score = 85\nif score >= 90:\n    print("Grade: A")\nelif score >= 80:\n    print("Grade: B")\nelif score >= 70:\n    print("Grade: C")\nelse:\n    print("Grade: D or F")' },
      { type: "text", value: "You can have multiple `elif` statements. The `else` block at the end is optional and executes if none of the `if` or `elif` conditions are true." },
      { type: "heading", value: "Comparison Operators", level: 2 },
      { type: "text", value: "Conditions in `if` statements often use comparison operators:" },
      { type: "text", value: "`==` (equal to), `!=` (not equal to), `>` (greater than), `<` (less than), `>=` (greater than or equal to), `<=` (less than or equal to)." },
      { type: "heading", value: "Logical Operators", level: 2 },
      { type: "text", value: "You can combine conditions using logical operators: `and`, `or`, `not`." },
      { type: "code", language: "python", value: 'age = 25\nhas_license = True\n\nif age >= 18 and has_license:\n    print("You can drive.")\n\nis_weekend = False\nis_holiday = True\n\nif is_weekend or is_holiday:\n    print("Enjoy your day off!")\n\nif not is_weekend:\n    print("Back to work/school!")' }
    ], 
    exercises: [
      { id: "ex3-1", description: "Write a program that checks if a number (e.g., `num = 7`) is positive, negative, or zero and prints the result.", starterCode: 'num = 7 # Try with different values like -5, 0\n# Your code here', solution: 'num = 7\nif num > 0:\n    print("Positive")\nelif num < 0:\n    print("Negative")\nelse:\n    print("Zero")', tests: [] },
      { id: "ex3-2", description: "A student needs a score of 50 or more to pass an exam. Write code to check a `student_score` and print \"Pass\" or \"Fail\".", starterCode: 'student_score = 65 # Try with 40\n# Your code here', solution: 'student_score = 65\nif student_score >= 50:\n    print("Pass")\nelse:\n    print("Fail")', tests: [] }
    ] 
  },
  { 
    id: "4", 
    slug: "loops", 
    title: "Loops: For and While", 
    description: "Learn to repeat blocks of code using for and while loops for efficient programming.", 
    category: "Basics", 
    estimatedTime: "30 mins", 
    content: [
      { type: "heading", value: "Repeating Code with Loops", level: 1 },
      { type: "text", value: "Loops are used to execute a block of code multiple times. Python has two main types of loops: `for` loops and `while` loops." },
      { type: "heading", value: "The `for` Loop", level: 2 },
      { type: "text", value: "`for` loops are used for iterating over a sequence (like a list, tuple, dictionary, set, or string) or other iterable objects." },
      { type: "heading", value: "Iterating over a String", level: 3 },
      { type: "code", language: "python", value: 'for letter in "Python":\n    print(letter)' },
      { type: "text", value: "This loop will print each character of the string \"Python\" on a new line." },
      { type: "heading", value: "Using `range()`", level: 3 },
      { type: "text", value: "The `range()` function is often used with `for` loops to execute a block of code a specific number of times." },
      { type: "code", language: "python", value: '# Prints numbers from 0 to 4\nfor i in range(5):\n    print(i)\n\n# Prints numbers from 2 to 5 (exclusive of 6)\nfor j in range(2, 6):\n    print(j)\n\n# Prints numbers from 1 to 10 with a step of 2\nfor k in range(1, 11, 2):\n    print(k) # 1, 3, 5, 7, 9' },
      { type: "heading", value: "The `while` Loop", level: 2 },
      { type: "text", value: "`while` loops repeat as long as a certain boolean condition is `True`." },
      { type: "code", language: "python", value: 'count = 0\nwhile count < 5:\n    print(f"Count is: {count}")\n    count = count + 1 # or count += 1\n\nprint("Loop finished.")' },
      { type: "text", value: "It's important to ensure that the condition eventually becomes `False`, otherwise, you'll create an infinite loop." },
      { type: "heading", value: "Loop Control Statements", level: 2 },
      { type: "heading", value: "`break` Statement", level: 3 },
      { type: "text", value: "The `break` statement exits the current loop prematurely." },
      { type: "code", language: "python", value: 'for i in range(10):\n    if i == 5:\n        break # Exit the loop when i is 5\n    print(i)\n# Output: 0, 1, 2, 3, 4' },
      { type: "heading", value: "`continue` Statement", level: 3 },
      { type: "text", value: "The `continue` statement skips the rest of the code inside the loop for the current iteration and proceeds to the next iteration." },
      { type: "code", language: "python", value: 'for i in range(5):\n    if i == 2:\n        continue # Skip printing when i is 2\n    print(i)\n# Output: 0, 1, 3, 4' },
      { type: "heading", value: "`else` Clause in Loops", level: 3 },
      { type: "text", value: "Python loops can also have an `else` clause. For `for` loops, the `else` block is executed after the loop finishes normally (i.e., not terminated by a `break` statement). For `while` loops, it's executed when the condition becomes false." },
      { type: "code", language: "python", value: 'for i in range(3):\n    print(i)\nelse:\n    print("Loop completed without break.")\n\ncount = 0\nwhile count < 3:\n    print(count)\n    count += 1\nelse:\n    print("While loop condition became false.")' }
    ], 
    exercises: [
      { id: "ex4-1", description: "Use a `for` loop and `range()` to print the numbers from 1 to 5 (inclusive).", starterCode: '# Your code here', solution: 'for i in range(1, 6):\n    print(i)', tests: [] },
      { id: "ex4-2", description: "Use a `while` loop to print numbers from 10 down to 1. Print \"Liftoff!\" after the loop.", starterCode: '# Your code here\n\n# print("Liftoff!")', solution: 'count = 10\nwhile count >= 1:\n    print(count)\n    count -= 1\nprint("Liftoff!")', tests: [] }
    ] 
  },
  { 
    id: "5", 
    slug: "functions", 
    title: "Functions", 
    description: "Create reusable blocks of code with functions, arguments, and return values.", 
    category: "Intermediate", 
    estimatedTime: "35 mins", 
    content: [
      { type: "heading", value: "Organizing Code with Functions", level: 1 },
      { type: "text", value: "Functions are reusable blocks of code that perform a specific task. They help organize your code, make it more readable, and avoid repetition (DRY - Don't Repeat Yourself principle)." },
      { type: "heading", value: "Defining a Function", level: 2 },
      { type: "text", value: "You define a function using the `def` keyword, followed by the function name, parentheses `()`, and a colon `:`." },
      { type: "code", language: "python", value: 'def greet():\n    print("Hello, welcome to PyRoutes!")\n    print("Enjoy learning Python.")' },
      { type: "heading", value: "Calling a Function", level: 2 },
      { type: "text", value: "Once a function is defined, you can call it by using its name followed by parentheses." },
      { type: "code", language: "python", value: 'greet()  # This will execute the code inside the greet function' },
      { type: "heading", value: "Function Arguments (Parameters)", level: 2 },
      { type: "text", value: "Functions can accept input values, called arguments or parameters. These are defined within the parentheses in the function definition." },
      { type: "code", language: "python", value: 'def greet_user(name):  # \'name\' is a parameter\n    print(f"Hello, {name}!")\n\ngreet_user("Alice")  # "Alice" is an argument passed to the function\ngreet_user("Bob")' },
      { type: "heading", value: "Default Argument Values", level: 3 },
      { type: "text", value: "You can provide default values for parameters. If an argument for that parameter is not provided when calling the function, the default value is used." },
      { type: "code", language: "python", value: 'def greet_with_default(name="Guest"):\n    print(f"Hello, {name}!")\n\ngreet_with_default()         # Output: Hello, Guest!\ngreet_with_default("Charlie")  # Output: Hello, Charlie!' },
      { type: "heading", value: "Keyword Arguments", level: 3 },
      { type: "text", value: "You can also pass arguments using the parameter names (keywords). This can make your code more readable, especially with functions having many parameters." },
      { type: "code", language: "python", value: 'def describe_pet(animal_type, pet_name):\n    print(f"I have a {animal_type} named {pet_name}.")\n\ndescribe_pet(animal_type="hamster", pet_name="Harry")\ndescribe_pet(pet_name="Lucy", animal_type="dog") # Order doesn\'t matter with keywords' },
      { type: "heading", value: "The `return` Statement", level: 2 },
      { type: "text", value: "Functions can send a value back to the caller using the `return` statement. When a `return` statement is executed, the function exits immediately." },
      { type: "code", language: "python", value: 'def add_numbers(x, y):\n    sum_result = x + y\n    return sum_result\n\nresult = add_numbers(5, 3)\nprint(f"The sum is: {result}")  # Output: The sum is: 8\n\nprint(add_numbers(10, 20))       # Output: 30' },
      { type: "text", value: "A function without an explicit `return` statement, or with a `return` statement without a value, implicitly returns `None`." },
      { type: "heading", value: "Docstrings", level: 2 },
      { type: "text", value: "It's good practice to include a docstring (documentation string) as the first statement in a function's body. It explains what the function does. Docstrings are enclosed in triple quotes." },
      { type: "code", language: "python", value: 'def calculate_area(length, width):\n    """Calculate the area of a rectangle."""\n    return length * width\n\nhelp(calculate_area) # This will display the docstring' }
    ], 
    exercises: [
      { id: "ex5-1", description: "Define a function `multiply(a, b)` that returns the product of two numbers. Call it with `5` and `6` and print the result.", starterCode: '# Define the function multiply here\n\n# Call the function and print the result', solution: 'def multiply(a, b):\n    return a * b\n\nresult = multiply(5, 6)\nprint(result)', tests: [] },
      { id: "ex5-2", description: "Define a function `is_even(number)` that returns `True` if a number is even, and `False` otherwise. Test it with `4` and `7`.", starterCode: '# Define is_even here\n\n# Test cases\n# print(is_even(4))\n# print(is_even(7))', solution: 'def is_even(number):\n    return number % 2 == 0\n\nprint(is_even(4)) # True\nprint(is_even(7)) # False', tests: [] }
    ] 
  },
  { 
    id: "6", 
    slug: "data-structures-lists", 
    title: "Data Structures: Lists", 
    description: "Explore Python lists, their methods, and common use cases for storing ordered collections of items.", 
    category: "Intermediate", 
    estimatedTime: "40 mins", 
    content: [
      { type: "heading", value: "Introduction to Lists", level: 1 },
      { type: "text", value: "A list is an ordered, mutable (changeable) collection of items. Lists are one of the most versatile data structures in Python. They are defined by enclosing comma-separated items in square brackets `[]`." },
      { type: "code", language: "python", value: 'empty_list = []\nnumbers = [1, 2, 3, 4, 5]\nfruits = ["apple", "banana", "cherry"]\nmixed_list = [1, "hello", 3.14, True]' },
      { type: "heading", value: "Accessing List Elements", level: 2 },
      { type: "text", value: "You can access list elements using their index. Python lists are zero-indexed (the first element is at index 0)." },
      { type: "code", language: "python", value: 'fruits = ["apple", "banana", "cherry"]\nprint(fruits[0])  # Output: apple\nprint(fruits[1])  # Output: banana\n\n# Negative indexing (from the end)\nprint(fruits[-1]) # Output: cherry (last item)\nprint(fruits[-2]) # Output: banana (second to last item)' },
      { type: "heading", value: "List Slicing", level: 2 },
      { type: "text", value: "You can get a sub-list (a slice) from a list using the slicing operator `[start:end:step]`." },
      { type: "code", language: "python", value: 'numbers = [0, 1, 2, 3, 4, 5, 6]\nprint(numbers[1:4])    # Output: [1, 2, 3] (elements from index 1 up to, but not including, index 4)\nprint(numbers[:3])     # Output: [0, 1, 2] (from the beginning up to index 3)\nprint(numbers[3:])     # Output: [3, 4, 5, 6] (from index 3 to the end)\nprint(numbers[::2])    # Output: [0, 2, 4, 6] (every second element)' },
      { type: "heading", value: "Modifying Lists", level: 2 },
      { type: "text", value: "Lists are mutable, so you can change their elements." },
      { type: "code", language: "python", value: 'colors = ["red", "green", "blue"]\ncolors[1] = "yellow" # Change the element at index 1\nprint(colors)        # Output: [\'red\', \'yellow\', \'blue\']' },
      { type: "heading", value: "Common List Methods", level: 2 },
      { type: "text", value: "Python provides many useful methods for lists:" },
      { type: "text", value: "`append(item)`: Adds an item to the end of the list." },
      { type: "code", language: "python", value: 'my_list = [1, 2]\nmy_list.append(3)\nprint(my_list)  # Output: [1, 2, 3]' },
      { type: "text", value: "`insert(index, item)`: Inserts an item at a specific index." },
      { type: "code", language: "python", value: 'my_list.insert(1, "new")\nprint(my_list)  # Output: [1, \'new\', 2, 3]' },
      { type: "text", value: "`remove(item)`: Removes the first occurrence of an item." },
      { type: "code", language: "python", value: 'my_list.remove("new")\nprint(my_list)  # Output: [1, 2, 3]' },
      { type: "text", value: "`pop(index=-1)`: Removes and returns the item at a specific index (default is the last item)." },
      { type: "code", language: "python", value: 'popped_item = my_list.pop()\nprint(popped_item) # Output: 3\nprint(my_list)     # Output: [1, 2]' },
      { type: "text", value: "`index(item)`: Returns the index of the first occurrence of an item." },
      { type: "code", language: "python", value: 'print(my_list.index(2)) # Output: 1' },
      { type: "text", value: "`count(item)`: Returns the number of times an item appears in the list." },
      { type: "text", value: "`sort()`: Sorts the list in place (ascending by default)." },
      { type: "text", value: "`reverse()`: Reverses the list in place." },
      { type: "text", value: "`len(list)`: (Not a method, but a built-in function) Returns the number of items in the list." },
      { type: "code", language: "python", value: 'numbers = [3, 1, 4, 1, 5, 9, 2]\nnumbers.sort()\nprint(numbers) # Output: [1, 1, 2, 3, 4, 5, 9]\nnumbers.reverse()\nprint(numbers) # Output: [9, 5, 4, 3, 2, 1, 1]\nprint(len(numbers)) # Output: 7' },
      { type: "heading", value: "Looping Through a List", level: 2 },
      { type: "code", language: "python", value: 'fruits = ["apple", "banana", "cherry"]\nfor fruit in fruits:\n    print(fruit)' }
    ], 
    exercises: [
      { id: "ex6-1", description: "Create a list of your three favorite movies. Then, append a fourth movie to the list and print the updated list.", starterCode: '# Create your list of favorite movies\n# movies = [...]\n\n# Append a new movie\n\n# Print the list', solution: 'movies = ["Inception", "The Matrix", "Interstellar"]\nmovies.append("Parasite")\nprint(movies)', tests: [] },
      { id: "ex6-2", description: "Given a list `numbers = [10, 20, 30, 40, 50]`, use slicing to create a new list containing only `[20, 30]`. Then print the new list.", starterCode: 'numbers = [10, 20, 30, 40, 50]\n# Your slicing code here\n# new_list = ...\n# print(new_list)', solution: 'numbers = [10, 20, 30, 40, 50]\nnew_list = numbers[1:3]\nprint(new_list)', tests: [] }
    ] 
  },
  { 
    id: "7", 
    slug: "data-structures-dictionaries", 
    title: "Data Structures: Dictionaries", 
    description: "Understand key-value pairs using dictionaries for flexible data storage and retrieval.", 
    category: "Intermediate", 
    estimatedTime: "40 mins", 
    content: [
      { type: "heading", value: "Introduction to Dictionaries", level: 1 },
      { type: "text", value: "A dictionary is an unordered collection of key-value pairs. Dictionaries are mutable and are defined using curly braces `{}` with keys and values separated by a colon `:`." },
      { type: "text", value: "Keys must be unique and immutable (e.g., strings, numbers, tuples). Values can be of any data type." },
      { type: "code", language: "python", value: 'empty_dict = {}\nstudent = {\n    "name": "Alice",\n    "age": 20,\n    "major": "Computer Science",\n    "is_enrolled": True\n}\nprint(student)' },
      { type: "heading", value: "Accessing Values", level: 2 },
      { type: "text", value: "You access values in a dictionary using their corresponding keys inside square brackets `[]`." },
      { type: "code", language: "python", value: 'print(student["name"])  # Output: Alice\nprint(student["age"])   # Output: 20' },
      { type: "text", value: "If you try to access a key that doesn't exist, it will raise a `KeyError`. A safer way is to use the `get()` method, which returns `None` (or a specified default value) if the key is not found." },
      { type: "code", language: "python", value: 'print(student.get("grade"))  # Output: None\nprint(student.get("grade", "Not available")) # Output: Not available' },
      { type: "heading", value: "Modifying Dictionaries", level: 2 },
      { type: "text", value: "Dictionaries are mutable." },
      { type: "heading", value: "Adding or Updating Items", level: 3 },
      { type: "text", value: "You can add a new key-value pair or update an existing value by assigning to a key:" },
      { type: "code", language: "python", value: 'student["city"] = "New York"  # Add new key-value pair\nstudent["age"] = 21           # Update existing value\nprint(student)' },
      { type: "heading", value: "Removing Items", level: 3 },
      { type: "text", value: "Use the `pop(key)` method to remove an item by its key (it also returns the value)." },
      { type: "text", value: "Use the `del` keyword to remove an item by its key." },
      { type: "text", value: "Use `popitem()` to remove and return an arbitrary (key, value) item (LIFO since Python 3.7)." },
      { type: "text", value: "Use `clear()` to remove all items from the dictionary." },
      { type: "code", language: "python", value: 'removed_major = student.pop("major")\nprint(f"Removed major: {removed_major}")\n\ndel student["is_enrolled"]\nprint(student)\n\n# student.clear() # This would empty the dictionary' },
      { type: "heading", value: "Common Dictionary Methods", level: 2 },
      { type: "text", value: "`keys()`: Returns a view object that displays a list of all the keys." },
      { type: "text", value: "`values()`: Returns a view object that displays a list of all the values." },
      { type: "text", value: "`items()`: Returns a view object that displays a list of a dictionary's key-value tuple pairs." },
      { type: "code", language: "python", value: 'print(list(student.keys()))\nprint(list(student.values()))\nprint(list(student.items()))' },
      { type: "text", value: "`update(other_dict)`: Updates the dictionary with key-value pairs from another dictionary or an iterable of key-value pairs." },
      { type: "heading", value: "Looping Through a Dictionary", level: 2 },
      { type: "text", value: "You can loop through keys, values, or key-value pairs." },
      { type: "code", language: "python", value: '# Loop through keys (default behavior)\nfor key in student:\n    print(f"Key: {key}, Value: {student[key]}")\n\n# Loop through values\nfor value in student.values():\n    print(value)\n\n# Loop through key-value pairs\nfor key, value in student.items():\n    print(f"{key}: {value}")' }
    ], 
    exercises: [
      { id: "ex7-1", description: "Create a dictionary representing a book with keys 'title', 'author', and 'year'. Print the author of the book.", starterCode: '# Create the book dictionary\n# book = {...}\n\n# Print the author', solution: 'book = {\n    "title": "1984",\n    "author": "George Orwell",\n    "year": 1949\n}\nprint(book["author"])', tests: [] },
      { id: "ex7-2", description: "Given the `student` dictionary from the lesson, add a new key-value pair: `'gpa': 3.8`. Then, update the `'age'` to `22`. Print the modified dictionary.", starterCode: 'student = {\n    "name": "Alice",\n    "age": 21,\n    "city": "New York"\n}\n# Add GPA and update age\n\n# Print the student dictionary', solution: 'student = {\n    "name": "Alice",\n    "age": 21,\n    "city": "New York"\n}\nstudent["gpa"] = 3.8\nstudent["age"] = 22\nprint(student)', tests: [] }
    ] 
  }
];

function LessonPageContent() {
  const params = useParams();
  const router = useRouter();
  const { toast } = useToast();
  const { user, userProfile, updateUserProgress, loading: authLoading } = useAuth();

  const [lesson, setLesson] = useState<Lesson | null>(null);
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);
  const [userCode, setUserCode] = useState<Record<string, string>>({}); // exerciseId: code
  const [exerciseFeedback, setExerciseFeedback] = useState<Record<string, { correct: boolean | null, message?: string }>>({});
  const [isLoading, setIsLoading] = useState(true);
  
  const [aiQuestion, setAiQuestion] = useState("");
  const [aiAnswer, setAiAnswer] = useState("");
  const [isAiLoading, setIsAiLoading] = useState(false);

  useEffect(() => {
    const lessonSlug = params.lessonSlug as string;
    const foundLesson = mockLessons.find(l => l.slug === lessonSlug);
    if (foundLesson) {
      setLesson(foundLesson);
      const initialCode: Record<string, string> = {};
      foundLesson.exercises.forEach(ex => {
        initialCode[ex.id] = ex.starterCode;
      });
      setUserCode(initialCode);
      
      // Update current lesson in user's progress if it's different
      if (userProfile?.progress?.currentLesson !== foundLesson.id) {
        updateUserProgress({ currentLesson: foundLesson.id });
      }

    } else {
      router.push('/lessons'); // Or a 404 page
    }
    setIsLoading(false);
  }, [params.lessonSlug, router, userProfile, updateUserProgress]);

  const handleCodeChange = (exerciseId: string, code: string) => {
    setUserCode(prev => ({ ...prev, [exerciseId]: code }));
    setExerciseFeedback(prev => ({...prev, [exerciseId]: { correct: null }})); // Reset feedback on code change
  };

  const handleRunCode = (exercise: Exercise) => {
    // Simplified: For now, we'll just check if the solution is somewhat included or if it's not empty
    // In a real app, this would involve a backend execution environment or more complex client-side checks.
    const studentCode = userCode[exercise.id]?.trim();
    const solutionCode = exercise.solution?.trim();
    
    // Basic check: If solution exists, check if user code is similar or not empty.
    // This is very naive and for demo purposes only.
    let isCorrect = false;
    let feedbackMessage = "Keep trying!";

    if (solutionCode) {
      if (studentCode === solutionCode) {
        isCorrect = true;
        feedbackMessage = "Excellent! Your solution is correct.";
      } else if (studentCode && studentCode.length > (solutionCode.length / 2)) {
        // Heuristic: if it's somewhat long and different, maybe it's a good attempt.
        isCorrect = true; // Let's be generous for demo
        feedbackMessage = "Good attempt! Check the solution if you're stuck.";
      } else if (studentCode) {
        feedbackMessage = "Your code seems a bit different from the solution. Try to match the logic.";
      } else {
        feedbackMessage = "Looks like you haven't written any code yet.";
      }
    } else if (studentCode) { // No solution provided, just check if code was written
      isCorrect = true;
      feedbackMessage = "Code submitted. No automated check for this exercise.";
    }

    setExerciseFeedback(prev => ({
      ...prev,
      [exercise.id]: { correct: isCorrect, message: feedbackMessage }
    }));

    if (isCorrect) {
      toast({ title: "Exercise Check", description: feedbackMessage });
      // Optionally, save exercise completion status to user progress
      if(user && lesson) {
        const newScores = {
          ...(userProfile?.progress?.exerciseScores || {}),
          [exercise.id]: { score: 100, completed: true, lastAttempt: studentCode }
        };
        updateUserProgress({ exerciseScores: newScores });
      }
    } else {
       toast({ title: "Exercise Check", description: feedbackMessage, variant: "destructive" });
    }
  };

  const handleNext = async () => {
    if (!lesson || !user) return;

    const currentCompletedLessons = userProfile?.progress?.completedLessons || [];
    const newCompletedLessons = Array.from(new Set([...currentCompletedLessons, lesson.id]));

    if (currentExerciseIndex < lesson.exercises.length - 1) {
      setCurrentExerciseIndex(prev => prev + 1);
      await updateUserProgress({ completedLessons: newCompletedLessons, currentLesson: lesson.id });
    } else {
      // Last exercise, move to next lesson or dashboard
      const currentLessonIndexInMock = mockLessons.findIndex(l => l.id === lesson.id);
      const nextLessonInMock = mockLessons[currentLessonIndexInMock + 1];
      
      if (nextLessonInMock) {
        await updateUserProgress({ completedLessons: newCompletedLessons, currentLesson: nextLessonInMock.id });
        router.push(`/lessons/${nextLessonInMock.slug}`);
      } else {
        await updateUserProgress({ completedLessons: newCompletedLessons, currentLesson: undefined });
        toast({ title: "Lesson Series Completed!", description: "Great job! You've finished all available lessons in this series." });
        router.push('/dashboard');
      }
    }
  };

  const handlePrev = () => {
    if (currentExerciseIndex > 0) {
      setCurrentExerciseIndex(prev => prev - 1);
    }
  };

  const handleAskAI = async () => {
    if (!aiQuestion.trim()) return;
    setIsAiLoading(true);
    setAiAnswer("");
    try {
      const input: AnswerPythonQuestionInput = { question: aiQuestion };
      const result = await answerPythonQuestion(input);
      setAiAnswer(result.answer);
    } catch (error) {
      console.error("AI Question Error:", error);
      setAiAnswer("Sorry, I couldn't process your question right now. Please try again.");
      toast({ title: "AI Error", description: "Could not get an answer from the AI.", variant: "destructive" });
    } finally {
      setIsAiLoading(false);
    }
  };

  const renderContentPart = (part: LessonContentPart, index: number) => {
    switch (part.type) {
      case 'heading':
        const Tag = `h${part.level || 2}` as keyof JSX.IntrinsicElements;
        return <Tag key={index} className={`font-headline mt-6 mb-3 ${part.level === 1 ? 'text-3xl' : part.level === 2 ? 'text-2xl' : 'text-xl'} font-bold`}>{part.value}</Tag>;
      case 'text':
        return <p key={index} className="mb-4 text-base leading-relaxed" dangerouslySetInnerHTML={{ __html: part.value.replace(/`([^`]+)`/g, '<code class="bg-muted px-1 py-0.5 rounded text-sm font-mono">$1</code>') }} />;
      case 'code':
        return (
          <pre key={index} className="bg-muted p-4 rounded-md overflow-x-auto text-sm mb-4">
            <code className={`language-${part.language || 'python'} font-code`}>{part.value}</code>
          </pre>
        );
      default:
        return null;
    }
  };
  
  if (isLoading || authLoading || !lesson) {
    return (
      <AppLayout>
        <div className="container mx-auto py-8 px-4 md:px-6 lg:px-8">
          <Skeleton className="h-10 w-3/4 mb-4" />
          <Skeleton className="h-6 w-1/2 mb-8" />
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <Skeleton className="h-48 w-full mb-4" />
              <Skeleton className="h-24 w-full" />
            </div>
            <div>
              <Skeleton className="h-72 w-full" />
            </div>
          </div>
        </div>
      </AppLayout>
    );
  }

  const currentExercise = lesson.exercises[currentExerciseIndex];
  const isLastExercise = currentExerciseIndex === lesson.exercises.length - 1;

  return (
    <AppLayout>
      <div className="container mx-auto py-8 px-4 md:px-6 lg:px-8 max-w-6xl">
        <div className="mb-8">
          <Link href="/lessons" className="text-sm text-primary hover:underline flex items-center gap-1">
            <ArrowLeft className="h-4 w-4" /> Back to All Lessons
          </Link>
          <h1 className="text-4xl font-bold mt-2 mb-2 font-headline">{lesson.title}</h1>
          <p className="text-muted-foreground text-lg">{lesson.description}</p>
           <div className="mt-1 text-xs text-muted-foreground">
              <span>{lesson.category}</span> &middot; <span>Estimated time: {lesson.estimatedTime}</span>
            </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="font-headline text-2xl">Lesson Content</CardTitle>
              </CardHeader>
              <CardContent className="prose prose-lg max-w-none">
                {lesson.content.map(renderContentPart)}
              </CardContent>
            </Card>

            {currentExercise && (
              <Card className="mt-8 shadow-lg">
                <CardHeader>
                  <CardTitle className="font-headline text-2xl">
                    Exercise {currentExerciseIndex + 1} of {lesson.exercises.length}: {currentExercise.description}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Textarea
                    value={userCode[currentExercise.id] || ''}
                    onChange={(e) => handleCodeChange(currentExercise.id, e.target.value)}
                    placeholder="Write your Python code here..."
                    rows={8}
                    className="font-mono text-sm bg-background border-input"
                  />
                  <div className="mt-4 flex gap-2">
                    <Button onClick={() => handleRunCode(currentExercise)} disabled={isAiLoading}>
                      <Code className="mr-2 h-4 w-4" /> Run Code
                    </Button>
                     <Button variant="outline" onClick={() => setUserCode(prev => ({...prev, [currentExercise.id]: currentExercise.starterCode}))}>
                      Reset Code
                    </Button>
                  </div>
                  {exerciseFeedback[currentExercise.id]?.message && (
                     <Alert className={`mt-4 ${exerciseFeedback[currentExercise.id]?.correct ? 'border-green-500' : 'border-destructive'}`}>
                       <AlertTitle className={exerciseFeedback[currentExercise.id]?.correct ? 'text-green-700' : 'text-destructive'}>
                         {exerciseFeedback[currentExercise.id]?.correct ? "Feedback" : "Needs Improvement"}
                       </AlertTitle>
                       <AlertDescription>
                         {exerciseFeedback[currentExercise.id]?.message}
                       </AlertDescription>
                     </Alert>
                  )}
                </CardContent>
                <CardContent className="border-t pt-6">
                   <div className="flex justify-between items-center">
                    <Button onClick={handlePrev} disabled={currentExerciseIndex === 0} variant="outline">
                      <ArrowLeft className="mr-2 h-4 w-4" /> Previous
                    </Button>
                    <span className="text-sm text-muted-foreground">
                      Exercise {currentExerciseIndex + 1} / {lesson.exercises.length}
                    </span>
                    <Button onClick={handleNext} className="bg-primary hover:bg-primary/90">
                      {isLastExercise ? "Finish & Go to Dashboard" : "Next Exercise"}
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          <div className="lg:col-span-1 sticky top-24 self-start">
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 font-headline">
                  <Sparkles className="h-6 w-6 text-accent" /> AI Assistant
                </CardTitle>
                <CardDescription>Stuck? Ask a question about this Python concept.</CardDescription>
              </CardHeader>
              <CardContent>
                <Textarea
                  value={aiQuestion}
                  onChange={(e) => setAiQuestion(e.target.value)}
                  placeholder="e.g., What's the difference between a list and a tuple?"
                  rows={3}
                  disabled={isAiLoading}
                  className="bg-background border-input"
                />
                <Button onClick={handleAskAI} className="mt-3 w-full" disabled={isAiLoading || !aiQuestion.trim()}>
                  {isAiLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Ask AI
                </Button>
                { (isAiLoading || aiAnswer) && (
                  <ScrollArea className="mt-4 h-[200px] w-full rounded-md border p-3 bg-muted/50 text-sm">
                    {isAiLoading && (
                      <div className="flex justify-start">
                         <div className="p-2 rounded-lg bg-muted text-sm">Thinking... <Loader2 className="inline h-3 w-3 animate-spin"/></div>
                      </div>
                    )}
                    {aiAnswer && <div className="whitespace-pre-wrap">{aiAnswer}</div>}
                  </ScrollArea>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}


// This is a temporary workaround for the hydration error with Suspense and useParams.
// The issue seems to be that useParams might return null on initial server render.
export default function LessonPageWithSuspense() {
  // Ensure params are available before rendering the main content
  const params = useParams();
  if (!params.lessonSlug) {
    // You could return a loading skeleton here too if desired,
    // or rely on the AppLayout's loading state if appropriate.
    return (
      <AppLayout>
        <div className="container mx-auto py-8 px-4">Loading lesson...</div>
      </AppLayout>
    );
  }
  return <LessonPageContent />;
}


// NOTE: The DashboardPage component below seems to be a leftover or misplaced.
// The main dashboard is at /src/app/dashboard/page.tsx.
// This definition might cause confusion or errors if not intended.
// For now, it's kept to match the provided file structure, but should be reviewed.
// If this page is meant to be just the lesson display, this DashboardPage component should be removed.

export function DashboardPage() {
  const { user, userProfile, loading: authLoading } = useAuth();
  const [lessons, setLessons] = useState<Lesson[]>(mockLessons); 
  const [showLoadingSkeleton, setShowLoadingSkeleton] = useState(true);

  useEffect(() => {
    if (!authLoading) {
      const timer = setTimeout(() => setShowLoadingSkeleton(false), 200);
      return () => clearTimeout(timer);
    } else {
      setShowLoadingSkeleton(true);
    }
  }, [authLoading]);

  if (showLoadingSkeleton || authLoading) {
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

  const currentProgress = userProfile?.progress;
  const totalLessons = lessons.length;
  const completedLessonsCount = currentProgress?.completedLessons?.length || 0;
  const overallProgress = totalLessons > 0 ? (completedLessonsCount / totalLessons) * 100 : 0;

  const nextLesson = 
    lessons.find(lesson => !currentProgress?.completedLessons?.includes(lesson.id)) || 
    (currentProgress?.currentLesson ? lessons.find(l => l.id === currentProgress.currentLesson) : lessons[0]) ||
    lessons[0]; 


  return (
    <AppLayout>
      <div className="container mx-auto py-8 px-4 md:px-6 lg:px-8">
        <h1 className="text-3xl font-bold mb-2 font-headline">
          Welcome back, {userProfile?.displayName || user?.displayName || "Learner"}!
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
                      {currentProgress?.completedLessons?.includes(lesson.id) && (
                        <CheckCircle className="h-5 w-5 text-green-500" />
                      )}
                       <Button asChild variant={currentProgress?.completedLessons?.includes(lesson.id) ? "outline" : "default"}>
                        <Link href={`/lessons/${lesson.slug}`}>
                          {currentProgress?.completedLessons?.includes(lesson.id) ? "Review" : "Start"}
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

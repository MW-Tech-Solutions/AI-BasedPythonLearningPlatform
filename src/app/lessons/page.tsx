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

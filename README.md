# PyRoutes - AI-Based Python Learning Platform

This is a Next.js starter project for PyRoutes, an interactive platform for learning Python, built within Firebase Studio.

## Features

*   Interactive Python lessons
*   In-browser code editor
*   Exercises and progress tracking
*   AI-powered assistant (Gemini) for hints and explanations
*   User authentication and profile management

## Tech Stack

*   **Framework:** Next.js (App Router)
*   **UI:** React, ShadCN UI Components, Tailwind CSS
*   **AI:** Genkit (with Google Gemini)
*   **Backend/DB:** Firebase (Authentication, Firestore)
*   **Language:** TypeScript

---

## Collaboration Guide: Using GitHub & Firebase Studio

This guide explains how to collaborate on this project using GitHub. The repository for this project is: [https://github.com/MW-Tech-Solutions/AI-BasedPythonLearningPlatform](https://github.com/MW-Tech-Solutions/AI-BasedPythonLearningPlatform)

### For the Project Owner (Initial Setup & Pushing to GitHub)

If you are the one who created this project in Firebase Studio and want to share it:

1.  **Initialize Git (if not already done):**
    Open a terminal in your project's root directory (Firebase Studio has an integrated terminal) and run:
    ```bash
    git init -b main
    ```

2.  **Add and Commit Files:**
    Add all your current project files to Git and make your first commit:
    ```bash
    git add .
    git commit -m "Initial commit of PyRoutes project"
    ```
    *Ensure your `.gitignore` file is set up correctly to exclude `node_modules`, `.env.local`, `/.next/`, `/.firebase/`, `*.tar.gz` etc. This has been pre-configured.*

3.  **Add the Remote Repository:**
    Link your local repository to the GitHub repository:
    ```bash
    git remote add origin https://github.com/MW-Tech-Solutions/AI-BasedPythonLearningPlatform.git
    ```

4.  **Push to GitHub:**
    Push your `main` branch to the remote repository:
    ```bash
    git push -u origin main
    ```

Now your project code is on GitHub!

### For the Collaborator (Cloning & Setting Up in Firebase Studio)

If you are joining the project and need to set it up in your Firebase Studio environment:

1.  **Prerequisites:**
    *   **Git:** [Install Git](https://git-scm.com/book/en/v2/Getting-Started-Installing-Git) (usually included with development environments like Firebase Studio).
    *   **Node.js & npm:** [Install Node.js](https://nodejs.org/) (which includes npm). Version 18.x or higher is recommended. Firebase Studio typically manages or provides this.
    *   **Firebase CLI (Optional but Recommended for external management):** [Install Firebase CLI](https://firebase.google.com/docs/cli#setup_update_cli).

2.  **Clone the Repository:**
    *   You can clone the repository to a local directory on your machine. Open your system terminal (or use the terminal within Firebase Studio if you prefer, though cloning is often done outside first):
        ```bash
        git clone https://github.com/MW-Tech-Solutions/AI-BasedPythonLearningPlatform.git
        ```
    *   Navigate into the cloned directory:
        ```bash
        cd AI-BasedPythonLearningPlatform
        ```

3.  **Firebase Project Setup (CRUCIAL - Use YOUR OWN Firebase Project):**
    You **must** set up and use **your own Firebase project** to run this application. You cannot directly use the original owner's Firebase backend. Firebase Studio will use the Firebase project you configure in the steps below.

    *   **Create a Firebase Project:** Go to the [Firebase Console](https://console.firebase.google.com/) and create a new Firebase project (or use an existing one dedicated for your development).
    *   **Enable Authentication:** In *your new* Firebase project, go to "Authentication" (under Build) and enable the "Email/Password" sign-in method.
    *   **Enable Firestore:** In *your new* Firebase project, go to "Firestore Database" (under Build), click "Create database", start in **test mode** for initial development (you can secure it later with proper rules), and choose a location.
    *   **Get Your Firebase Configuration:**
        1.  In *your new* Firebase project, go to "Project Overview" (click the gear icon ⚙️ next to it).
        2.  Select "Project settings".
        3.  Under the "General" tab, scroll down to "Your apps".
        4.  If no web app is registered, click the web icon (`</>`) to "Add app", give it a nickname (e.g., "PyRoutes Dev"), and register it.
        5.  You will see an SDK setup and configuration snippet. Copy the `firebaseConfig` object values (apiKey, authDomain, projectId, etc.). These are **your project's** credentials.

4.  **Configure Environment Variables for Firebase Studio:**
    *   This project uses a `.env.local` file for Firebase credentials. This file is **not** committed to Git for security. Firebase Studio will read from this file in your project directory.
    *   In the root of the cloned `AI-BasedPythonLearningPlatform` project folder (the one you'll open in Firebase Studio), create a new file named `.env.local`.
    *   Copy the content from the `.env` file (which contains placeholders) into your new `.env.local` file.
    *   Replace the placeholder values in `.env.local` with the actual credentials you copied from **YOUR** Firebase project settings in the previous step:
        ```env
        # These are YOUR Firebase project's credentials
        NEXT_PUBLIC_FIREBASE_API_KEY=YOUR_ACTUAL_API_KEY
        NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=YOUR_ACTUAL_AUTH_DOMAIN
        NEXT_PUBLIC_FIREBASE_PROJECT_ID=YOUR_ACTUAL_PROJECT_ID
        NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=YOUR_ACTUAL_STORAGE_BUCKET
        NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=YOUR_ACTUAL_MESSAGING_SENDER_ID
        NEXT_PUBLIC_FIREBASE_APP_ID=YOUR_ACTUAL_APP_ID

        # If using Genkit with a specific API key (often handled by gcloud auth instead for Google Cloud projects)
        # GOOGLE_API_KEY=YOUR_GOOGLE_API_KEY_FOR_GENKIT
        ```
    *   **Save the `.env.local` file.**

5.  **Open in Firebase Studio:**
    *   Open your Firebase Studio application.
    *   Choose the option to "Open an existing project" or "Import project".
    *   Navigate to and select the `AI-BasedPythonLearningPlatform` folder that you cloned from GitHub and where you just configured `.env.local`.
    *   Firebase Studio should recognize it as a Next.js project and open it.

6.  **Install Dependencies (within Firebase Studio):**
    *   Once the project is open in Firebase Studio, open its integrated terminal (usually available at the bottom).
    *   In the terminal, at the root of the project, run:
        ```bash
        npm install
        ```
        (Or `yarn install` if the project uses Yarn). This installs all the necessary packages listed in `package.json`.

7.  **Set Up Firestore Security Rules (for YOUR Firebase Project):**
    *   Go to *your* Firebase project in the [Firebase Console](https://console.firebase.google.com/).
    *   Navigate to **Firestore Database**.
    *   Click on the **Rules** tab.
    *   Replace the existing rules with the following (these are basic rules for this app, adjust as your application's needs evolve):
        ```rules
        rules_version = '2';

        service cloud.firestore {
          match /databases/{database}/documents {

            // Users can read and write their own profile data
            match /users/{userId} {
              allow read, write: if request.auth != null && request.auth.uid == userId;
            }

            // Authenticated users can read lessons
            // Writing lessons is usually done via admin SDK or console
            match /lessons/{lessonId} {
              allow read: if request.auth != null;
              allow write: if false; // Prevent client-side writes by default
            }

            // Add rules for other collections if you have them
          }
        }
        ```
    *   Click **Publish**.

8.  **Run the Project (within Firebase Studio):**
    *   In Firebase Studio's integrated terminal, start the Next.js development server:
        ```bash
        npm run dev
        ```
        Firebase Studio might also offer UI buttons (e.g., a "Run" or "Dev" button) that execute this command.
    *   The application should now be running. Firebase Studio will typically show you the URL (usually `http://localhost:9002` as per `package.json`) where you can access the app in a browser.

9.  **Run Genkit Development Server (for AI features):**
    *   If you plan to work on or test AI features, you'll need to run the Genkit development server.
    *   Open a *new* integrated terminal in Firebase Studio (or use a separate tab in the existing one).
    *   Run:
        ```bash
        npm run genkit:dev
        ```
        Or for auto-reloading on Genkit flow changes:
        ```bash
        npm run genkit:watch
        ```
    *   The Genkit UI (if flows are running) is usually available at `http://localhost:4000`.

You should now have the project running in your Firebase Studio environment, connected to your own Firebase backend.

### General Collaboration Tips

*   **Branching:** Use feature branches for new work (`git checkout -b my-new-feature`). Create Pull Requests on GitHub to merge changes into the `main` branch.
*   **Pulling Changes:** Before starting new work, always pull the latest changes from the `main` branch:
    ```bash
    git checkout main
    git pull origin main
    # Then create your feature branch
    git checkout -b your-feature-branch
    ```
*   **Resolving Conflicts:** If there are merge conflicts, you'll need to resolve them locally (within Firebase Studio's editor or your preferred Git tool) before pushing.
*   **Firebase Emulators (Advanced):** For more isolated local development without affecting a shared cloud Firebase project (even if you each have your own dev project), consider using the [Firebase Emulators](https://firebase.google.com/docs/emulator-suite). This is particularly useful if multiple developers want to test cloud functions or Firestore triggers locally without interference.

---

## Getting Started with Development (After Setup)

Once the project is cloned, configured with your Firebase project, and opened in Firebase Studio:

1.  **Install dependencies (if not already done):**
    (In Firebase Studio's integrated terminal)
    ```bash
    npm install
    ```
2.  **Run the development server:**
    (In Firebase Studio's integrated terminal)
    ```bash
    npm run dev
    ```
    This typically starts the Next.js app on `http://localhost:9002`. Firebase Studio will likely provide a link.

3.  **Run Genkit development server (for AI features, if needed):**
    (In a separate Firebase Studio integrated terminal)
    ```bash
    npm run genkit:dev
    ```
    Or for auto-reloading on Genkit flow changes:
    ```bash
    npm run genkit:watch
    ```

Open `http://localhost:9002` (or the URL provided by Firebase Studio) with your browser to see the result.
The Genkit UI (if flows are running) is usually available at `http://localhost:4000`.

You can start editing the main page by modifying `src/app/page.tsx`.
```

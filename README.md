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

## Collaboration Guide: Using GitHub

This guide explains how to collaborate on this project using GitHub. The repository for this project is: [https://github.com/MW-Tech-Solutions/AI-BasedPythonLearningPlatform](https://github.com/MW-Tech-Solutions/AI-BasedPythonLearningPlatform)

### For the Project Owner (Initial Setup & Pushing to GitHub)

If you are the one who created this project in Firebase Studio and want to share it:

1.  **Initialize Git (if not already done):**
    Open a terminal in your project's root directory and run:
    ```bash
    git init -b main
    ```

2.  **Add and Commit Files:**
    Add all your current project files to Git and make your first commit:
    ```bash
    git add .
    git commit -m "Initial commit of PyRoutes project"
    ```
    *Ensure your `.gitignore` file is set up correctly to exclude `node_modules`, `.env.local`, `/.next/`, `/.firebase/` etc. This has been pre-configured.*

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

### For the Collaborator (Cloning & Setting Up the Project)

If you are joining the project and need to set it up locally:

1.  **Prerequisites:**
    *   **Git:** [Install Git](https://git-scm.com/book/en/v2/Getting-Started-Installing-Git)
    *   **Node.js:** [Install Node.js](https://nodejs.org/) (which includes npm). Version 18.x or higher is recommended.
    *   **Firebase CLI (Optional but Recommended):** [Install Firebase CLI](https://firebase.google.com/docs/cli#setup_update_cli) for managing Firebase projects from your terminal.

2.  **Clone the Repository:**
    Open your terminal and run:
    ```bash
    git clone https://github.com/MW-Tech-Solutions/AI-BasedPythonLearningPlatform.git
    ```
    Navigate into the cloned directory:
    ```bash
    cd AI-BasedPythonLearningPlatform
    ```

3.  **Firebase Project Setup (IMPORTANT):**
    You need to set up **your own Firebase project** to run this application. You cannot directly use the original owner's Firebase backend.

    *   **Create a Firebase Project:** Go to the [Firebase Console](https://console.firebase.google.com/) and create a new project (or use an existing one).
    *   **Enable Authentication:** In your Firebase project, go to "Authentication" (under Build) and enable the "Email/Password" sign-in method.
    *   **Enable Firestore:** Go to "Firestore Database" (under Build), click "Create database", start in **test mode** for initial development (you can secure it later with proper rules), and choose a location.
    *   **Get Firebase Configuration:**
        1.  In your Firebase project, go to "Project Overview" (click the gear icon ⚙️ next to it).
        2.  Select "Project settings".
        3.  Under the "General" tab, scroll down to "Your apps".
        4.  If no web app is registered, click the web icon (`</>`) to "Add app", give it a nickname, and register it.
        5.  You will see an SDK setup and configuration snippet. Copy the `firebaseConfig` object values (apiKey, authDomain, projectId, etc.).

4.  **Configure Local Environment Variables:**
    *   This project uses a `.env.local` file for Firebase credentials. This file is **not** committed to Git for security.
    *   Create a new file named `.env.local` in the root of the cloned project.
    *   Copy the content from the `.env` file (which contains placeholders) into your new `.env.local` file.
    *   Replace the placeholder values in `.env.local` with the actual credentials you copied from **your** Firebase project settings:
        ```env
        NEXT_PUBLIC_FIREBASE_API_KEY=YOUR_ACTUAL_API_KEY
        NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=YOUR_ACTUAL_AUTH_DOMAIN
        NEXT_PUBLIC_FIREBASE_PROJECT_ID=YOUR_ACTUAL_PROJECT_ID
        NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=YOUR_ACTUAL_STORAGE_BUCKET
        NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=YOUR_ACTUAL_MESSAGING_SENDER_ID
        NEXT_PUBLIC_FIREBASE_APP_ID=YOUR_ACTUAL_APP_ID

        # If using Genkit with a specific API key (often handled by gcloud auth instead)
        # GOOGLE_API_KEY=YOUR_GOOGLE_API_KEY_FOR_GENKIT
        ```

5.  **Install Dependencies:**
    In your terminal, at the root of the project, run:
    ```bash
    npm install
    ```
    (Or `yarn install` if you prefer Yarn)

6.  **Set Up Firestore Security Rules:**
    *   Go to your Firebase project in the [Firebase Console](https://console.firebase.google.com/).
    *   Navigate to **Firestore Database**.
    *   Click on the **Rules** tab.
    *   Replace the existing rules with the following (these are basic rules, adjust as your application's needs grow):
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

7.  **Run the Project Locally:**
    Start the Next.js development server:
    ```bash
    npm run dev
    ```
    The application should now be running, typically at `http://localhost:9002` (as per your `package.json`).

8.  **Open in Firebase Studio:**
    *   Open Firebase Studio.
    *   Instead of creating a new project, choose the option to "Open an existing project" or "Import project".
    *   Navigate to and select the `AI-BasedPythonLearningPlatform` folder that you cloned from GitHub.
    *   Firebase Studio should recognize it as a Next.js project and open it.

### General Collaboration Tips

*   **Branching:** Use feature branches for new work (`git checkout -b my-new-feature`). Create Pull Requests on GitHub to merge changes into the `main` branch.
*   **Pulling Changes:** Before starting new work, always pull the latest changes from the `main` branch:
    ```bash
    git checkout main
    git pull origin main
    # Then create your feature branch
    git checkout -b your-feature-branch
    ```
*   **Resolving Conflicts:** If there are merge conflicts, you'll need to resolve them locally before pushing.
*   **Firebase Emulators (Advanced):** For more isolated development, consider using the [Firebase Emulators](https://firebase.google.com/docs/emulator-suite) to run Firebase services locally. This avoids interference between collaborators using the same cloud Firebase project for development.

---

## Getting Started with Development (After Setup)

Once the project is cloned and configured:

1.  **Install dependencies:**
    ```bash
    npm install
    ```
2.  **Run the development server:**
    ```bash
    npm run dev
    ```
    This typically starts the Next.js app on `http://localhost:9002`.

3.  **Run Genkit development server (for AI features):**
    In a separate terminal, run:
    ```bash
    npm run genkit:dev
    ```
    Or for auto-reloading on Genkit flow changes:
    ```bash
    npm run genkit:watch
    ```

Open [http://localhost:9002](http://localhost:9002) with your browser to see the result.
The Genkit UI (if flows are running) is usually available at `http://localhost:4000`.

You can start editing the main page by modifying `src/app/page.tsx`.

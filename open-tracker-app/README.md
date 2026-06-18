# Open Tracker

Open-source app for tracking time spent on tasks running on Tauri + Svelte.

## Recommended IDE Setup

[VS Code](https://code.visualstudio.com/) + [Svelte](https://marketplace.visualstudio.com/items?itemName=svelte.svelte-vscode) + [Tauri](https://marketplace.visualstudio.com/items?itemName=tauri-apps.tauri-vscode) + [rust-analyzer](https://marketplace.visualstudio.com/items?itemName=rust-lang.rust-analyzer).

## Minimal setup to run the app

1. Setup your Firebase project for this app
2. Add 'Authentication' and 'Firestore' modules into your project
3. In Authentication tab allow Google provider and E-mail/password provider
4. Setup default rules for your Firestore DB as following:

```fs
service cloud.firestore {
  match /databases/{database}/documents {

  	match /users/{userId} {
      allow read, write: if request.auth != null
                         && request.auth.uid == userId;

      match /clients/{clientId} {
        allow read, write: if request.auth != null
                           && request.auth.uid == userId;
      }

      match /projects/{projectId} {
        allow read, write: if request.auth != null
                           && request.auth.uid == userId;
      }

      match /tasks/{taskId} {
        allow read, write: if request.auth != null
                           && request.auth.uid == userId;
      }
    }

    match /{document=**} {
      allow read, write: if false;
    }
  }
}
```

5. Copy the content of `.env.example` into `.env` and fill the values from your Firebase project config
6. Run the project in dev mode using `npm run dev` or in Tauri dev mode `npm run tauri dev`

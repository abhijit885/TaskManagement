# WatermelonDB Offline-First Setup Guide

This guide explains the WatermelonDB integration for offline-first functionality with Firebase Firestore sync.

## 📦 Installation

Run the following commands to install all required dependencies:

```bash
# Install WatermelonDB and related packages
npm install @nozbe/watermelondb @nozbe/with-observables --save --legacy-peer-deps

# OR with Yarn
yarn add @nozbe/watermelondb @nozbe/with-observables

# Install Babel decorator plugin (for TypeScript decorators)
npm install @babel/plugin-proposal-decorators --save-dev --legacy-peer-deps

# OR with Yarn  
yarn add -D @babel/plugin-proposal-decorators
```

## 🍎 iOS Setup

1. **Install Pods:**

```bash
cd ios && pod install && cd ..
```

2. **If you encounter build issues**, clean and reinstall:

```bash
cd ios
rm -rf Pods Podfile.lock
pod install
cd ..
```

## 🤖 Android Setup

The `android/app/build.gradle` has already been configured with:

- NDK ABI filters for WatermelonDB JSI
- Packaging options for native libraries

If you face any issues, ensure the following is in `android/app/build.gradle`:

```gradle
android {
    defaultConfig {
        // ... other config
        ndk {
            abiFilters "armeabi-v7a", "arm64-v8a", "x86", "x86_64"
        }
    }
    
    packagingOptions {
        pickFirst '**/libc++_shared.so'
    }
}
```

## 🚀 Running the App

```bash
# Clear Metro bundler cache (recommended after setup)
npx react-native start --reset-cache

# Run on Android
npx react-native run-android

# Run on iOS
npx react-native run-ios
```

## 📁 Project Structure

```
lib/src/database/watermelon/
├── database.ts          # Database initialization
├── schema.ts            # Table schemas
├── index.ts             # Exports
├── models/
│   ├── Todo.ts          # Todo model with decorators
│   ├── User.ts          # User model with decorators
│   └── index.ts         # Model exports
└── sync/
    └── syncService.ts   # Firebase sync logic
```

## 🔄 How the Sync Works

### Offline-First Architecture

1. **All data operations go through local WatermelonDB first**
2. **Changes are marked with a sync status:** `created`, `updated`, `deleted`, or `synced`
3. **When online**, changes are automatically pushed to Firebase
4. **When coming back online**, pending changes are synced automatically

### Sync Status Flow

```
User makes changes → Save to WatermelonDB (immediate) → Mark as unsynced
                                ↓
                    Network available? 
                          ↓
                    Yes → Push to Firebase → Mark as synced
                          ↓
                    No → Keep in queue → Auto-sync when online
```

## 🛠️ Using the Sync Service

### In your components:

```typescript
import { syncService } from '../../database/watermelon';

// Initialize sync service (in useEffect)
useEffect(() => {
  syncService.init();  // Start network listener
  return () => syncService.cleanup();  // Cleanup on unmount
}, []);

// Add a todo (works offline!)
const todo = await syncService.addTodo({
  name: 'John Doe',
  age: 25,
  isChecked: false,
});

// Update a todo (works offline!)
await syncService.updateTodo(todo.id, {
  name: 'Updated Name',
  age: 30,
});

// Delete a todo (works offline!)
await syncService.deleteTodo(todo.id);

// Get all todos from local DB
const todos = await syncService.getTodos();

// Manual sync trigger
await syncService.fullSync();

// Pull latest from Firebase
await syncService.pullFromFirebase();

// Push local changes to Firebase
await syncService.syncToFirebase();
```

## ✨ Features Implemented

- ✅ **addTodo()** - Works offline, syncs when online
- ✅ **updateUser()** - Works offline, syncs when online
- ✅ **deleteUser()** - Works offline, syncs when online
- ✅ **getUsers()** - Always reads from fast local DB
- ✅ **Automatic sync on network restore**
- ✅ **Pull-to-refresh for manual sync**
- ✅ **Offline indicator banner**
- ✅ **Bidirectional sync (push & pull)**

## 🔧 Troubleshooting

### Build fails on iOS
```bash
cd ios
rm -rf Pods Podfile.lock build
pod install
cd ..
npx react-native run-ios
```

### Build fails on Android
```bash
cd android
./gradlew clean
cd ..
npx react-native run-android
```

### Metro bundler issues
```bash
npx react-native start --reset-cache
```

### TypeScript decorator errors
Ensure your `tsconfig.json` has:
```json
{
  "compilerOptions": {
    "experimentalDecorators": true,
    "emitDecoratorMetadata": true
  }
}
```

## 📝 Notes

- WatermelonDB uses SQLite under the hood for fast, persistent storage
- All CRUD operations work instantly (offline-first)
- Firebase sync happens automatically when connectivity is restored
- The app shows an offline indicator when disconnected
- Pull-to-refresh triggers a full bidirectional sync


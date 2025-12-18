# Task Management App

A React Native application for managing tasks with Firebase authentication, real-time notifications, and local SQLite database storage.

## 📋 Features

- **User Authentication**: Sign up and login with Firebase
- **Task Management**: Create, read, update, and delete tasks
- **Push Notifications**: Firebase Cloud Messaging (FCM) integration with local notifications
- **Offline Support**: Local SQLite database for offline task access
- **Network Detection**: Real-time network connectivity monitoring
- **Theme Support**: Light theme with customizable styling
- **Safe Area Handling**: Responsive design across different devices

## 📝 Available Scripts

```bash
# Start development server
npm start

# Build for Android
npm run android

# Build for iOS
npm run ios

# Run tests
npm test

# Format code
npm run format
```

## 🛠️ Tech Stack

### Core Framework
- **React Native** - Cross-platform mobile development
- **TypeScript** - Type-safe development

### State Management & Navigation
- **Redux** - State management
- **React Navigation** - Navigation between screens
- **React Navigation Stack** - Stack-based navigation

### Authentication & Backend
- **Firebase Authentication** - User authentication
- **Firebase Cloud Messaging** - Push notifications
- **@react-native-firebase/messaging** - FCM integration

### Local Storage & Database
- **SQLite** (`react-native-sqlite-storage`) - Local database
- **AsyncStorage** - Key-value storage

### UI & Notifications
- **@notifee/react-native** - Local notifications
- **react-native-toast-message** - Toast notifications
- **react-native-safe-area-context** - Safe area management

### Utilities
- **@react-native-community/netinfo** - Network status detection

## 📁 Project Structure

```
lib/
├── src/
│   ├── common/              # Common utilities and services
│   │   ├── commonFunction.ts
│   │   ├── notifeeService.ts
│   │   └── responsiveFontSize.ts
│   ├── database/            # SQLite database setup
│   │   └── db.ts
│   ├── firebase/            # Firebase configuration
│   │   └── config.ts
│   ├── navigation/          # Navigation setup
│   │   ├── AppNavigator.tsx      # Auth navigation
│   │   └── MainNavigator.tsx     # Main app navigation
│   ├── redux/               # Redux store & slices
│   │   ├── store.ts
│   │   ├── reduxHooks.ts
│   │   └── slices/
│   │       ├── authSlice.tsx
│   │       └── profileSlice.ts
│   ├── screens/             # Screen components
│   │   ├── auth/
│   │   │   ├── LoginScreen.tsx
│   │   │   ├── SignUpScreen.tsx
│   │   │   └── SplashScreen.tsx
│   │   └── home/
│   │       └── HomeScreen.tsx
│   ├── services/            # API & business logic
│   │   ├── authService.ts
│   │   ├── storageService.ts
│   │   └── taskService.ts
│   ├── theme/               # Theme & styling
│   │   ├── colors.ts
│   │   └── ThemeContext.tsx
│   └── types/               # TypeScript types
│       └── task.ts
└── assets/                  # Static assets
```

## 🚀 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- React Native CLI
- Android Studio (for Android development)
- Xcode (for iOS development)
- Firebase project setup

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd TaskManagement
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Configure Firebase**
   - Update `lib/src/firebase/config.ts` with your Firebase credentials
   - Ensure you have the `google-services.json` (Android) and `GoogleService-Info.plist` (iOS)

4. **Start Metro bundler**
   ```bash
   npm start
   # or
   yarn start
   ```

5. **Run on Android**
   ```bash
   npm run android
   # or
   yarn android
   ```

6. **Run on iOS**
   ```bash
   npm run ios
   # or
   yarn ios
   ```

## 📱 App Screens

### Authentication Flow
- **SplashScreen**: Initial loading screen
- **LoginScreen**: User login with email/password
- **SignUpScreen**: User registration with email/password

### Main App
- **HomeScreen**: Task list display and management

## 🔐 Authentication

The app uses Firebase Authentication with the following flow:
1. User signs up with email and password
2. Token is stored and managed via Redux
3. Token is persisted in AsyncStorage
4. Automatic login on app restart if token exists

## 📲 Notifications

### Push Notifications (FCM)
- Requests user permission on app launch
- Receives background and foreground notifications
- Displays local notifications using Notifee
- Navigation based on notification data

### Types of Notifications
- **Foreground**: Displayed as local notification while app is active
- **Background**: Handled by background message handler
- **Terminated**: Initial notification on app cold start

## 💾 Database

### SQLite Tables
- **tasks**: Stores task data with fields:
  - `id` (INTEGER PRIMARY KEY)
  - `title` (TEXT)
  - `description` (TEXT)
  - `completed` (INTEGER)
  - `createdAt` (TEXT)

**Version**: 1.0.0
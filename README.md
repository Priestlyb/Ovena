# Ovena — Frontend

Ovena is a multi-application food delivery platform built with React Native and Expo. This repository contains the frontend applications used by customers, restaurants, riders, and platform administrators.

The applications are maintained as separate Expo projects within the same repository, allowing each product surface to have its own navigation, state management, dependencies, and release configuration.

---

## Applications

| Application        | Purpose                                                                                                                |
| ------------------ | ---------------------------------------------------------------------------------------------------------------------- |
| **User App**       | Customer-facing application for discovering restaurants, managing orders, payments, deliveries, and account settings.  |
| **Restaurant App** | Restaurant-facing application for managing restaurant operations, orders, menus, notifications, and related workflows. |
| **Rider App**      | Delivery application for riders responsible for delivery and location-based operations.                                |
| **Admin App**      | Administrative application for managing and monitoring the Ovena platform.                                             |

---

## Technology

### Core

* React Native `0.81.5`
* React `19.1`
* Expo SDK `54`
* Expo Router
* TypeScript `5.9`

### Supporting Technologies

Depending on the application, the repository uses:

* Axios
* TanStack React Query
* Zustand
* React Navigation
* Expo SecureStore
* Expo Notifications
* Expo Location
* React Native Maps
* React Native Reanimated
* React Native SVG
* Expo Image Picker
* Expo Document Picker
* Google Sign-In
* Apple Authentication
* Firebase services

Each application maintains its own dependency set based on its functional requirements.

---

## Repository Structure

```text
ovena/
│
├── user/
│   ├── app/
│   ├── assets/
│   ├── components/
│   ├── constants/
│   ├── context/
│   ├── services/
│   ├── package.json
│   └── ...
│
├── restaurant/
│   ├── app/
│   ├── assets/
│   ├── components/
│   ├── services/
│   ├── stores/
│   ├── package.json
│   └── ...
│
├── rider/
│   ├── app/
│   ├── assets/
│   ├── components/
│   ├── services/
│   ├── package.json
│   └── ...
│
├── admin/
│   ├── app/
│   ├── assets/
│   ├── components/
│   ├── services/
│   ├── package.json
│   └── ...
│
└── README.md
```

> Directory names above should be adjusted to match the actual repository structure.

---

# User App

The User App is the primary customer application within the Ovena ecosystem.

### Responsibilities

* Restaurant discovery
* Menu browsing
* Cart management
* Order creation and management
* Delivery options
* Payment flows
* Customer authentication
* Account management
* Push notifications
* Location-based functionality

### Main Dependencies

```text
Expo
Expo Router
React Native
TypeScript
Axios
Expo SecureStore
Google Sign-In
Apple Authentication
Expo Location
React Navigation
```

---

# Restaurant App

The Restaurant App provides the operational interface for restaurants on the Ovena platform.

### Responsibilities

* Restaurant management
* Menu management
* Order management
* Order status updates
* Notifications
* Image and document management
* Location-based functionality
* Restaurant account management

### Main Dependencies

```text
Expo
Expo Router
React Native
TypeScript
Axios
TanStack React Query
Zustand
Expo Notifications
Expo Location
Expo Image Picker
Expo Document Picker
Expo File System
Lucide React Native
```

---

# Rider App

The Rider App is designed for delivery personnel and supports delivery-related workflows.

### Responsibilities

* Rider authentication
* Delivery management
* Location services
* Map-based functionality
* Camera functionality
* Image capture
* Rider verification workflows

### Main Dependencies

```text
Expo
Expo Router
React Native
TypeScript
React Native Maps
Expo Camera
Expo Image Picker
Expo Face Detector
React Native Reanimated
```

---

# Admin App

The Admin App provides administrative access to the Ovena platform.

Its responsibilities include platform-level management and administrative workflows.

The Admin App is maintained independently from the customer, restaurant, and rider applications.

---

# Architecture

Ovena follows a **multi-application frontend architecture**.

```text
                         Ovena Platform
                              │
                              │
                    ┌─────────┴─────────┐
                    │                   │
              Backend API          External Services
                    │                   │
          ┌─────────┼─────────┐    ┌────┴────┐
          │         │         │    │         │
          ▼         ▼         ▼    ▼         ▼
        User    Restaurant   Rider  Payments  Notifications
        App        App        App
          │         │         │
          └─────────┼─────────┘
                    │
                    ▼
                Admin App
```

Each frontend communicates with the backend through HTTP APIs and is responsible for its own presentation, navigation, local state, and application-specific business logic.

---

# Environment Configuration

Applications should use environment variables for environment-specific configuration.

Example:

```env
EXPO_PUBLIC_API_URL=https://your-api-url.com/api
```

Create the appropriate environment file inside the application being developed.

```text
user/
└── .env

restaurant/
└── .env

rider/
└── .env

admin/
└── .env
```

Do not commit sensitive credentials or secrets to the repository.

---

# Getting Started

## Prerequisites

Ensure the following are installed:

* Node.js
* npm
* Git
* Expo tooling
* Android Studio for Android development
* Xcode for iOS development on macOS

Verify Node.js:

```bash
node --version
```

Verify npm:

```bash
npm --version
```

---

## Installation

Clone the repository:

```bash
git clone <repository-url>
```

Navigate into the repository:

```bash
cd <repository-directory>
```

Each application has its own `package.json`.

Install dependencies for the application you want to work on:

```bash
cd user
npm install
```

For the Restaurant App:

```bash
cd restaurant
npm install
```

For the Rider App:

```bash
cd rider
npm install
```

Repeat the process for the Admin App.

---

# Development

Each application runs independently.

Start the development server:

```bash
npm start
```

Run on Android:

```bash
npm run android
```

Run on iOS:

```bash
npm run ios
```

Run on web:

```bash
npm run web
```

Lint the project:

```bash
npm run lint
```

Some native features require a development build or physical device rather than Expo Go.

---

# Native Development

The applications use native capabilities including:

* Push notifications
* Maps
* Location
* Camera
* Google authentication
* Apple authentication
* Secure storage
* File system access

When working with native dependencies, ensure the local Android/iOS environments are correctly configured.

For Expo environment diagnostics:

```bash
npx expo-doctor
```

---

# Application Ownership

The frontend applications were developed collaboratively.

| Application    | Primary Frontend Developer |
| -------------- | -------------------------- |
| User App       | Priestly                   |
| Restaurant App | Priestly                   |
| Rider App      | Frontend Collaborator      |
| Admin App      | Frontend Collaborator      |

Ownership refers to primary frontend implementation responsibility and does not exclude contributions from other members of the development team.

---

# Development Workflow

Create a dedicated branch for each feature or fix:

```bash
git checkout -b feature/<feature-name>
```

Examples:

```bash
git checkout -b feature/order-tracking
git checkout -b fix/cart-persistence
git checkout -b feat/restaurant-notifications
```

After completing the work:

```bash
git add .
git commit -m "feat: add order tracking"
git push origin feature/order-tracking
```

Open a Pull Request for review.

---

# Commit Convention

Use descriptive commit messages following a conventional format where possible.

```text
feat: add restaurant order management
fix: resolve cart persistence issue
refactor: simplify authentication flow
chore: update Expo dependencies
docs: update project documentation
style: improve restaurant dashboard
```

---

# Code Quality

Before submitting changes:

1. Verify the application starts successfully.
2. Test the affected functionality.
3. Check authentication and API interactions where applicable.
4. Test native functionality on the appropriate device or development build.
5. Run the project's lint command.
6. Review the changes before creating a Pull Request.

Keep changes focused and avoid unrelated refactoring.

---

# Security

Do not commit sensitive information to the repository.

Examples include:

```text
.env files containing secrets
API keys
Private keys
Access tokens
Payment credentials
Firebase service-account credentials
Authentication secrets
```

Use environment variables and secure backend configuration for sensitive values.

---

# Build & Release

Production builds are managed through Expo Application Services where configured.

Before creating a production build, verify:

* Expo configuration
* Application identifiers
* Android package name
* iOS bundle identifier
* Environment variables
* API endpoints
* Authentication configuration
* Push notification configuration
* Payment configuration
* App icons and splash screens
* EAS build profiles

Run:

```bash
npx expo-doctor
```

before initiating a release build.

---

# Collaboration Guidelines

When working on the repository:

* Keep application-specific changes within the relevant application.
* Avoid modifying another developer's application without coordination.
* Do not commit generated files unless they are intentionally tracked.
* Keep dependencies aligned with the application's Expo SDK version.
* Avoid unnecessary dependency upgrades during feature development.
* Document significant architectural or configuration changes.
* Test affected applications before opening a Pull Request.

---

# Project Status

Ovena is an actively developed multi-application food delivery platform.

The frontend repository contains the customer, restaurant, rider, and administrative experiences required to operate the platform.

---

## License

This repository contains proprietary Ovena software.

All rights reserved.

Unauthorized copying, distribution, modification, or commercial use is prohibited without permission from the project owners.

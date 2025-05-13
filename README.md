# ThirdSpaces Dating App

A React Native dating app with Expo focused on social event discovery, similar to Partiful.

## Features

- **Onboarding Flow**
  - Email/social auth with Firebase
  - Gender/age/preference selection with Lottie animations
  - Wheel picker for age + animated chips for interests

- **Home Tab**
  - Masonry grid event feed
  - Event cards with dynamic images, attendee avatars, and 'Interested' button
  - Floating '+ Create Event' FAB with morph animation

- **Map Tab**
  - Mapbox GL clusters for event density
  - Heatmap layer + bottom sheet previews
  - Pulse animations on live events

- **Event Details**
  - Shared element transitions for images
  - Parallax scroll + 3D flip animation for info

## Tech Stack

- **Frontend**
  - React Native (Expo)
  - Zustand for state management
  - React Query for data fetching
  - NativeWind for styling

- **Maps**
  - @react-native-mapbox-gl/maps with offline support

- **Backend**
  - Firebase Auth/Firestore/Storage

- **UI/UX**
  - Dark/light mode with NativeWind
  - Shimmer loading states
  - Haptics on interactions
  - Confetti on RSVP milestones

## Getting Started

### Prerequisites

- Node.js
- Yarn or npm
- Expo CLI
- Firebase account
- Mapbox account & API key

### Installation

1. Clone the repository
```bash
git clone https://github.com/your-username/thirdspaces-dating-app.git
cd thirdspaces-dating-app
```

2. Install dependencies
```bash
npm install
```

3. Set up environment variables
- Create a `.env` file in the root directory
- Add your Firebase and Mapbox credentials

4. Start the development server
```bash
npm start
```

## Project Structure

```
thirdspaces-dating-app/
├── app/                    # App entry point and screens
│   ├── components/         # UI components
│   ├── hooks/              # Custom hooks
│   ├── services/           # Firebase and API services
│   ├── styles/             # Global styles
│   ├── types/              # TypeScript types
│   └── utils/              # Utility functions
├── assets/                 # Images, fonts, etc.
└── ...
``` 
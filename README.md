MedSync - Healthcare Mobile Application
MedSync is a full-stack healthcare mobile application built with React Native, Expo Router, Redux Toolkit (RTK Query), and a Node.js backend. It features role-based workflows for both Patients and Doctors, secure authentication, appointment booking, and availability scheduling.

Prerequisites
Before setting up the project locally, ensure you have the following installed on your machine:

Node.js (LTS version recommended)

npm or yarn

Git

Expo Go app installed on your physical mobile device, or an Android/iOS Emulator set up.

Getting Started via GitHub
# 1. Clone the Repository
Open your terminal and clone the repository from GitHub:

Bash
git clone https://github.com/your-username/medsync.git
cd medsync
# 2. Install Dependencies
Install all required project packages using npm:

Bash
npm install
# 3. Environment Variables Configuration
Create a .env file in the root directory of your project to connect to your backend API server. Add your API URL:

Code snippet
EXPO_PUBLIC_API_URL=https://api.ashumyself.in/medsync/api/
here YOU can use two things one is my backend that is deployed on https://api.ashumyself.in/medsync/api/
2nd step 
clone the backend and run the command ipconfig get ip address of your laptop on which backend is running and do 
EXPO_PUBLIC_API_URL=EXPO_PUBLIC_API_URL=http://<ip_adress>:<port>/api/


Running the Project
Start the Development Server
To start the Expo development server with cache cleared, run:

Bash
npx expo start -c
Using a Physical Device: Scan the QR code displayed in your terminal using the Expo Go app (Android) or the Camera app (iOS).

Using an Emulator: Press a in the terminal for Android Emulator or i for iOS Simulator.

Building the APK (Android)
To generate an Android APK using EAS Build, make sure you have the EAS CLI installed and logged into your Expo account:

Install EAS CLI (if not already installed):

Bash
npm install -g eas-cli
Log in to your Expo account:

Bash
eas login
Trigger the preview build for Android:

Bash
eas build --platform android --profile preview
Tech Stack
Framework: React Native, Expo (Expo Router)

State Management: Redux Toolkit & RTK Query

Storage: Redux Persist, Expo SecureStore, AsyncStorage

UI Components: React Native Vector Icons, React Native Community DateTimePicker

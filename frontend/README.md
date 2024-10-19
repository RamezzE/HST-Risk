# HST RISK

For a preview of the app, please check this [README](../README.md)

## Table of Contents
- [Prerequisites](#prerequisites)
- [Running](#running)
- [Building](#building)

## Prerequisites

Before you can build and run the frontend of the application, ensure that you have the following installed:

- **Node.js** and **npm** for package management.
  
- **Expo CLI**: Install it globally by running `npm install -g expo-cli`.
  
- **Expo Go App** (for testing on a mobile device).
  
- **Development Build (Expo)**: The development build is required to run the app with full features. Please refer to the Expo [documentation](https://docs.expo.dev/develop/development-builds/create-a-build). It can still be run without the development build as instructed below.
  
- **Setup Push Notifications**: To set up push notifications through Expo, please refer to the [documentation](https://docs.expo.dev/push-notifications/overview/)
  
- **Create a Google Maps API Key**: Check Google's [instructions](https://developers.google.com/maps/documentation/embed/get-api-key)
  
- **Create a .env**: You need to create a .env file with the following variables: `GOOGLE_SERVICES_JSON` for push notifications, `GOOGLE_MAPS_API_KEY` for maps integration on android devices, and `SERVER_IP` for API calls.
  
   Example: 
   ```.env
   GOOGLE_SERVICES_JSON = google-services.json
   GOOGLE_MAPS_API_KEY = MY-API-KEY
   SERVER_IP = "http:localhost:8000"
   ```

## Running

1. **Clone the Repository**:
   ```bash
   git clone https://github.com/RamezzE/HST-Risk.git
   cd HST-Risk/frontend

2. **Install dependencies**:
    ```
    npm install
    ```

3. Run the app:
- For Android Development Build:
  ```
  npx expo run:android
  ```

- For iOS Development Build:
  ```
  npx expo run:ios
  ```

### Running Without Development Build
If you do not want to use a development build, follow these additional steps:

- Remove the KeyboardProvider: In [PageWrapper](components/PageWrapper.jsx), remove the KeyboardProvider and its import.

- Replace KeyboardAwareScrollView with ScrollView: In [FormWrapper](components/FormWrapper.jsx), replace KeyboardAwareScrollView and its import with ScrollView from react-native:

  ```js
  import { ScrollView } from 'react-native';
  
  // Replace KeyboardAwareScrollView with ScrollView
  <ScrollView>
    {/* Your content */}
  </ScrollView>

- Run the application using Expo Go:
  ```bash
  npx expo start
  ```

## Building

To build the application for distribution, you can use EAS:
  ```bash
  eas build -p android # For Android
  eas build -p ios     # For iOS
```

To build locally, please refer to the official [documentation](https://docs.expo.dev/build-reference/local-builds/)

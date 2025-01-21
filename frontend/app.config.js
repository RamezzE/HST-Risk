// app.config.js
import 'dotenv/config';

export default {
  expo: {
    name: "HST Risk",
    slug: "HST-Risk",
    version: "1.1.2",
    orientation: "portrait",
    icon: "./assets/images/icon.png",
    scheme: "hst-risk",
    userInterfaceStyle: "light",
    splash: {
      image: "./assets/images/splash.png",
      resizeMode: "contain",
      backgroundColor: "#fff"
    },

    ios: {
      buildNumber: "3",
      bundleIdentifier: "com.ramezze.hstrisk",
      config: {
        googleMaps: {
          apiKey: process.env.GOOGLE_MAPS_API_KEY
        }
      },
    },

    android: {
      config: {
        googleMaps: {
          apiKey: process.env.GOOGLE_MAPS_API_KEY
        }
      },
      googleServicesFile: process.env.GOOGLE_SERVICES_JSON,
      adaptiveIcon: {
        foregroundImage: "./assets/images/adaptive-icon-android.png",
        backgroundColor: "#ffffff"
      },
      softwareKeyboardLayoutMode: "pan",
      versionCode: 6,
      package: "com.ramezze.hstrisk"
    },

    web: {
      bundler: "metro",
      output: "static",
      favicon: "./assets/images/papyrus_globe_no_background.png"
    },

    plugins: ["expo-router", "expo-font"],
    experiments: {
      typedRoutes: true
    },
    extra: {
      router: {
        origin: false
      },
      eas: {
        projectId: "7bab2e49-e685-455a-8fde-6b0c21911c4c"
      }
    }
  }
};

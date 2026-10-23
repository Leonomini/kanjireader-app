module.exports = {
  expo: {
    name: "KanjiReader",
    slug: "KanjiReader",
    version: "1.0.0",
    orientation: "portrait",
    icon: "./assets/images/icon.png",
    scheme: "myapp",
    userInterfaceStyle: "automatic",
    newArchEnabled: true,
    assetBundlePatterns: ["assets/**/*"],

    ios: {
      supportsTablet: true,
    },

    android: {
      adaptiveIcon: {
        foregroundImage: "",
        backgroundColor: "#ffffff",
      },
      permissions: ["android.permission.RECORD_AUDIO"],
      package: "com.anonymous.KanjiReader",
      softwareKeyboardLayoutMode: "pan",
    },

    web: {
      bundler: "metro",
      output: "static",
      favicon: "",
    },

    plugins: [
      "expo-router",
      [
        "expo-splash-screen",
        {
          image: "./assets/images/splashscreen_logo.png",
          imageWidth: 200,
          resizeMode: "contain",
          backgroundColor: "#ffffff",
        },
      ],
      [
        "expo-image-picker",
      ],

      // Lokales Config Plugin
      "./patches/withJapaneseTextAnalyzer",
    ],

    experiments: {
      typedRoutes: true,
    },

    // 👇 HIER hinzugefügt:
    extra: {
      eas: {
        projectId: "6c0f6c53-e92d-499a-9064-9242d5a3e8c9",
      },
    },
  },
};


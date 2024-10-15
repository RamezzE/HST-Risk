module.exports = function (api) {
  api.cache(true);
  return {
    presets: ["babel-preset-expo"],
    plugins: [
      "nativewind/babel",
      ["module:react-native-dotenv", {
        moduleName: "@env",  // This allows you to use @env to import environment variables
        path: ".env",        // Path to your .env file
      }],
    ],
  };
};

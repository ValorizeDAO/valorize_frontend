module.exports = {
  preset: "@vue/cli-plugin-unit-jest/presets/no-babel",
  moduleFileExtensions: ["js", "ts", "json", "vue"],
  transform: {
    "^.+\\.ts$": "babel-jest",
    "^.+\\.vue$": "vue-jest",
  },
  transformIgnorePatterns: [
    "node_modules/(?!(js-sha3)/)",
  ],
  testURL: "http://localhost/",
  globals: {
    "vue-jest": {
      babelConfig: true,
    },
  },
  setupFilesAfterEnv: ["<rootDir>/jest.setup.js"],
}

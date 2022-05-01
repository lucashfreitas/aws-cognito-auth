import type { Config } from "@jest/types";

// Sync object
const config: Config.InitialOptions = {
  testMatch: [
    "<rootDir>/**/*.(test).{js,jsx,ts,tsx}",
    "<rootDir>/**/?(*.)(spec|test).{js,jsx,ts,tsx}",
  ],
  moduleDirectories: ["node_modules", "./"],

  verbose: true,
  // moduleNameMapper: {
  //   "\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$": "__mocks__/fileMock.js"
  // }
  testEnvironment: "node",
  extensionsToTreatAsEsm: [".ts"],
  preset: "ts-jest",
  coverageReporters: ["html"],
};

export default config;

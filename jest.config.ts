import type { Config } from "@jest/types";

// Sync object
const config: Config.InitialOptions = {
  testMatch: [
    "<rootDir>/**/*.(test).{js,jsx,ts,tsx}",
    "<rootDir>/**/?(*.)(spec|test).{js,jsx,ts,tsx}",
  ],
  moduleDirectories: ["node_modules", "src"],
  globalSetup: "<rootDir>/tests/globalSetup.ts",
  globalTeardown: "<rootDir>/tests/globalTearDown.ts",
  verbose: true,
  setupFilesAfterEnv: ["<rootDir>/tests/setupAfterEnv.ts"],
  testEnvironment: "node",
  extensionsToTreatAsEsm: [".ts"],
  preset: "ts-jest",
  coverageReporters: ["html"],
};

export default config;

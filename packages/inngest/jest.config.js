/** @type {import('ts-jest/dist/types').InitialOptionsTsJest} */
module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  testMatch: ["<rootDir>/src/**/*.test.ts", "!**/examples/**/*.test.ts"],
  roots: ["<rootDir>/src", "<rootDir>/../../examples"],
  moduleNameMapper: {
    inngest: "<rootDir>/src",
    "^@local$": "<rootDir>/src",
    "^@local/(.*)": "<rootDir>/src/$1",
  },
};
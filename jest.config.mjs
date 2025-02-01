export default {
  preset: "ts-jest",
  testEnvironment: "node",
  clearMocks: true,
  moduleNameMapper: {
    "^#exceptions/(.*)$": "<rootDir>/src/exceptions/$1",
    "^#classes/(.*)$": "<rootDir>/src/classes/$1",
    "^#types/(.*)$": "<rootDir>/src/types/$1",
    "^#utils/(.*)$": "<rootDir>/src/utils/$1",
    "^#enums/(.*)$": "<rootDir>/src/enums/$1"
  }
};

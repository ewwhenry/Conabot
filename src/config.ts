if (process.env.NODE_ENV !== "production") process.loadEnvFile(".env");

export const PREFIX = "!!";
export const COMMANDS_PATH = "src/commands";
export const SERIALIZED_ID = process.env.SERIALIZED_ID;

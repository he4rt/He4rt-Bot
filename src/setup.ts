import dotenv from "dotenv";
import path from "path";

const ENV_KEY = process.env.ENV_KEY || ".env.key";
const root = path.join(__dirname, "..");
dotenv.config({ path: path.resolve(root, ".env") });
dotenv.config({ path: path.resolve(root, ENV_KEY) });

require("module-alias/register");

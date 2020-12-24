// All of the Node.js APIs are available in the preload process.
// It has the same sandbox as a Chrome extension.
import { Environment } from "../shared/environment";

(global as any).ENV = (process.env.ENV as Environment) || Environment.Prod;

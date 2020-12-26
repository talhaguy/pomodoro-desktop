import { Environment } from "../shared";

// make global variables available to renderer
(global as any).ENV = (process.env.ENV as Environment) || Environment.Prod;

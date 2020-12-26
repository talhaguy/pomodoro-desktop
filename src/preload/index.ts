import { Environment } from "../shared/environment";

// make global variables available to renderer
(global as any).ENV = (process.env.ENV as Environment) || Environment.Prod;

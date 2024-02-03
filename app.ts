import express, { Express, NextFunction, Request, Response } from "express";
import propertiesRoutes from "./api/routes/properties";
import loggingMiddleware from "./logger";

const app: Express = express();

app.use(loggingMiddleware);

app.use(
  /^\/api\/properties\/search(?:\/(data1|data2)\/(.*?))+$/i,
  propertiesRoutes,
);

app.use((req: Request, res: Response, next: NextFunction) => {
  Error.prototype.status = 404; //eslint-disable-line
  const error = Error("Url doesn't exist");
  next(error);
});

type IError = {
  message: string;
  status: number;
};

app.use((error: IError, req: Request, res: Response, next: NextFunction) => {
  res.status(error.status ?? 500);
  res.json({
    error: {
      message: error.message ?? "No error message",
    },
  });
});

export default app;

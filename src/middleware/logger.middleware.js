import fs from "fs";
import winston from "winston";

const fsPromises = fs.promises;

// async function log(logData) {
//   try {
//     logData = `\n${new Date().toString()} - ${logData}`;

//     await fsPromises.appendFile("log.txt", logData);
//   } catch (err) {
//     console.log(err);
//   }
// }

const logger = winston.createLogger({
  level: "info",
  format: winston.format.json(),
  defaultMeta: { service: "request-logging" },
  transports: [new winston.transports.File({ filename: "logs.txt" })],
});

const loggerMiddleware = async (req, res, next) => {
  const logData = `${req.url}- ${JSON.stringify(req.body)}`;

  logger.info(logData);
  next();
};

export default loggerMiddleware;

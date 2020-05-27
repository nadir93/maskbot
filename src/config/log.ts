/**
 * Author : @nadir93
 */
'use strict';

import winston from 'winston';
import 'winston-daily-rotate-file';

const { format, transports, createLogger } = winston;
const { combine /*, errors, json */ } = format;
//const path = require('path');
import os from 'os';

//
// Logging levels
//
const config = {
  levels: {
    error: 0,
    info: 1,
    warn: 2,
    data: 3,
    debug: 4,
    verbose: 5,
    silly: 6,
    custom: 7,
  },
  colors: {
    error: 'red',
    info: 'green',
    warn: 'yellow',
    data: 'grey',
    debug: 'cyan',
    verbose: 'cyan',
    silly: 'magenta',
    custom: 'yellow',
  },
};

winston.addColors(config.colors);

export const getLogger = (label: string) => {
  return createLogger({
    level: process.env.NODE_ENV === 'production' ? 'info' : 'debug',
    levels: config.levels,
    format: format.combine(
      format.label({
        label: `${label}/${process.pid} on ${os.hostname()}`,
      }),
      format.timestamp({
        format: 'YYYY-MM-DD HH:mm:ss.SSS',
      }),
      // Format the metadata object
      format.metadata({
        fillExcept: ['message', 'level', 'timestamp', 'label'],
      }),
    ),
    transports: [
      new transports.Console({
        format: combine(
          format((info: any) => {
            info.level = info.level.toUpperCase();
            return info;
          })(),
          format.colorize({
            all: true,
          }),
          //format.align(),
          format.printf((info: any) => {
            const {
              timestamp,
              level,
              message,
              //label,
              metadata, // ...args
            } = info;

            //const ts = timestamp.slice(0, 19).replace('T', ' ');
            return `${timestamp} ${level} [${info.label}]: ${message} ${
              Object.keys(metadata).length
                ? JSON.stringify(metadata, null, 4)
                : ''
            }`;
          }),
        ),
      }),
      new winston.transports.DailyRotateFile({
        level: 'silly',
        filename: './logs/application-%DATE%.log',
        datePattern: 'YYYY-MM-DD-HH',
        //zippedArchive: true,
        maxSize: '20m',
        maxFiles: '7d',
        format: combine(
          format((info: any) => {
            info.level = info.level.toUpperCase();
            return info;
          })(),
          format.colorize({
            all: false,
          }),
          //format.align(),
          format.printf((info: any) => {
            const {
              timestamp,
              level,
              message,
              //label,
              metadata, // ...args
            } = info;

            //const ts = timestamp.slice(0, 19).replace('T', ' ');
            return `${timestamp} ${level} [${info.label}]: ${message} ${
              Object.keys(metadata).length
                ? JSON.stringify(metadata, null, 4)
                : ''
            }`;
          }),
        ),
      }),
    ],
  });
};

//export = getLogger;
//module.exports.getlogger = getlogger;

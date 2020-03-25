/**
 * Author : @nadir93
 */
'use strict';

import { getLogger } from './config/log';
const log = getLogger('src/app.ts');

import { Scheduler } from './scheduler';
// const slack = require('./slackMessageSender');

export class App {
  public start = async (): Promise<void> => {
    try {
      await new Scheduler().start();
      log.info('job scheduler started');

      //await slack.start();
      log.info('slack started');
    } catch (e) {
      log.error(`\n ${e.stack}`);
    }
  };
}

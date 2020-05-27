/**
 * Author : @nadir93
 */
'use strict';

import { getLogger } from './config/log';
const log = getLogger('src/slackMessageSender.ts');
import { WebClient, ChatPostMessageArguments } from '@slack/web-api';
//const moment = require('moment');

// Read a token from the environment variables
const token = process.env.SLACK_TOKEN;
log.debug(`token: ${token}`);
const argv = require('yargs').argv;

export class Slack {
  private static _default: Slack;
  private web;

  constructor() {
    // Initialize
    this.web = new WebClient(token);
  }

  //single pattern
  public static get default(): Slack {
    if (!Slack._default) {
      Slack._default = new Slack();
    }

    return Slack._default;
  }

  send = async (input: ChatPostMessageArguments): Promise<void> => {
    try {
      if (argv.slack) {
        await this.web.chat.postMessage(input);
      }
    } catch (e) {
      log.error(`\n ${e.stack}`);
    }
    return Promise.resolve();
  };
}

/**
 * Author : @nadir93
 */
'use strict';

import { getLogger } from './config/log';
const log = getLogger('src/process.ts');

//임시코드
// const devices = require('puppeteer/DeviceDescriptors');
// add stealth plugin and use defaults (all evasion techniques)
// const StealthPlugin = require('puppeteer-extra-plugin-stealth');
// puppeteer.use(StealthPlugin());

//const shell = require('shelljs');
const argv = require('yargs').argv;
import { Init } from './init';
import { Login } from './login';
import { Observer } from './observer';
//const config = require('../config/config');
import config from './config/config.json';
import { OptionSelector } from './optionSelector';
import { Slack } from './slackMessageSender';
import { Payment } from './payment';
import { Page, Browser } from 'puppeteer';

const env: string = argv.env;
log.info(`env: ${env}`);
const mask: {
  url: string;
  optionSelector: string | null;
  purchaseButtonSelector: string;
  searchKeyword: string[] | null;
  etc: string;
} = config.mask[env];
log.info('mask:', mask);

export class Process {
  public start = async (): Promise<void> => {
    const browser: Browser = null;
    const page: Page = null;

    try {
      //init
      const page = await new Init().start();

      //goto main
      log.info(`goto: ${config.mainSite}`);
      await Promise.all([
        page.waitForNavigation(),
        page.goto(config.mainSite, {
          waitUntil: 'load',
        }),
        //page.waitFor('#account > div > a > i'),
        page.waitFor('#account > a'),
      ]);
      //log.debug('page:', page);

      //login
      log.info('로그인 시작');
      await new Login().start(page, config.mainSite);
      log.info('로그인 종료');

      //infinite loop
      log.info('observer 시작');
      await new Observer().infiniteloop(
        page,
        mask.purchaseButtonSelector,
        mask.url,
      );
      log.info('observer 종료');

      // select option
      log.info('optionSelector 시작');
      await new OptionSelector().select(
        page,
        mask.optionSelector,
        mask.searchKeyword,
      );
      log.info('optionSelector 종료');

      // payment
      log.info('payment 시작');
      await new Payment().start(page, mask.purchaseButtonSelector);
      log.info('payment 종료');
    } catch (e) {
      log.error(`\n ${e.stack}`);

      //send message
      const errorMsg = {
        text: '에러발생',
        attachments: [
          {
            text: e.stack,
          },
        ],
        channel: '#monitoring',
      };
      await Slack.default.send(errorMsg);
      log.debug(`message send`, errorMsg);

      if (page != null) {
        await page.screenshot({
          path: `./resource/${env}_${new Date()}.png`,
          fullPage: true,
        });

        //테스트코드
        const body: string = await page.evaluate(
          () => document.documentElement.textContent,
        );
        log.silly(`페이지: ${body}`);
      } else {
        await page.screenshot({
          path: `./resource/${env}_${new Date()}.png`,
          fullPage: true,
        });
      }
    } finally {
      //기다림(임시)
      await page.waitFor(360000000);

      await browser.close();
      log.info('browser closed');
      //shell.exec('pkill chrome');
      //await sleep(config.DEFAULT_SLEEP_TIME);
    }
  };
}

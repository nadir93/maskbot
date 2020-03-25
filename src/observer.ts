/**
 * Author : @nadir93
 */
'use strict';

//const argv = require('yargs').argv;
import { getLogger } from './config/log';
const log = getLogger('src/process.ts');

import config from './config/config.json';
import { Page } from 'puppeteer';

const DEFAULT_SLEEP = config.mask.default_sleep;
log.info(`DEFAULT_SLEEP: ${DEFAULT_SLEEP}`);
const LOAD_TIMEOUT = config.LOAD_TIMEOUT;
log.info(`LOAD_TIMEOUT: ${LOAD_TIMEOUT}`);

export class Observer {
  public infiniteloop = async (
    page: Page,
    purchaseButtonSelector: string,
    url: string,
  ): Promise<void> => {
    const loop = async (): Promise<void> => {
      try {
        //페이지 이동
        log.debug(`페이지 이동: ${url}`);
        await page.goto(url, {
          //waitUntil: 'load',
          waitUntil: 'domcontentloaded',
          //waitUntil: 'networkidle2',
          timeout: LOAD_TIMEOUT,
        });

        //구매가능여부 체크
        log.debug('구매버튼 활성화체크');
        log.debug(`purchaseButtonSelector: ${purchaseButtonSelector}`);
        //await page.waitForSelector(purchaseButtonSelector);
        const name = await page.evaluate(x => {
          //console.log('x:', x);
          const className = document.querySelector(x).getAttribute('class');
          //console.log('className:', className);
          // if (className == '_stopDefault') {
          //   return false;
          // }
          // return true;
          return className;
        }, purchaseButtonSelector);

        log.debug(`className: ${name}`);
        if (name != '_stopDefault') {
          log.debug('구매버튼 활성화체크 성공');
          return;
        }

        await loop();
      } catch (e) {
        log.error(`\n ${e.stack}`);
        await loop();
      }
    };
    await loop();
  };
}

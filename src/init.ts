/**
 * Author : @nadir93
 */
'use strict';

//import * as puppeteer from 'puppeteer';
import puppeteer, { Page } from 'puppeteer';
import userAgent from 'user-agents';
//const config = require('./config/config.json');
import config from './config/config.json';
import { getLogger } from './config/log';
import { Browser, Request } from 'puppeteer';
const log = getLogger('src/init.ts');
const argv = require('yargs').argv;
const consoleLog = argv.consoleLog;
log.info(`consoleLog: ${consoleLog}`);

export class Init {
  public addEventListener = (browser: Browser): void => {
    browser.on('targetcreated', async target => {
      if (target.type() === 'page') {
        log.debug(`targetcreated: ${target.url()}`);
      }
    });

    browser.on('targetchanged', async target => {
      if (target.type() === 'page') {
        log.debug(`targetchanged: ${target.url()}`);
      }
    });

    browser.on('targetdestroyed', async target => {
      if (target.type() === 'page') {
        log.debug(`targetdestroyed: ${target.url()}`);
      }
    });
  };

  public start = async (): Promise<Page> => {
    //log.debug('start job:', job);
    const browser = await puppeteer.launch({
      devtools: false,
      defaultViewport: null,
      headless: config.headless,
      // args: [
      //   '--allow-file-access-from-files'
      //   '--no-sandbox',
      //   '--disable-setuid-sandbox',
      //   '--disable-accelerated-2d-canvas',
      //   '--disable-gpu'
      // ]
    });
    //browser = await puppeteer.launch({ devtools: true, defaultViewport: null, headless: config.headless, args: ['--no-sandbox'] });

    this.addEventListener(browser);

    const page = await browser.newPage();
    //await page.setDefaultNavigationTimeout(5000);   // change timeout

    await page.setRequestInterception(true);

    // page.on('console', msg => {
    //   for (let i = 0; i < msg.args().length; ++i)
    //     log.debug(`consoleLog: ${i}: ${msg.args()[i]}`);
    // });

    if (consoleLog) {
      page.on('console', msg => log.debug(`PAGE LOG: ${msg.text()}`));
    }

    page.on('request', (request: Request) => {
      if (request.resourceType() === 'document' && request.method() != 'GET') {
        log.debug(`url: ${request.url()}`);
        log.debug(`method: ${request.method()}`);
        log.debug('headers:', request.headers());
        log.debug('postData:', request.postData());
        //console.log('postData', request);
        log.debug('========');
      }
      //    request.abort();
      //else
      //log.debug(`request: ${JSON.stringify(request)}`);

      request.continue();
    });

    //set useragent
    const agent = new userAgent();
    console.log(agent.toString());
    //console.log(JSON.stringify(agent.data, null, 2));

    //log.debug(`user-agent:${agent.toString()}`);
    //await page.setUserAgent(agent.toString());

    return page;
  };
}

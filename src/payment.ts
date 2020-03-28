/**
 * Author : @nadir93
 */
'use strict';

import { getLogger } from './config/log';
import { Page } from 'puppeteer';
const log = getLogger('src/payment.ts');

import { Slack } from './slackMessageSender';
const argv = require('yargs').argv;

export class Payment {
  start = async (page: Page, purchaseButtonSelector: string): Promise<void> => {
    //테스트코드
    //let body = await page.evaluate(() => document.documentElement.textContent);
    //log.silly(`구매 옵션 선택후 페이지: ${body}`);

    //구매버튼 클릭
    await page.waitForSelector(purchaseButtonSelector);

    log.debug('구매버튼 클릭');
    await Promise.all([
      page.waitForNavigation(),
      page.click(purchaseButtonSelector),
    ]);

    //일반결제 상태확인
    await page.waitForSelector(
      '.paymethod.payment_method_tab._generalPaymentsTab',
    );
    
    const name = await page.evaluate(x => {
      //console.log('x:', x);
      const className = document.querySelector(x).getAttribute('class');
      //console.log('className:', className);
      return className;
    }, '.paymethod.payment_method_tab._generalPaymentsTab');

    log.debug(`className: ${name}`);
    //paymethod payment_method_tab _generalPaymentsTab on
    if (name != 'paymethod payment_method_tab _generalPaymentsTab on') {
      // 일반결제 선택
      log.debug('일반결제 클릭');
      await page.click(
        '.paymethod.payment_method_tab._generalPaymentsTab > div > span',
      );
    }

    await page.waitForSelector(
      '#orderForm > div > div.payment_wrap > div.payment_info > div.payment > ul > li.paymethod.payment_method_tab._generalPaymentsTab.on > ul > li',
    );

    const count = await page.evaluate(() => {
      return document.querySelectorAll(
        '#orderForm > div > div.payment_wrap > div.payment_info > div.payment > ul > li.paymethod.payment_method_tab._generalPaymentsTab.on > ul > li',
      ).length;
    });
    log.debug(`count: ${count}`);

    //나중에결제 선택
    if (count == 5) {
      await page.waitForSelector(
        '#orderForm > div > div.payment_wrap > div.payment_info > div.payment > ul > li.paymethod.payment_method_tab._generalPaymentsTab.on > ul > li:nth-child(4) > span > span',
      );
      await page.click(
        '#orderForm > div > div.payment_wrap > div.payment_info > div.payment > ul > li.paymethod.payment_method_tab._generalPaymentsTab.on > ul > li:nth-child(4) > span > span',
      );
    } else {
      await page.waitForSelector(
        '#orderForm > div > div.payment_wrap > div.payment_info > div.payment > ul > li.paymethod.payment_method_tab._generalPaymentsTab.on > ul > li:nth-child(2) > span > span',
      );
      await page.click(
        '#orderForm > div > div.payment_wrap > div.payment_info > div.payment > ul > li.paymethod.payment_method_tab._generalPaymentsTab.on > ul > li:nth-child(2) > span > span',
      );
    }
    log.debug('"나중에결제" 선택');

    //전체동의
    await this.all_agree(page);

    //결제요청
    if (!argv.test) {
      await this.requestPayment(page);
    }

    //기다림
    log.debug('결제요청 기다리는중...');
    await page.waitFor(360000000);
  };

  all_agree = async (orderPage: Page): Promise<void> => {
    await orderPage.waitForSelector('#all_agree', {
      visible: true,
      timeout: 5000,
    });

    const checkbox = await orderPage.$('#all_agree');
    log.debug(
      '#all_agree checked: ' +
        (await (await checkbox.getProperty('checked')).jsonValue()),
    );
    await orderPage.evaluate(() => {
      const element: HTMLElement = document.querySelector(
        '#all_agree',
      ) as HTMLElement;
      element.click();
    });
    log.debug('전체동의 완료');
  };

  requestPayment = async (orderPage: Page): Promise<void> => {
    await orderPage.waitForSelector(
      '#orderForm > div > div.payment_agree_wrap > button',
      {
        visible: true,
        timeout: 5000,
      },
    );
    await orderPage.click('#orderForm > div > div.payment_agree_wrap > button');
    log.debug('결제하기 선택');

    // 결제 요청 메시지 보내기

    const requestPayment = {
      text: '결제 요청',
      attachments: [
        {
          text: '결제를 요청합니다!!!!!!\nright now!',
        },
      ],
      channel: '#monitoring',
    };
    await Slack.default.send(requestPayment);
    log.debug(`message send`, requestPayment);
  };
}

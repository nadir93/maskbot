/**
 * Author : @nadir93
 */
'use strict';

import { Page, Target } from 'puppeteer';
import { getLogger } from './config/log';
const log = getLogger('src/login.ts');
import { Slack } from './slackMessageSender';

export class Login {
  public start = async (page: Page, targetPage: string): Promise<void> => {
    //로그인 요청 메시지 보내기
    await this.requestLogin();

    //로그인 화면으로 이동
    // await page.waitFor("#account > div > a > i");
    await page.click('#account > div > a > i');
    page = await this.waitLogin(page, targetPage);
  };

  public waitLogin = (page: Page, targetPage: string): Promise<Page> => {
    const browser = page.browser();

    return new Promise(x =>
      browser.on('targetchanged', async (target: Target) => {
        if (target.type() === 'page' && target.url() == targetPage) {
          log.debug(`로그인성공: ${target.url()}`);
          const page = await target.page();
          return x(page);
        }
      }),
    );
  };

  public requestLogin = async (): Promise<void> => {
    const requestLogin = {
      text: '로그인 요청',
      attachments: [
        {
          text: '로그인을 요청합니다!!!!!.\nright now!',
        },
      ],
      channel: '#monitoring',
    };
    await Slack.default.send(requestLogin);
    log.debug(`message send`, requestLogin);
  };
}

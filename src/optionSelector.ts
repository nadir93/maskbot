/**
 * Author : @nadir93
 */
'use strict';

import { getLogger } from './config/log';
const log = getLogger('src/optionSelector.ts');
import { Score } from './score';
import { Page } from 'puppeteer';

export class OptionSelector {
  select = async (
    page: Page,
    optionSelector: string,
    searchKeyword: string[] | null,
  ): Promise<void> => {
    const loop = async (): Promise<void> => {
      try {
        //구매 옵션 선택
        if (!optionSelector) {
          return;
        }

        await page.waitForSelector(optionSelector);

        // select 선택
        log.debug('select 선택');
        await Promise.all([
          page.click(optionSelector),
          page.waitForSelector('body > div:nth-child(2) > div > ul > li'),
        ]);

        // 최적의 옵션 가져오기
        const items = await this.checkOptions(page);
        const selectedItem: {
          item: number;
          title: string;
        } = await new Score().process(items, searchKeyword);

        // 옵션 선택
        log.debug(`옵션 선택: ${selectedItem.item + 1}`);
        await Promise.all([
          page.click(
            `body > div:nth-child(2) > div > ul > li:nth-child(${selectedItem.item +
              1})`,
          ),
          page.waitForSelector(
            `body > div:nth-child(2) > div > ul > li:nth-child(${selectedItem.item +
              1})`,
          ),
        ]);

        const result = await this.confirm(page, selectedItem.title);

        if (result) {
          log.debug('옵션선택 성공');
          return;
        }

        await loop();

        // await page.evaluate(() => {
        //   const length = document.querySelector('#gitParameterSelect').options.length;
        //   for (var i = 0; i < length; i++) {
        //     const branchName = document.querySelector('#gitParameterSelect').options[i].value
        //     if (branchName == 'release') {
        //       document.querySelector('#gitParameterSelect').options[i].selected = true;
        //     }
        //   }
        // })
      } catch (e) {
        log.error(`\n ${e.stack}`);
        await loop();
      }
    };
    await loop();
  };

  checkOptions = async (
    page: Page,
  ): Promise<{ item: number; title: string }[]> => {
    const result = await page.evaluate(x => {
      //console.log('x:', x);
      const list = [];
      for (let i = 0, els = document.querySelectorAll(x); i < els.length; i++) {
        list.push({
          item: i,
          title: els[i].textContent,
        });
      }
      return list;
    }, 'body > div:nth-child(2) > div > ul > li');

    for (let i = 0; i < result.length; i++) {
      log.debug(`list[${i}]: `, result[i]);
    }
    return result;
  };

  confirm = async (page: Page, title: string): Promise<boolean> => {
    const result = await page.evaluate(() => {
      const list = [];
      const els = document.querySelectorAll('option:checked');

      for (let i = 0; i < els.length; i++) {
        list.push(els[i].textContent);
      }

      return list;
    });

    for (let i = 0; i < result.length; i++) {
      log.debug(`selected list[${i}]: ${result[i]}`);
      if (title == result[i]) {
        return true;
      }
    }

    return false;
  };
}

// const checkOptions = async (page) => {
//   const result = await page.evaluate((x) => {
//     //console.log('x:', x);
//     const list = [];
//     for (var i = 0, els = document.querySelectorAll(x); i < els.length; i++) {
//       list.push(els[i].textContent);
//     }
//     return list;
//   }, 'body > div:nth-child(2) > div > ul > li');

//   for (let i = 0; i < result.length; i++) {
//     log.debug(`list[${i}]: ${result[i]}`);
//   }
// };

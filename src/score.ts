/**
 * Author : @nadir93
 */
'use strict';

import { getLogger } from './config/log';
const log = getLogger('src/quickScore.ts');

import { QuickScore } from 'quick-score';
import * as _ from 'lodash';

export class Score {
  process = (
    items: Array<{ item: number; title: string }>,
    searchKeyword: string[],
  ): { item: number; title: string } => {
    log.debug('items: ', items);
    log.debug('searchKeyword: ', searchKeyword);
    const filteredItems = _.reject(items, o =>
      o.title.indexOf('품절') > 0 ? true : false,
    );
    log.debug('filteredItems: ', filteredItems);

    //아이템이 없는경우
    if (filteredItems.length == 0) {
      throw new Error('아이템이 없습니다.');
    }

    //아이템이 하나인 경우
    if (filteredItems.length == 1) {
      return filteredItems[0];
    }

    //아이템이 여러개 일때
    for (let i = 0; i < searchKeyword.length; i++) {
      log.debug(`keyword: ${searchKeyword[i]}`);

      const qs = new QuickScore(filteredItems, ['title']);
      log.debug('filteredItems: ', filteredItems);
      const results = qs.search(searchKeyword[i]);
      log.debug('results: ', results);
      if (results.length > 0) {
        return results[0].item;
      }
    }
    throw new Error('아이템 오류발생');
  };
}

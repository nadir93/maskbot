/**
 * Author : @nadir93
 */
'use strict';

import { getLogger } from './config/log';
const log = getLogger('src/scheduler.ts');

//import { schedule } from 'node-schedule';
//const argv = require('yargs').argv;
import { Process } from './process';
//import config from './config/config.json';

export class Scheduler {
  public start = async (): Promise<void> => {
    // config.SCHEDULE.forEach(element => {
    //   const rule = new schedule.RecurrenceRule();
    //   //rule.dayOfWeek = [0, new schedule.Range(4, 6)];
    //   rule.hour = element.hour;
    //   rule.minute = element.minute;
    //   rule.tz = element.tz;
    //   log.debug('process 작업 스케쥴:', element);

    //   schedule.scheduleJob(rule, async () => {
    //     try {
    //       // const data = await clien.scrape(redis);
    //       // await clien.push(data, redis);
    //       log.debug('process 작업 수행 시작');
    //       await new Process().start();
    //       log.debug('process 작업 수행 완료');
    //     } catch (e) {
    //       log.error(`\n ${e.stack}`);
    //     }
    //   });
    // });

    //for test
    (async (): Promise<void> => {
      try {
        // const data = await clien.scrape(redis);
        // await clien.push(data, redis);
        log.info('process 작업 수행 시작');
        await new Process().start();
        log.info('process 작업 수행 완료');
      } catch (e) {
        log.error(`\n ${e.stack}`);
      }
    })();
  };
}

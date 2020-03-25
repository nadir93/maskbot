/**
 * Author : @nadir93
 */
'use strict';

import { Score } from '../src/score';

const searchKeyword = ['대', '중', '소'];

test('아이템이 없는경우', () => {
  const items = [
    {
      item: 1,
      title: '보건용마스크 중형 검정 10개입(KF94)     (품절)',
    },
    {
      item: 2,
      title: '보건용마스크 중형 흰색 10개입(KF94) 품절',
    },
    {
      item: 3,
      title: '보건용마스크 소형 검정 10개입(KF94)     (품절)',
    },
    {
      item: 4,
      title: '보건용마스크 소형 흰색 10개입(KF94)     (품절)',
    },
  ];

  expect(() => {
    const score = new Score();
    score.process(items, searchKeyword);
  }).toThrow('아이템이 없습니다.');
});

test('선택할 아이템이 하나인경우', () => {
  const items = [
    {
      item: 1,
      title: '보건용마스크 중형 검정 10개입(KF94)     (품절)',
    },
    {
      item: 2,
      title: '보건용마스크 중형 흰색 10개입(KF94)',
    },
    {
      item: 3,
      title: '보건용마스크 소형 검정 10개입(KF94)     (품절)',
    },
    {
      item: 4,
      title: '보건용마스크 소형 흰색 10개입(KF94)     (품절)',
    },
  ];

  const score = new Score();
  expect(score.process(items, searchKeyword)).toEqual({
    item: 2,
    title: '보건용마스크 중형 흰색 10개입(KF94)',
  });
});

test('선택할 아이템이 여러개인경우', () => {
  const items = [
    {
      item: 1,
      title: '보건용마스크 중형 검정 10개입(KF94)     ',
    },
    {
      item: 2,
      title: '보건용마스크 중형 흰색 10개입(KF94)',
    },
    {
      item: 3,
      title: '보건용마스크 소형 검정 10개입(KF94)     (품절)',
    },
    {
      item: 4,
      title: '보건용마스크 소형 흰색 10개입(KF94)     (품절)',
    },
  ];

  const score = new Score();
  expect(score.process(items, searchKeyword)).toEqual({
    item: 1,
    title: '보건용마스크 중형 검정 10개입(KF94)     ',
  });
});

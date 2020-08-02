// copy from Server\packages\Dice\lib\utils.ts

import _ from 'lodash';

/**
 * 在一定范围内取随机值
 * @param maxPoint 最大点数
 * @param minPoint 最小点数
 */
export function rollPoint(maxPoint: number, minPoint = 1): number {
  maxPoint = parseInt(String(maxPoint));
  minPoint = parseInt(String(minPoint));
  if (maxPoint <= 1) {
    maxPoint = 100;
  }
  if (maxPoint < minPoint) {
    maxPoint = minPoint + 1;
  }

  var range = maxPoint - minPoint + 1;
  var rand = Math.random();
  return minPoint + Math.floor(rand * range);
}

interface RollRes {
  str: string;
  value: number;
}
/**
 * 投骰
 * @param requestStr 投骰表达式 如1d100
 */
export function roll(requestStr: string): RollRes {
  const pattern = /(\d*)\s*d\s*(\d*)/gi;

  requestStr = requestStr.replace(/[^\dd\+-\/\*\(\)]+/gi, ''); //去除无效或危险字符
  const express = requestStr.replace(pattern, function (tag, num, dice) {
    num = _.clamp(num || 1, 1, 100); // 个数
    dice = _.clamp(dice || 100, 1, 1000); // 面数
    const res = [];
    for (var i = 0; i < num; i++) {
      res.push(rollPoint(dice));
    }

    if (num > 1) {
      return '(' + res.join('+') + ')';
    } else {
      return res.join('+');
    }
  });

  if (_.isEmpty(requestStr) || _.isEmpty(express)) {
    throw new Error('Invalid Dice Request: ' + requestStr);
  }

  const result = eval(express);
  let str = '';
  if (express !== result) {
    str = requestStr + '=' + express + '=' + result;
  } else {
    str = requestStr + '=' + result;
  }

  return {
    str,
    value: Number(result),
  };
}

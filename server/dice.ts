import { roll } from './utils';

type ProcessCallback = (msg: string) => void;
export function processDiceCommand(inputMsg: string, cb: ProcessCallback) {
  if (/^[.。]r/.test(inputMsg)) {
    // 是一个投骰指令
    const restStr = inputMsg.substr(2).trim();
    try {
      const { str } = roll(restStr);

      cb(str);
    } catch (err) {
      console.error(err);
      cb(`异常的投骰表达式: ${inputMsg}`);
    }
  }
}

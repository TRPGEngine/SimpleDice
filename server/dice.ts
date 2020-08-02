import { roll } from './utils';

type ProcessCallback = (msg: string) => void;
export function processDiceCommand(inputMsg: string, cb: ProcessCallback) {
  if (/^[.。]r/.test(inputMsg)) {
    // 是一个投骰指令
    const restStr = inputMsg.substr(2).trim();
    const { str } = roll(restStr);

    cb(str);
  }
}

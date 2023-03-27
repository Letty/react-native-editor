import RichEditor from './RichEditor'
import RichToolbar, { defaultActions } from './RichToolbar';
import { actions } from './const'
import {
  createHTML,
  getContentCSS,
} from './editor'

export function multiply(a: number, b: number): Promise<number> {
  return Promise.resolve(a * b);
}

export function multiply2(a: number, b: number): Promise<string> {
  return Promise.resolve(`a * b = ${a} * ${b} = ${a * b}`);
}

export {
  RichEditor,
  RichToolbar,
  actions,
  defaultActions,
  createHTML,
  getContentCSS,
}
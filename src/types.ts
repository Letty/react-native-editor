
type autoCapitalize = 'on' | 'off' | 'none' | 'words' | 'sentences' | 'characters'
type defaultParagraphSeperator = 'div' | 'p'

export type HTMLOptions = {
  autoCapitalize: autoCapitalize,
  autoCorrect: boolean,
  backgroundColor: string,
  caretColor: string,
  color: string,
  contentCSSText: string,
  cssText: string,
  defaultParagraphSeparator: defaultParagraphSeperator,
  enterKeyHint: string,
  firstFocusEnd: boolean,
  initialCSSText: string,
  inputListener: boolean,
  keyDownListener: boolean,
  keyUpListener: boolean,
  pasteAsPlainText: boolean,
  pasteListener: boolean,
  placeholderColor: string,
  useContainer: boolean
}

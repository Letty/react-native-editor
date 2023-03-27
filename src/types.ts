
type autoCapitalize = 'on' | 'off' | 'none' | 'words' | 'sentences' | 'characters'
type defaultParagraphSeperator = 'div' | 'p'

interface HTMLOptions {
  autoCapitalize: autoCapitalize,
  autoCorrect: boolean,
  backgroundColor: string,
  caretColor: string,
  color: string,
  contentCSSText: string,
  cssText: string,
  defaultParagraphSeparator: string,
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
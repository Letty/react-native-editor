import type React from 'react'
import type { StyleProp, ViewStyle } from 'react-native'
import type { WebViewMessageEvent, WebViewProps } from 'react-native-webview'

type autoCapitalize =
  | 'on'
  | 'off'
  | 'none'
  | 'words'
  | 'sentences'
  | 'characters'
type defaultParagraphSeperator = 'div' | 'p'
export type defaultActions = [
  'image',
  'bold',
  'italic',
  'unorderedList',
  'orderedList',
  'link'
]

export type IconProps = {
  selected: boolean
  disabled: boolean
  tintColor: string
  iconSize: number
  iconGap: number
}

export type HTMLOptions = {
  autoCapitalize?: autoCapitalize
  autoCorrect?: boolean
  backgroundColor?: string
  caretColor?: string
  color?: string
  contentCSSText?: string
  cssText?: string
  defaultParagraphSeparator?: defaultParagraphSeperator
  enterKeyHint?: string
  firstFocusEnd?: boolean
  font?: string
  initialCSSText?: string
  initialFocus?: boolean
  inputListener?: boolean
  keyDownListener?: boolean
  keyUpListener?: boolean
  pasteAsPlainText?: boolean
  pasteListener?: boolean
  placeholderColor?: string
  useContainer?: boolean
}

export type RichToolbarProps = {
  actions?: string[]
  children: React.ReactNode
  disabled?: boolean
  disabledButtonStyle?: StyleProp<ViewStyle>
  disabledIconTint: string
  editor?: any
  flatContainerStyle?: StyleProp<ViewStyle>
  getEditor?: () => RichEditorRef
  iconGap?: number
  iconMap?: any
  iconSize?: number
  iconTint?: string
  itemStyle?: StyleProp<ViewStyle>
  onFurther?: {}
  onInsertImage?: () => void
  onInsertLink?: () => void
  onInsertVideo?: () => void
  selectedButtonStyle?: StyleProp<ViewStyle>
  selectedIconTint: string
  style?: StyleProp<ViewStyle>
  unselectedButtonStyle?: StyleProp<ViewStyle>
}

export interface RichEditorProps extends WebViewProps {
  autoCapitalize?: 'off' | 'none' | 'on' | 'sentences' | 'words' | 'characters'
  autoCorrect?: boolean
  defaultParagraphSeparator?: defaultParagraphSeperator
  disabled?: boolean
  editorInitializedCallback?: () => void
  editorStyle?: {
    backgroundColor?: string
    caretColor?: string
    color?: string
    contentCSSText?: string
    cssText?: string
    font?: string
    initialCSSText?: string
    placeholderColor?: string
  }
  enterKeyHint?: 'done' | 'go' | 'next' | 'search' | 'send'
  firstFocusEnd?: boolean
  initialContentHTML?: string
  initialFocus?: boolean
  initialHeight?: number
  onBlur?: () => void
  onChange?: (text: string) => void
  onCursorPosition?: (offsetY: number) => void
  onFocus?: () => void
  onHeightChange?: (height: number) => void
  onInput?: (data: any) => void
  onKeyDown?: (event: React.KeyboardEvent) => void
  onKeyUp?: (event: React.KeyboardEvent) => void
  onMessage?: (message: WebViewMessageEvent) => void
  onPaste?: (data: string) => void
  pasteAsPlainText?: boolean
  placeholder?: string
  style?: StyleProp<ViewStyle>
  useContainer?: boolean
}

export interface RichEditorRef {
  blurContentEditor: () => void
  command: (command: string) => void
  commandDOM: (command: string) => void
  dismissKeybord: () => void
  focusContentEditor: () => void
  injectJavascript: (type: string) => void
  insertHTML: (html: string) => void
  insertImage: (attributes: string, style: string) => void
  insertLink: (title: string, url: string) => void
  insertText: (text: string) => void
  insertVideo: (attributes: string, style: string) => void
  isKeyboardOpen: boolean
  preCode: (type: string) => void
  registerToolbar(listener: any): void
  sendAction: (type: string, action?: string, data?: any, options?: any) => void
  setFontSize: (size: 1 | 2 | 3 | 4 | 5 | 6 | 7) => void
  setForeColor: (color: string) => void
  setHiliteColor: (color: string) => void
  showAndroidKeyboard: () => void
}

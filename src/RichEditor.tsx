import React, {
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from 'react'
import {
  Keyboard,
  Platform,
  StyleSheet,
  TextInput,
  View,
} from 'react-native'
import { WebView } from 'react-native-webview'
import {
  actions,
  messages,
} from './const'

import { createHTML } from './editor'
import type {
  RichEditorProps,
  RichEditorRef,
} from './types'

const RichEditor = React.forwardRef<RichEditorRef, RichEditorProps>((props, ref) => {
  const {
    autoCapitalize = 'off',
    autoCorrect,
    defaultParagraphSeparator = 'div',
    disabled = false,
    editorInitializedCallback = () => {},
    editorStyle: {
      backgroundColor,
      caretColor,
      color,
      contentCSSText,
      cssText,
      font,
      initialCSSText,
      placeholderColor,
    } = {},
    enterKeyHint,
    firstFocusEnd,
    initialContentHTML = '',
    initialFocus = true,
    initialHeight = 0,
    onBlur,
    onChange,
    onCursorPosition,
    onFocus,
    onHeightChange,
    onInput,
    onKeyDown,
    onKeyUp,
    onPaste,
    pasteAsPlainText = false,
    placeholder = '',
    style = {},
    useContainer = true,
  } = props

  const [contentReject, setContentReject] = useState<Function>()
  const [contentResolve, setContentResolve] = useState<Function>()
  const [toolbarItemsListener, setToolbarItemsListener] = useState<any[]>([])
  const [focusListeners, setFocusListeners] = useState<any[]>([])
  const [hasFocus, setFocus] = useState<boolean>(false)
  const [height, setHeight] = useState<number>(initialHeight ? initialHeight : 0)
  const [html, setHtml] = useState<string>('')
  const [inputRef, setInputRef] = useState<any>()
  const [isKeyboardOpen, setKeyboardOpen] = useState<boolean>(false)
  const [layout, setLayout] = useState<any>()
  
  const webviewBridge = useRef<WebView>()

  useEffect(() => {
    let h = createHTML({
      autoCapitalize,
      autoCorrect,
      backgroundColor,
      caretColor,
      color,
      contentCSSText,
      cssText,
      defaultParagraphSeparator,
      firstFocusEnd,
      font,
      enterKeyHint,
      initialCSSText,
      initialFocus: initialFocus && !disabled,
      inputListener: !!onInput,
      keyDownListener: !!onKeyDown,
      keyUpListener: !!onKeyUp,
      pasteAsPlainText,
      pasteListener: !!onPaste,
      placeholderColor,
      useContainer,
    })
    setHtml(h)
  }, [])

  useEffect(() => {
    const showSubscription = Keyboard.addListener('keyboardDidShow', keyboardDidShow)
    const hideSubscription = Keyboard.addListener('keyboardDidHide', keyboardDidHide)

    return () => {
      showSubscription.remove()
      hideSubscription.remove()
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useImperativeHandle(ref, () => {
    return {
      dismissKeybord,
      focusContentEditor,
      insertImage,
      insertLink,
      insertText,
      insertVideo,
      isKeyboardOpen,
      registerToolbar,
      sendAction,
      showAndroidKeyboard,
    }
  },[])

  const keyboardDidShow = () => {
    setKeyboardOpen(true)
  }

  const keyboardDidHide = () => {
    setKeyboardOpen(false)
  }

  const registerToolbar = (listener: any) => {
    setToolbarItemsListener([
      ...toolbarItemsListener,
      listener,
    ])
  }

  const initWebview = () => {
    initialContentHTML && setContentHTML(initialContentHTML)
    placeholder && setPlaceholder(placeholder)
    setDisabled(disabled)
    editorInitializedCallback()

    initialFocus && !disabled && focusContentEditor()
    sendAction(actions.init)
  }

  const onMessage = (event: any) => {
    const { onMessage } = props
    try {
      const message = JSON.parse(event.nativeEvent.data)
      const data = message.data
      switch (message.type) {
        case messages.CONTENT_HTML_RESPONSE:
          // TODO: neeeds to ne tested
          console.log('content html response')
          if (contentResolve) {
            contentResolve(message.data)
            setContentResolve(undefined)
            setContentReject(undefined)
            // if (pendingContentHtml) {
            //   clearTimeout(pendingContentHtml)
            //   pendingContentHtml = undefined
            // }
          }
          break
        case messages.LOG:
          console.log('FROM EDIT:', ...data)
          break
        case messages.SELECTION_CHANGE:
          const items = message.data
          toolbarItemsListener.map(listener => {
            listener(items)
          })
          break
        case messages.CONTENT_FOCUSED:
          setFocus(true)
          focusListeners.map(da => da()) // Subsequent versions will be deleted
          onFocus?.()
          break
        case messages.CONTENT_BLUR:
          setFocus(false)
          onBlur?.()
          break
        case messages.CONTENT_CHANGE:
          onChange?.(data)
          break
        case messages.CONTENT_PASTED:
          onPaste?.(data)
          break
        case messages.CONTENT_KEYUP:
          onKeyUp?.(data)
          break
        case messages.CONTENT_KEYDOWN:
          onKeyDown?.(data)
          break
        case messages.ON_INPUT:
          onInput?.(data)
          break
        case messages.OFFSET_HEIGHT:
          setWebHeight(data)
          break
        case messages.OFFSET_Y:
          let offsetY = Number.parseInt(Number.parseInt(data) + layout?.y || 0)
          if (onCursorPosition) {
            offsetY > 0 && onCursorPosition(offsetY)
          }
          break
        default:
          onMessage?.(message)
          break
      }
    } catch (e) {
      //alert('NON JSON MESSAGE')
    }
  }

  const blurContentEditor = () => {
    sendAction(actions.content, 'blur')
  }

  const command = (command: any) => {
    if (command) {
      sendAction(actions.content, 'command', command)
    }
  }

  const commandDOM = (command: any) => {
    if (command) {
      sendAction(actions.content, 'commandDOM', command)
    }
  }

  const dismissKeybord = () => {
    hasFocus ? blurContentEditor() : Keyboard.dismiss()
  }

  const focusContentEditor = () => {
    showAndroidKeyboard()
    sendAction(actions.content, 'focus')
  }
  
  const insertHTML = (html: string) => {
    sendAction(actions.insertHTML, 'result', html)
  }

  const insertImage = (attributes: string, style: string) => {
    sendAction(actions.insertImage, 'result', attributes, style)
  }

  const insertLink = (title: string, url: string) => {
    if (url) {
      showAndroidKeyboard()
      sendAction(actions.insertLink, 'result', {title, url})
    }
  }

  const insertText = (text: string) => {
    sendAction(actions.insertText, 'result', text)
  }

  const insertVideo = (attributes: string, style: string) => {
    sendAction(actions.insertVideo, 'result', attributes, style)
  }

  const preCode = (type: any) => {
    sendAction(actions.code, 'result', type)
  }

  const setContentHTML = (html: string) => {
    sendAction(actions.content, 'setHtml', html)
  }

  const setContentStyle = (styles: string) => {
    sendAction(actions.content, 'setContentStyle', styles)
  }

  const setDisabled = (dis: boolean) => {
    sendAction(actions.content, 'setDisabled', !!dis)
  }

  const setFontName = (fontName: string) => {
    sendAction(actions.fontName, 'result', fontName)
  }

  const setFontSize = (size: number | string) => {
    sendAction(actions.fontSize, 'result', size)
  }

  const setForeColor = (color: string) => {
    sendAction(actions.foreColor, 'result', color)
  }

  const setHiliteColor = (color: string) => {
    sendAction(actions.hiliteColor, 'result', color)
  }

  const setPlaceholder = (placeholder: string) => {
    sendAction(actions.content, 'setPlaceholder', placeholder)
  }

  const setWebHeight = (givenHeight: number) => {
    if (givenHeight !== height) {
      const maxHeight = Math.max(givenHeight, initialHeight)
      if (useContainer && maxHeight >= initialHeight) {
        setHeight(maxHeight)
      }
      onHeightChange && onHeightChange(height)
    }
  }

  /**
   * open android keyboard
   * @platform android
   */
  const showAndroidKeyboard = () => {
    if (Platform.OS === 'android' && webviewBridge) {
      isKeyboardOpen && inputRef.focus()
      webviewBridge?.current?.requestFocus && webviewBridge.current.requestFocus()
    }
  }

  const sendAction = (type: string, action?: string, data?: any, options?: any) => {
    const jsonString = JSON.stringify({type, name: action, data, options})
    webviewBridge?.current?.postMessage && webviewBridge.current?.postMessage(jsonString)
  }

  const renderWebview = () => {
    return (
      <>
        <WebView
          useWebKit={true}
          scrollEnabled={false}
          hideKeyboardAccessoryView={true}
          keyboardDisplayRequiresUserAction={false}
          nestedScrollEnabled={!useContainer}
          style={[styles.webview, style]}
          // {...rest}
          ref={webviewBridge}
          onMessage={onMessage}
          originWhitelist={['*']}
          dataDetectorTypes={'none'}
          domStorageEnabled={false}
          bounces={false}
          javaScriptEnabled={true}
          source={{html: html}}
          onLoad={initWebview}
        />
        {Platform.OS === 'android' && <TextInput ref={ref => (setInputRef(ref))} style={styles._input} />}
      </>
    )
  }

  const onViewLayout = ({ nativeEvent: { layout } }) => {
    setLayout(layout)
  }

  return (
    useContainer ? (
      <View style={[style, { height: height }]} onLayout={onViewLayout}>
        { renderWebview() }
      </View>
      ) : (renderWebview())
  )
})

const styles = StyleSheet.create({
  _input: {
    position: 'absolute',
    width: 1,
    height: 1,
    zIndex: -999,
    bottom: -999,
    left: -999,
  },

  webview: {
    backgroundColor: "transparent"
  }
})

export default RichEditor
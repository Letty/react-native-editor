import React, {
  FC,
  useEffect,
  useState,
} from 'react'
import {
  FlatList,
  Image,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native'

import { actions as editorActions } from './const'
import type { RichToolbarProps } from './types'

type ToolbarItem = {
  action: string,
  selected: boolean,
}

const RichToolbar: FC<RichToolbarProps> = (props) => {
  const {
    actions = defaultActions,
    children,
    disabled,
    disabledButtonStyle,
    disabledIconTint,
    editor,
    flatContainerStyle,
    getEditor,
    iconGap = 16,
    iconMap,
    iconSize = 20,
    iconTint = '#71787F',
    itemStyle,
    onInsertImage,
    onInsertLink,
    onInsertVideo,
    selectedButtonStyle,
    selectedIconTint,
    style,
    unselectedButtonStyle,
  } = props
  const availableActions = actions
  const [data, setData] = useState<ToolbarItem[]>([])
  const [editorRef, setEditorRef] = useState<any>()
  const [items, setItems] = useState<string[]>([])

  useEffect(() => {
    let e = null
    if (editor !== undefined || editor !== null) {
      e = editor.current
    } else if (getEditor) {
      e = getEditor
    }
    e.registerToolbar((_selectedItems: string[]) => setSelectedItems(_selectedItems))
    setEditorRef(e)

    if (availableActions) {
      let d: ToolbarItem[] = []
      for(let i = 0; i < availableActions.length; i++) {
        d.push({
          action: availableActions[i]!,
          selected: false,
        })
      }
      setData(d)
    }
  }, [])

  const getIcon = (action: string) => {
    if (iconMap && iconMap[action]) {
      return iconMap[action]
    } else {
      return getDefaultIcon()[action]
    }
  }

  const setSelectedItems = (selection: string[]) => {
    if (editor && items !== selection) {
      let d = availableActions.map((action: string) => ({action, selected: selection.includes(action)}))
      setItems(selection)
      setData(d)
    }
  }

  const handleKeyboard = () => {
    if (!editor) return
    if (editor.isKeyboardOpen) {
      editor.dismissKeybord()
    } else {
      editor.focusContentEditor()
    }
  }

  const onPressAction = (action: string) => {
    if (!editor) return
    
    switch (action) {
      case editorActions.insertLink:
        if (onInsertLink) return onInsertLink()
      case editorActions.setBold:
      case editorActions.setItalic:
      case editorActions.undo:
      case editorActions.redo:
      case editorActions.insertBulletsList:
      case editorActions.insertOrderedList:
      case editorActions.checkboxList:
      case editorActions.setUnderline:
      case editorActions.heading1:
      case editorActions.heading2:
      case editorActions.heading3:
      case editorActions.heading4:
      case editorActions.heading5:
      case editorActions.heading6:
      case editorActions.code:
      case editorActions.blockquote:
      case editorActions.line:
      case editorActions.setParagraph:
      case editorActions.removeFormat:
      case editorActions.alignLeft:
      case editorActions.alignCenter:
      case editorActions.alignRight:
      case editorActions.alignFull:
      case editorActions.setSubscript:
      case editorActions.setSuperscript:
      case editorActions.setStrikethrough:
      case editorActions.setHR:
      case editorActions.indent:
      case editorActions.outdent:
        editorRef.showAndroidKeyboard()
        editorRef.sendAction(action, 'result')
        break;
      case editorActions.insertImage:
        onInsertImage && onInsertImage()
        break
      case editorActions.insertVideo:
        onInsertVideo && onInsertVideo()
        break
      case editorActions.keyboard:
        handleKeyboard()
        break
      default:
        // @ts-ignore
        props[action] && props[action]()
        break;
    }
  }

  const renderItem = ({ item }: { item: ToolbarItem }) => {
    const icon =  getIcon(item.action)
    const selected = item.selected
    const tintColor = disabled ? disabledIconTint : selected ? selectedIconTint : iconTint
    return (
      <TouchableOpacity
      key={item.action}
      disabled={disabled}
      onPress={() => onPressAction(item.action)}
      style={[
        { width: iconGap + iconSize },
        styles.item,
        itemStyle,
        selected && selectedButtonStyle ? unselectedButtonStyle : null,
      ]}
      >
        {icon ? (
          typeof icon === 'function' ? (
            icon({selected, disabled, tintColor, iconSize, iconGap})
          ) :
            <Image
              source={icon}
              style={{
                tintColor,
                height: iconSize,
                width: iconSize,
              }}
              />
          // )
        ) : null }
      </TouchableOpacity>
    )
  }
  
  return (
    <View style={[
      styles.barContainer,
      style,
      disabled && disabledButtonStyle && disabledButtonStyle
    ]}>
      <FlatList
        alwaysBounceHorizontal={false}
        contentContainerStyle={flatContainerStyle}
        data={data}
        horizontal
        keyboardShouldPersistTaps="always"
        keyExtractor={(item, index) => item.action + '-' + index}
        renderItem={renderItem}
        showsHorizontalScrollIndicator={false}
      />
      { children }
    </View>
  )
}

const styles = StyleSheet.create({
  barContainer: {
    height: 44,
    backgroundColor: '#efefef',
    alignItems: 'center',
  },
  item: {
    justifyContent: 'center',
    alignItems: 'center',
  }
})

export const defaultActions: string[] = [
  editorActions.keyboard,
  editorActions.setBold,
  editorActions.setItalic,
  editorActions.setUnderline,
  editorActions.removeFormat,
  editorActions.insertBulletsList,
  editorActions.indent,
  editorActions.outdent,
  editorActions.insertLink,
]

const getDefaultIcon = () => {
  const icons: any = {} 
  icons[editorActions.insertImage] = require('../img/image.png')
  icons[editorActions.keyboard] = require('../img/keyboard.png')
  icons[editorActions.setBold] = require('../img/bold.png')
  icons[editorActions.setItalic] = require('../img/italic.png')
  icons[editorActions.setSubscript] = require('../img/subscript.png')
  icons[editorActions.setSuperscript] = require('../img/superscript.png')
  icons[editorActions.insertBulletsList] = require('../img/ul.png')
  icons[editorActions.insertOrderedList] = require('../img/ol.png')
  icons[editorActions.insertLink] = require('../img/link.png')
  icons[editorActions.setStrikethrough] = require('../img/strikethrough.png')
  icons[editorActions.setUnderline] = require('../img/underline.png')
  icons[editorActions.insertVideo] = require('../img/video.png')
  icons[editorActions.removeFormat] = require('../img/remove_format.png')
  icons[editorActions.undo] = require('../img/undo.png')
  icons[editorActions.redo] = require('../img/redo.png')
  icons[editorActions.checkboxList] = require('../img/checkbox.png')
  icons[editorActions.table] = require('../img/table.png')
  icons[editorActions.code] = require('../img/code.png')
  icons[editorActions.outdent] = require('../img/outdent.png')
  icons[editorActions.indent] = require('../img/indent.png')
  icons[editorActions.alignLeft] = require('../img/justify_left.png')
  icons[editorActions.alignCenter] = require('../img/justify_center.png')
  icons[editorActions.alignRight] = require('../img/justify_right.png')
  icons[editorActions.alignFull] = require('../img/justify_full.png')
  icons[editorActions.blockquote] = require('../img/blockquote.png')
  icons[editorActions.line] = require('../img/line.png')
  icons[editorActions.fontSize] = require('../img/fontSize.png')
  return icons
}

export default RichToolbar
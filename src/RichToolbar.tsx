import React, {
  useEffect,
  useState,
} from 'react'
import {
  FlatList,
  Image,
  StyleProp,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ViewStyle,
} from 'react-native'

import { actions as editorActions } from './const'
import type { defaultActions, RichEditor } from './types'

type RichToolbar = {
  actions?: Partial<defaultActions> | string[],
  children: React.ReactNode,
  disabled?: boolean,
  disabledButtonStyle?: StyleProp<ViewStyle>,
  disabledIconTint: string,
  editor?: any,
  flatContainerStyle?: StyleProp<ViewStyle>,
  getEditor?: () => RichEditor,
  iconGap?: number,
  iconMap?: any,
  iconSize?: number,
  iconTint?: string,
  itemStyle?: StyleProp<ViewStyle>,
  onInsertImage?: () => void,
  onInsertLink?: () => void,
  onInsertVideo?: () => void,
  selectedButtonStyle?: StyleProp<ViewStyle>,
  selectedIconTint: string,
  style?: StyleProp<ViewStyle>,
  unselectedButtonStyle?: StyleProp<ViewStyle>,
}

type ToolbarItem = [
  action: string,
  selected: boolean,
]

const RichToolbar: React.FC<RichToolbar> = ({
  actions = defaultActions,
  children,
  disabled,
  disabledButtonStyle,
  disabledIconTint,
  editor,
  flatContainerStyle,
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
}) => {
  const [data, setData] = useState<ToolbarItem[]>()
  const [editorRef, setEditorRef] = useState<any>()

  useEffect(() => {
    if (editor !== undefined || editor !== null) {
      setEditorRef(editor.current)
    }
    if (actions) {
      let d: ToolbarItem[] = []
      for(let i = 0; i < actions.length; i++) {
        d.push({
          action: actions[i],
          selected: false,
        })
      }
      setData(d)
    }
  }, [])

  const changeSelection = (selectedAction) => {
    let d = []
    for(let i = 0; i < data.length; i++) {
      d.push({
        action: data[i].action,
        selected: data[i].action === selectedAction ? !data[i]?.selected : data[i]?.selected,
      })
    }
    setData(d)
  }
  const _getIcon = (action: string) => {
    if (iconMap && iconMap[action]) {
      return iconMap[action]
    } else {
      return getDefaultIcon()[action]
    }
  }

  const _onPress = (action: string) => {
    if (!editor) return

    changeSelection(action)
    
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
        // handleKeyboard()
        break
      default:
        break;
    }
  }

  const renderItem = ({ item }) => {
    const icon =  _getIcon(item.action)
    const tintColor = disabled ? disabledIconTint : item.selected ? selectedIconTint : iconTint
    return (
      <TouchableOpacity
      key={item.action}
      disabled={disabled}
      onPress={() => _onPress(item.action)}
      style={[
        { width: iconGap + iconSize },
        styles.item,
        itemStyle,
        item.selected && selectedButtonStyle ? selectedButtonStyle : null,
      ]}
      >
        {icon ? (
          // typeof icon === 'function' ? (
          //   icon({item.selected, disabled, tintColor, iconSize, iconGap})
          // ) : (
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
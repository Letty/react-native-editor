/* eslint-disable react-native/no-inline-styles */
import * as React from 'react'
import { StyleSheet, View, Text, TextInput } from 'react-native'
import { actions, RichEditor, RichToolbar } from 'react-native-editor'
import type { IconProps, RichEditorRef } from 'src/types'

const iconDict = {
  loveAction: require('./heart-solid.png'),
  otherAction: (data: IconProps) => {
    return (
      <View>
        <Text
          style={{
            color: data.selected ? data.tintColor : 'black',
          }}
        >
          👾
        </Text>
      </View>
    )
  },
}

const imageList = [
  'https://upload.wikimedia.org/wikipedia/commons/5/54/Rayleigh-Taylor_instability.jpg',
  'https://upload.wikimedia.org/wikipedia/commons/1/1a/Carnabotnet_geovideo_lowres.gif',
]

const initHTML = `<br/>
<center>
  <b id="title" contenteditable="false">Rich Editor</b>
  <img src="${imageList[1]}" contenteditable="false"  height="170px"/>
</center>
<div>Some content goes here</div>
</div>
`

export default function App() {
  const [content, setContent] = React.useState<string | undefined>(initHTML)
  const richText = React.createRef<RichEditorRef>()
  const [toolbarActions, setToolbarActions] = React.useState<string[]>([
    actions.setBold,
    actions.setItalic,
    actions.insertBulletsList,
    actions.insertOrderedList,
    'loveAction',
  ])

  // TODO changing the toolbarActions with useeffect leads to disapearing icons
  React.useEffect(() => {
    if (toolbarActions && !toolbarActions.includes('otherAction')) {
      setToolbarActions(toolbarActions.concat(['otherAction']))
    }
  }, [toolbarActions])

  return (
    <View style={styles.container}>
      <Text>Regular Input</Text>
      <TextInput />
      <Text>Richtext Editor</Text>
      <View style={styles.textContainer}>
        <RichEditor
          editorStyle={{
            backgroundColor: '#f4e2fc',
            contentCSSText: `
              font-size: 20px;
            `,
            font: 'Lato',
          }}
          initialFocus={true}
          initialContentHTML={content}
          onChange={setContent}
          // pasteAsPlainText
          placeholder={'Schreibe den Nachrichtentext (mind. 14 Zeichen).'}
          ref={richText}
          scrollEnabled={true}
          useContainer={false}
        />
      </View>
      <RichToolbar
        actions={toolbarActions}
        editor={richText}
        iconMap={iconDict}
        iconSize={20}
        loveAction={() => {
          richText?.current?.insertHTML('<span><3<3<3<3<3</span>')
        }}
        otherAction={() => {
          richText?.current?.insertHTML('<span>👾👾👾👾👾👾👾👾👾👾</span>') 
        }}
        reference={richText}
        selectedIconTint={'pink'}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 50,
  },
  textContainer: {
    backgroundColor: '#f4e2fc',
    flexGrow: 1,
    width: '100%',
  },
})

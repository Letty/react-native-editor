import * as React from 'react'
import { StyleSheet, View, Text } from 'react-native'
import {
  actions,
  RichEditor,
  RichToolbar,
} from 'react-native-editor'
import type { RichEditorRef } from 'src/types'

const iconDict =  {
  'loveAction': require('./heart-solid.png'),
  'otherAction': (selected: boolean, disabled: boolean, tintColor: string, iconSize: number, iconGap: number) => (
    <View>
      <Text>O</Text>
    </View>
  )
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
`;

const toolbarActions = [
  actions.setBold,
  actions.setItalic,
  actions.insertBulletsList,
  actions.insertOrderedList,
  'loveAction',
  'otherAction'
]

export default function App() {
  const [content, setContent] = React.useState<string | undefined>(initHTML)
  const richText = React.createRef<RichEditorRef>()

  return (
    <View style={styles.container}>
      <View style={styles.textContainer}>
        <RichEditor
          editorStyle={{
            contentCSSText: `
              font-size: 20px;
            `,
            font: 'Lato',
          }}
          initialContentHTML={content}
          onChange={setContent}
          // pasteAsPlainText
          placeholder={'Schreibe den Nachrichtentext (mind. 14 Zeichen).'}
          ref={richText}
          scrollEnabled={true}
          useContainer={false}
        />
        <RichToolbar
          actions={toolbarActions}
          editor={richText}
          iconMap={iconDict}
          iconSize={20}
          loveAction={() => console.log('<3')}
          otherAction={() => console.log('👾')}
          reference={richText}
          selectedIconTint={'pink'}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  textContainer: {
    backgroundColor: '#f4e2fc',
    height: 400,
    width: '100%',
  },
  box: {
    width: 60,
    height: 60,
    marginVertical: 20,
  },
});

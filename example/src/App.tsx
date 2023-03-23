import * as React from 'react';

import { StyleSheet, View, Text } from 'react-native';
import {
  actions,
  multiply,
  RichEditor,
  RichToolbar,
} from 'react-native-editor';

const imageList = [
  'https://upload.wikimedia.org/wikipedia/commons/5/54/Rayleigh-Taylor_instability.jpg',
  'https://upload.wikimedia.org/wikipedia/commons/1/1a/Carnabotnet_geovideo_lowres.gif',
  'https://img.lesmao.vip/k/h256/R/MeiTu/1297.jpg',
  'https://img.lesmao.vip/k/h256/R/MeiTu/1292.jpg',
]

const initHTML = `<br/>
<center><b onclick="_.sendEvent('TitleClick')" id="title" contenteditable="false">Rich Editor</b></center>
<center>
<a href="https://github.com/wxik/react-native-rich-editor">React Native</a>
<span>And</span>
<a href="https://github.com/wxik/flutter-rich-editor">Flutter</a>
</center>
<br/>
<div><center><img src="${imageList[0]}" onclick="_.sendEvent('ImgClick')" contenteditable="false" height="170px"/></center></div>
<pre type="javascript"><code>const editor = ReactNative;</code><code>console.log(editor);</code></pre>
<br/>Click the picture to switch<br/><br/>
<div>
<img src="${imageList[0]}" onclick="_.sendEvent('ImgClick')" contenteditable="false" height="170px"/>
<img src="${imageList[1]}" onclick="_.sendEvent('ImgClick')" contenteditable="false"/>
</div>
`;

export default function App() {
  const [result, setResult] = React.useState<number | undefined>()
  const [content, setContent] = React.useState<string | undefined>(initHTML)
  const richText = React.createRef() || useRef()

  React.useEffect(() => {
    multiply(3, 7).then(setResult);
  }, []);

  return (
    <View style={styles.container}>
      <Text>Result: {result}</Text>
      <View style={styles.textContainer}>
        <RichEditor
          editorStyle={{
            contentCSSText: `
              font-size: 16px;
            `,
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
          actions={[
            actions.setBold,
            actions.setItalic,
            actions.insertBulletsList,
            actions.insertOrderedList,
          ]}
          editor={richText}
          iconSize={20}
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

import React, { useState } from 'react';
import { Text, TextInput, View, TouchableOpacity } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import styles from './styles';

export default function NoteScreen({route, navigation}) {
  
  const note = route.params.note;
  console.log(note)
  const [edit, setEdit] = useState(false);
  const [content, setContent] = useState(note.content);
 
  return (
    <KeyboardAwareScrollView
      keyboardDismissMode='interactive'>
      <Text>
        {note.title}
      </Text>
      <TouchableOpacity onPress={() => setEdit(true)}>
        <TextInput 
              multiline={true}
              onChangeText={text => setContent(text)}
              value={content}
            />
        {edit 
          ? <TextInput
          style={styles.input}
              multiline={true}
              placeholder='Enter text...'
              palceholderTextColor='#aaaaaa'
              onChangeText={text => setContent(text)}
              value={content}
            />
          : <Text>{content}</Text>

        }
      </TouchableOpacity>
    </KeyboardAwareScrollView>
  )
}
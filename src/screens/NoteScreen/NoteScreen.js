import React, { useState } from 'react';
import { Text, TextInput, View, TouchableOpacity } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import styles from './styles';

import { firebase } from '../../firebase/config';

export default function NoteScreen({route, navigation}) {

  const noteRef = firebase.firestore().collection('notes');
  
  // note content prior to user content
  const note = route.params.note;
  //note content after user input
  const [content, setContent] = useState(note.content);
  const [edit, setEdit] = useState(false);

  const onSaveButtonPress = () => {
    if (content && content.length > 0) {
      const timestamp = firebase.firestore.FieldValue.serverTimestamp();
      const data = {
        content: content,
        timestamp: timestamp,
      };
      
      noteRef
        .doc(note.id)
        .update(data)
        .then(() => {
          //update note content to prevent seeing old content on cancel
          note.content = content;     
          setEdit(false)})
    }
  };

  const onCancelButtonPress = () => {
    //cancel changes note state to content prior to user input
    setContent(note.content)
    setEdit(false)
  }
 
  return (
    <KeyboardAwareScrollView
      style={styles.container}
      keyboardDismissMode='interactive'>
      <Text style={styles.title}>
        {note.title}
      </Text>
      <TouchableOpacity onPress={() => setEdit(true)}>
      <View style={styles.noteContainer}>
        <TextInput
              style={styles.input}
              multiline={true}
              placeholder='Enter text...'
              palceholderTextColor='#aaaaaa'
              onChangeText={text => setContent(text)}
              onTextInput={() => setEdit(true)}
              value={content}
            />
      </View>
      </TouchableOpacity>
      <View style={styles.buttonContainer}>
        {edit && 
            <View style={styles.buttonContainer}>
              <TouchableOpacity 
                style={styles.button} 
                onPress={onCancelButtonPress}>
                <Text style={styles.buttonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={styles.button} 
                onPress={onSaveButtonPress}>
                <Text style={styles.buttonText}>Save</Text>
              </TouchableOpacity>
            </View>
        }
      </View>
    </KeyboardAwareScrollView>
  )
}
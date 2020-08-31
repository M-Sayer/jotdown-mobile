import React, { useEffect, useState, useContext } from 'react';
import { Text, View, FlatList, Keyboard, TextInput, TouchableOpacity } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import styles from './styles';
import { firebase } from '../../firebase/config';
import UserContext from '../../Contexts/UserContext';

export default function HomeScreen({navigation}) {

  const userContext = useContext(UserContext)

  const [noteTitle, setNoteTitle] = useState('');
  const [notes, setNotes] = useState([]);

  const noteRef = firebase.firestore().collection('notes');
  const userId = userContext.user.uid;

  useEffect(() => {
    noteRef
      .where('authorID', '==', userId)
      .orderBy('timestamp', 'desc')
      .onSnapshot(querySnapshot => {
        const newNotes = [];
        querySnapshot.forEach(doc => newNotes.push({...doc.data(), id: doc.id}));
        setNotes(newNotes);
      }, error => console.log(error)
      )
  }, [])

  const onAddButtonPress = () => {
    if (noteTitle && noteTitle.length > 0) {
      const timestamp = firebase.firestore.FieldValue.serverTimestamp();
      const data = {
        title: noteTitle,
        authorID: userId,
        timestamp: timestamp,
        content: '',
      };
      
      noteRef
        .add(data)
        .then(() => {
          setNoteTitle('')
          Keyboard.dismiss()
        })
        .catch(error => alert(error))
    }
  }

  const onNotePress = (note) => {
    return navigation.navigate('Note', { note })
  }

  const renderNote = ({ item }) => {
    return (
      
        <View style={styles.noteContainer}>
          <TouchableOpacity onPress={() => onNotePress(item)}>
            <Text style={styles.noteTitle}>
              {item.title}
            </Text>
          </TouchableOpacity>
        </View>
    
    )
  }

  return (
    <KeyboardAwareScrollView 
    keyboardShouldPersistTaps='always'
      style={styles.container}>
      <View style={styles.formContainer}>
        <TextInput
          style={styles.input}
          placeholder='Add new note'
          placeholderTextColor='#aaaaaa'
          onChangeText={text => setNoteTitle(text)}
          value={noteTitle}
          autoCapitalize='none'
        />
        <TouchableOpacity style={styles.button} onPress={onAddButtonPress}>
          <Text style={styles.buttonText}>Add</Text>
        </TouchableOpacity>
      </View>
      { notes && (
          <View style={styles.listContainer}>
            <FlatList
              data={notes}
              renderItem={renderNote}
              keyExtractor={note => note.id}
              removeClippedSubviews={true}
            />
          </View>
      )}
    </KeyboardAwareScrollView>
  )
}
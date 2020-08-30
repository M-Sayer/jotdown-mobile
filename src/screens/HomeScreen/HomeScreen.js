import React, { useEffect, useState, useContext } from 'react';
import { Text, View, FlatList, Keyboard, TextInput, TouchableOpacity } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import styles from './styles';
import { firebase } from '../../firebase/config';
import UserContext from '../../Contexts/UserContext';

export default function HomeScreen({navigation}) {

  const userContext = useContext(UserContext)

  const [noteText, setNoteText] = useState('');
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
    if (noteText && noteText.length > 0) {
      const timestamp = firebase.firestore.FieldValue.serverTimestamp();
      const data = {
        text: noteText,
        authorID: userId,
        timestamp: timestamp,
      };
      
      noteRef
        .add(data)
        .then(() => {
          setNoteText('')
          Keyboard.dismiss()
          console.log(noteText)
        })
        .catch(error => alert(error))
    }
  }

  const onNotePress = (item) => {
    console.log(item.id)
    return navigation.navigate('Note')
  }

  const renderNote = ({ item }) => {
    return (
      
        <View style={styles.noteContainer}>
          <TouchableOpacity onPress={() => onNotePress(item)}>
            <Text style={styles.noteText}>
              {item.text}
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
          onChangeText={text => setNoteText(text)}
          value={noteText}
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
              keyExtractor={item => item.id}
              removeClippedSubviews={true}
            />
          </View>
      )}
    </KeyboardAwareScrollView>
  )
}
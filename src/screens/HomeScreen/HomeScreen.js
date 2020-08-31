import React, { useEffect, useState, useContext } from 'react';
import { Text, View, FlatList, Keyboard, TextInput, TouchableOpacity, Animated } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import Swipeable from 'react-native-gesture-handler/Swipeable'

import styles from './styles';
import { firebase } from '../../firebase/config';
import UserContext from '../../Contexts/UserContext';

export default function HomeScreen({navigation}) {

  const userContext = useContext(UserContext)

  const [noteTitle, setNoteTitle] = useState('');
  const [notes, setNotes] = useState([]);

  const noteRef = firebase.firestore().collection('notes');
  const userId = userContext.user.uid;
  
  const fetchNotes = () => {
    noteRef
      .where('authorID', '==', userId)
      .orderBy('timestamp', 'desc')
      .onSnapshot(querySnapshot => {
        const newNotes = [];
        querySnapshot.forEach(doc => newNotes.push({...doc.data(), id: doc.id}));
        setNotes(newNotes);
      }, error => console.log(error)
      )
  }
  
  useEffect(() => fetchNotes(), [])

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

  const renderAddButton = () => {
    return (
      <TouchableOpacity style={styles.button} onPress={onAddButtonPress}>
        <Text style={styles.buttonText}>Add</Text>
      </TouchableOpacity>
    )
  }

  const onDeleteButtonPress = (noteId) => {
    
    const newNotes = notes.filter(note => note.id !== noteId)
    
    noteRef
      .doc(noteId)
      .delete()
      .then(() => setNotes(newNotes))
      .catch(error => console.log(error))
    
  }

  const renderDeleteButton = (progress, dragX, noteId) => {
    const scale = dragX.interpolate({
      inputRange: [-100, 0],
      outputRange: [1, 0],
      extrapolate: 'clamp',
    });

    return (
     <TouchableOpacity onPress={() => onDeleteButtonPress(noteId)}>
        <Animated.View 
          style={{ 
          backgroundColor: '#dd2c00',
          justifyContent: 'center',
          alignItems: 'flex-end',
          transform: [{ scale }]    
        }}>
          <Animated.Text 
            style={{ 
              color: 'white',
              padding: 20,
              transform: [{ scale }]
            }}>
            Delete
          </Animated.Text>
        </Animated.View>
     </TouchableOpacity>
    )
  }

  const renderNote = ({ item }) => {
    return (
      <Swipeable
        renderRightActions={(progress, dragX) => renderDeleteButton(progress, dragX, item.id)}
      >
        <View style={styles.noteContainer}>
          <TouchableOpacity onPress={() => onNotePress(item)}>
            <Text style={styles.noteTitle}>
              {item.title}
            </Text>
          </TouchableOpacity>
        </View>
      </Swipeable>
    
    )
  }

  const renderNotes = () => {
    return (
      <View style={styles.listContainer}>
        <FlatList
          data={notes}
          renderItem={renderNote}
          keyExtractor={note => note.id}
          removeClippedSubviews={true}
        />
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
      { renderAddButton() }
      </View>
      { notes && renderNotes() }
    </KeyboardAwareScrollView>
  )
}
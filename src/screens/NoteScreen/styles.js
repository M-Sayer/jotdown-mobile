import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  container: {
    flex: 1,
  },
  title: {
    marginLeft: 20,
    fontSize: 40,
    color: '#212121',
  },
  input: {
    height: 200,
    borderRadius: 5,
    overflow: 'hidden',
    marginTop: 10,
    marginBottom: 10,
  },
  noteContainer: {
    marginTop: 25,
    marginBottom: 25,
    borderTopColor: '#cccccc',
    borderTopWidth: 1,
    padding: 25,

  },
  buttonContainer: {
    flexDirection: 'row',
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  button: {
    height: 47,
    borderRadius: 5,
    backgroundColor: '#788eec',
    width: 80,
    alignItems: 'center',
    justifyContent: 'center',
    margin: 10,
  },
  buttonTitle: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
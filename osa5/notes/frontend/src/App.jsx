import { useState, useEffect } from 'react'
import axios from 'axios'
import Note from './components/Note'
import noteService from './services/notes'
import Notification from './components/Notification'
import Footer from './components/Footer'

const App = () => {

  const [notes, setNotes] = useState([])
  const [newNote, setNewNote] = useState('')
  const [showAll, setShowAll] = useState(true)
  const [errorMessage, setErrorMessage] = useState(null)

  const hook = () => {
    noteService
      .getAll()
      .then(notes => {
        setNotes(notes)
      })
  }
  
  useEffect(hook, [])
  console.log('render', notes.length, 'notes')

  const toggleImportanceOf = id => {
    const note = notes.find(n => n.id === id)
    const changedNote = { ...note, important: !note.important }
  
    noteService
      .update(id, changedNote).then(returnedNote => {
        setNotes(notes.map(note => note.id !== id ? note : returnedNote))
      })
  
      .catch(error => {
        /*alert(
          `the note '${note.content}' was already deleted from server`
        )*/
        setErrorMessage(
          `Note '${note.content}' was already removed from the server.`
        )
        setTimeout(() => {
          setErrorMessage(null)
        }, 5000)
        setNotes(notes.filter(n => n.id !== id))
      })
  }

  const addNote = event => {
    event.preventDefault()
    const noteObject = {
      content: newNote,
      important: Math.random() > 0.5,
    }

    noteService
      .create(noteObject)
      .then(note => {
        setNotes(notes.concat(note))
        setNewNote('')
      })
  }

  const handleNoteChange = (event) => {    
    console.log(event.target.value)    
    setNewNote(event.target.value)
  }

  const notesToShow = showAll
      ? notes
      : notes.filter(note => note.important)

  return (
    <div>
      <h1>Notes</h1>
      <Notification message={errorMessage} />
      <div>
        <button onClick={() => setShowAll(!showAll)}>
          show {showAll ? 'important' : 'all'}
        </button>
      </div>
      <ul>
        {notesToShow.map(note => 
          <Note 
            key={note.id} 
            note={note}
            toggleImportance={() => toggleImportanceOf(note.id)}
          />
        )}
      </ul>
      <form onSubmit={addNote}>

        <input value={newNote}
        onChange={handleNoteChange} />
        <button type="submit">save</button>
      </form>
      <Footer />   
    </div>
  )
}

export default App 
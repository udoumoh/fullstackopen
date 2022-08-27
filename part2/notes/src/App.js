import {useState, useEffect} from 'react'
import noteService from './services/notes'
import Notes from "./components/Notes"
import Notification from './components/Notification'
import Footer from './components/Footer'


const App = () => {
  const [notes, setNotes] = useState([])
  const [newNote, setNewNote] = useState("Add new note")
  const [showAll, setShowAll] = useState(true)
  const [errorMessage, setErrorMessage] = useState(null)

  const notesToShow = showAll ? notes : notes.filter(note => note.important)
  
  const handleNoteChange = (event) => {
    setNewNote(event.target.value)
  }

useEffect(() => {
  noteService.getAll()
  .then(initialNote => setNotes(initialNote)) 
}, [])

const toggleImportance = (id) => {
  const note = notes.find(n => n.id === id)
  const changedNote = {...note, important:!note.important}

  noteService.update(id, changedNote)
  .then(returnedNote => {
    setNotes(notes.map(note => note.id === id ? returnedNote : note))
  }).catch(e => {
    setErrorMessage(
      `The note "${note.content}" was already deleted from our server`
    )
    setTimeout(()=>{
      setErrorMessage(null)
    }, 5000)
    setNotes(notes.filter(note => note.id !== id))
  })
}

  const addNote = (event) => {
    event.preventDefault()
    const noteObject = {
    content: newNote,
    date: new Date().toISOString(),
    important: Math.random() < 0.5,
    id: notes.length + 1,
  }
    noteService.create(noteObject)
    .then(returnedNote => {
      setNotes(notes.concat(returnedNote))
      setNewNote('')
    })
  }
    return(
    <>
        <div>
          <h1>Notes</h1>
          <Notification message = {errorMessage}/>
          <div>
            <button onClick={() => setShowAll(!showAll)}>
              show {showAll ? 'important' : 'all'}
            </button>
          </div>

          <ul>  
            {notesToShow.map(note => 
              <li className="note" key={note.id}><Notes notes={note} toggleImportance={() => toggleImportance(note.id)} /></li>
              )}
          </ul>

          <form onSubmit={addNote}>
            <input value = {newNote} onChange = {handleNoteChange}/>
            <button type="submit">save</button>
          </form>
        </div>
        <Footer />
    </>
    )
  }

export default App
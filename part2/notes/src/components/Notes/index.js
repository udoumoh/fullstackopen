import React from 'react'

const Notes = ({notes, toggleImportance}) => {
  const label = notes.important ? "Toggle not Important" : "Make Important"
  return (
    <div>
        {notes.content} 
        <button onClick={toggleImportance}>{label}</button>
    </div>
  )
}

export default Notes
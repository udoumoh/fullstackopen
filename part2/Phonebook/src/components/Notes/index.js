import React from 'react'

const Notes = (props) => {
    const {notes} = props
  return (
    <div>
        <li key = {notes.id}>{notes.content}</li>
    </div>
  )
}

export default Notes
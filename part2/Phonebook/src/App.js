import { useEffect, useState } from 'react'
import phoneService from './services/phoneRecord.js'
import Notification from './components/Notification/index.js'

const Filter = (props) => {
  let filtered = props.array.filter(person => 
    person.name.toLowerCase().includes(props.filter.toLowerCase()))
    .map(person => 
    <p key={props.array.indexOf(person)}>{person.name} {person.number}</p>
    )
  return(
    <>{filtered}</>
  )
}

const DeleteButton = (props) => {
  return(
    <>
    <button onClick={props.handleDelete}>Delete</button>
    </>
  )
}

const PersonForm = (props) => {
  return(
    <form onSubmit={props.action}>
      <div>
        name: <input type="text" value={props.newName} onChange={props.nameAction} />
      </div>
      <div>
        number: <input type="number" value={props.newNumber} onChange={props.numberAction} />
      </div>
      <div>
        <button type="submit">Add</button>
      </div>
    </form>
  )
}

const Persons = ({person, handleDelete}) => {
  return(
    <>
        <p>
          {person.name} {person.number} 
          <DeleteButton handleDelete={handleDelete}/> 
        </p>
    </>
  )
}

const App = () => {
  const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [filter, setFilter] = useState('')
  const [notificationMessage, setNotificationMessage] = useState({ error:null, success:null })

  useEffect(() => {
    phoneService.getAll()
    .then(response => setPersons(response)
  )},[])

  const addPerson = (event) => {
    event.preventDefault()
    const newRecord = {
      name:newName,
      number:newNumber
    }

    if(persons.find(person => person.name === newName && person.number === newNumber)){
      alert(`${newName} has already been added to the phonebook`)
    }else if(persons.find(person => person.name === newName)){
      const person = persons.find(n => n.name === newName)
      const changedNumber = {...person, number:newNumber}

      if (window.confirm(`${newName} is already added to the phonebook, replace the old number with a new one?`)){
        phoneService.update(person.id, changedNumber).then(response => {
          setPersons(persons.map(person => person.name === newName ? response : person))
          setNotificationMessage({ ...notificationMessage, success: `${person.number} has been changed to ${newNumber}`})
          setTimeout(() => {
            setNotificationMessage({ ...notificationMessage, success:null})
          }, 5000)
        })
        .catch(e => {
          setNotificationMessage({ ...notificationMessage, error: `Information of ${person.name} has already been removed from our server` })
          setTimeout(() => {
            setNotificationMessage({ ...notificationMessage, error: null })
          }, 5000)
        })
      }

    }else{
      phoneService.create(newRecord).then(response => {
        setPersons(persons.filter(person => person.name !== newName).concat(response))
        setNotificationMessage({ ...notificationMessage, success: `Added ${newName}` })
        setTimeout(() => {
          setNotificationMessage({ ...notificationMessage, success: null })
        }, 5000)
      })
    }
    setNewName('')
    setNewNumber('')
  }

  const handleDelete = (id, name) => {
    if (window.confirm(`Delete ${name}?`)) {
      phoneService.deleteRecord(id)  
      setPersons(persons.filter(person => person.id !== id))
    }else{
      phoneService.getAll().then(response => setPersons(response))
    }
  }

  return (
    <div>

      <Notification message={notificationMessage.success} type='success' />
      <Notification message={notificationMessage.error} type='error' />

      <h2>Phonebook</h2>
      <Filter array = {persons} filter = {filter}/>
      <div>
        filter shown with <input value={filter} onChange={(event) => setFilter(event.target.value)} />
      </div>
      <h2>Add a new</h2>
      <PersonForm action={addPerson} nameAction={(event) => setNewName(event.target.value)} numberAction={(event) => setNewNumber(event.target.value)}/>
      <h2>Numbers</h2>
      {persons.map(person => {return(
        <Persons person = {person} handleDelete = {() => handleDelete(person.id, person.name)} key = {person.id}/>
      )})}

    </div>
  )
}

export default App
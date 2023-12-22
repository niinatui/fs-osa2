import { useState, useEffect } from 'react'
import axios from 'axios'
import personService from './services/persons'
import './index.css'

const Persons = (props) => {
  const persons = props.persons
  const filter = props.filter
  const personsFiltered = persons.filter(person => person.name.toLowerCase().includes(filter.toLowerCase()))
  return (
    <div>
  {personsFiltered.map(person => <div key={person.name}> <Names person={person} personName={person.name} personNumber={person.number} deletePerson={props.deletePerson}/></div>)}
  </div>
  )
}

const Names = (props) => {
  return (
    <div>{props.personName} {props.personNumber} <button className="buttonDelete" onClick={() => props.deletePerson(props.person)}>delete</button></div>
  )
}

const PersonForm = (props) => {
  return (
    <form onSubmit={props.addPerson}>
    <div> name: <input value={props.newName} onChange={props.handleNameChange} /></div>
    <div> number: <input value={props.newNumber} onChange={props.handleNumberChange}/></div>
    <div>
      <button type="submit">add</button>
    </div>
  </form>
  )
}

const Filter = (props) => {
  return (
    <div>
      filter shown with <input value={props.filter} onChange={event => props.setFilter(event.target.value)} />
    </div>
  )
}

const ErrorNotification = ({ message }) => {
  if (message === null) {
    return null
  }

  return (
    <div className="error">
      {message}
    </div>
  )
}

const Notification = ({ message }) => {
  if (message === null) {
    return null
  }

  return (
    <div className="notification">
      {message}
    </div>
  )
}

const App = () => {
  const [persons, setPersons] = useState([]) 
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [filter, setFilter] = useState('')
  const [message, setMessage] = useState(null)
  const [errorMessage, setErrorMessage] = useState(null)

  useEffect(() => {
    personService
      .getAll()
      .then(initialPersons => {
        setPersons(initialPersons)
      })
  }, [])

  const addPerson = (event) => {
    event.preventDefault()
    const personObject = {
      name: newName,
      number: newNumber,
    }

    if (persons.find(person => person.name === newName)) {
      if (window.confirm(`${personObject.name} is already added to phonebook, replace the old number with a new one?`)) {
        const PersonToChange = persons.find(person => person.name === newName)
        const updatedPerson = {...PersonToChange, number: newNumber}

        personService
        .update(PersonToChange.id, updatedPerson)
        .then(updated => {
          setPersons(persons.map(person => person.id !== PersonToChange.id ? person : updated))
          setNewName('')
          setNewNumber('')
          setMessage(`Changed ${personObject.name} number`)
          setTimeout(() => {
            setMessage(null)
          }, 5000)
          })
        .catch(() => {
            setErrorMessage(`Information of ${PersonToChange.name}' has already been removed from server`)
            setTimeout(() => {
              setErrorMessage(null)
            }, 5000)
            setPersons(persons.filter(person => person.name !== PersonToChange.name))
            setNewName('')
            setNewNumber('')
          })
      } 
    } else {
      personService
      .create(personObject)
      .then(returnedPerson => {
        setPersons(persons.concat(returnedPerson))
        setNewName('')
        setNewNumber('')
        setMessage(`Added ${personObject.name}`)
        setTimeout(() => {
          setMessage(null)
        }, 5000)
      })
  }
}

  const handleNameChange = (event) => {
    console.log(event.target.value)
    setNewName(event.target.value)
  }

  const handleNumberChange = (event) => {
    setNewNumber(event.target.value)
  }

  const deletePerson = (person) => {
    if (window.confirm(`Delete ${person.name}?`)) {
      personService
        .deleted(person.id)
        .then(() => {
          personService.getAll().then(response => setPersons(response))
          setMessage(
            `Deleted ${person.name}`
          )
          setTimeout(() => {
            setMessage(null)
          }, 5000)
        })
    }
  }

  return (
    <div>
      <h2>Phonebook</h2>
      <Notification message={message} />
      <ErrorNotification message={errorMessage} />
      <Filter filter={filter} setFilter={setFilter} />
      <h2>add a new</h2>
      <PersonForm
        newName={newName}
        newNumber={newNumber}
        setNewNumber={setNewNumber}
        handleNameChange={handleNameChange}
        handleNumberChange={handleNumberChange}
        addPerson={addPerson} />
      <h2>Numbers</h2>
      <Persons persons={persons} filter={filter} deletePerson={deletePerson}/>
    </div>
  )

}

export default App

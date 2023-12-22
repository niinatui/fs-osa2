import { useState, useEffect } from 'react'
import axios from 'axios'
import personService from './services/persons'

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

const App = () => {
  const [persons, setPersons] = useState([]) 
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [filter, setFilter] = useState('')

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
          })
      } 
    } else {
      personService
      .create(personObject)
      .then(returnedPerson => {
        setPersons(persons.concat(returnedPerson))
        setNewName('')
        setNewNumber('')
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
        })
    }
  }

  return (
    <div>
      <h2>Phonebook</h2>
      <Filter filter={filter} setFilter={setFilter} />
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

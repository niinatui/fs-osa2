import { useState, useEffect } from 'react'
import axios from 'axios'

const Persons = (props) => {
  const persons = props.persons
  const filter = props.filter
  const personsFiltered = persons.filter(person => person.name.toLowerCase().includes(filter.toLowerCase()))
  return (
    <div>
  {personsFiltered.map(person => <div key={person.id}> <Names person={person.name} number={person.number} /></div>)}
  </div>
  )
}

const Names = (props) => {
  return (
    <div>{props.person} {props.number}</div>
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
    console.log('effect')
    axios
      .get('http://localhost:3001/persons')
      .then(response => {
        console.log('promise fulfilled')
        setPersons(response.data)
      })
  }, [])
  console.log('render', persons.length, 'notes')

  const addPerson = (event) => {
    event.preventDefault()
    console.log('button clicked', event.target)
    const personObject = {
      name: newName,
      number: newNumber,
      id: persons.length + 1,
    }
    persons.find(person => person.name === newName)
      ? window.alert(`${personObject.name} is already added to phonebook`)
      : setPersons(persons.concat(personObject))
    setNewName('')
    setNewNumber('')
    
  }

  const handleNameChange = (event) => {
    console.log(event.target.value)
    setNewName(event.target.value)
  }

  const handleNumberChange = (event) => {
    setNewNumber(event.target.value)
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
      <Persons persons={persons} filter={filter} />
    </div>
  )

}

export default App

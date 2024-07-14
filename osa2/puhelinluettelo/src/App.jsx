import { useState } from 'react'


const Entry = (props) => {
  return (
    <li>
      <p>{props.name} {props.number}</p>
    </li>
  )
}

const Filter = (props) => {
  const handleFilterwordInputChange = props.onChange
  const filterword = props.filterword
  return (
    <div>
      filter shown with <input onChange={handleFilterwordInputChange} value={filterword} />
    </div>
  )
}

const EntryForm = (props) => {
  const addEntry = props.addEntry
  const handleNameInputChange = props.onNameChange
  const handleNumberInputChange = props.onNumberChange
  const newName = props.nameValue
  const newNumber = props.numberValue
  return (
    <form onSubmit={addEntry}>
      <div>
        name: <input onChange={handleNameInputChange}
        value={newName} />
      </div>
      <div>
        number: <input onChange={handleNumberInputChange}
        value={newNumber} />
      </div>
      <div>
        <button type="submit">add</button>
      </div>
    </form>
  )
}


const App = () => {

  const [persons, setPersons] = useState([
    { name: 'Arto Hellas', number: '040-123456' },
    { name: 'Ada Lovelace', number: '39-44-5323523' },
    { name: 'Dan Abramov', number: '12-43-234345' },
    { name: 'Mary Poppendieck', number: '39-23-6423122' }
  ])

  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [filterword, setNewFilterword] = useState('')

  const handleNameInputChange = (event) => {
    console.log(event.target.value)
    setNewName(event.target.value)
  }
  
  const handleNumberInputChange = (event) => {
    console.log(event.target.value)
    setNewNumber(event.target.value)
  }

  const handleFilterwordInputChange = (event) => {
    console.log(event.target.value)
    setNewFilterword(event.target.value)
  }

  const addEntry = (event) => {
    event.preventDefault()
    if (persons.map(p => p.name).includes(newName)) {
      alert(`${newName} is already added to the phonebook!`)
    } else {
      setPersons(persons.concat({name: newName, number: newNumber}))
      setNewName('')
      setNewNumber('')
    }
  }

  const filteredPersons = persons.filter(p => p.name.toLowerCase().includes(filterword.toLowerCase()))

  return (
    <div>
      <h2>Phonebook</h2>

      <Filter onChange={handleFilterwordInputChange} filterword={filterword} />

      <h3>Add a new entry:</h3>

      <EntryForm addEntry={addEntry}
        onNameChange={handleNameInputChange}
        onNumberChange={handleNumberInputChange}
        nameValue={newName}
        numberValue={newNumber} />

      <h2>Numbers</h2>
      
      <ul>
        {filteredPersons.map(p => 
          <Entry key={p.name} name={p.name} number={p.number} />
        )}
      </ul>
    </div>
  )

}

export default App
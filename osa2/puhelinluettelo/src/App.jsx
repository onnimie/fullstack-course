import { useState } from 'react'


const Entry = (props) => {
  return (
    <li>
      <p>{props.name}</p>
    </li>
  )
}


const App = () => {
  const [persons, setPersons] = useState([
    { name: 'Arto Hellas' }
  ]) 
  const [newName, setNewName] = useState('')

  const handleInputChange = (event) => {
    console.log(event.target.value)
    setNewName(event.target.value)
  }

  const addEntry = (event) => {
    console.log("add entry: ", event)
    event.preventDefault()
    setPersons(persons.concat({name: newName}))
    setNewName('')
  }

  return (
    <div>
      <h2>Phonebook</h2>
      <form onSubmit={addEntry}>
        <div>
          name: <input onChange={handleInputChange}
          value={newName} />
        </div>
        <div>
          <button type="submit">add</button>
        </div>
      </form>
      <h2>Numbers</h2>
      <ul>
        {persons.map(p => 
          <Entry key={p.name} name={p.name} />
        )}
      </ul>
    </div>
  )

}

export default App
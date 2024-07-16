import axios from 'axios'

const phonebookURL = 'http://localhost:3001/persons'

const getPhonebookAll = () => {
    const p = axios.get(phonebookURL)
    return p.then(res => res.data)
}

const addPhonebookEntry = (name, number) => {
    const obj = {name, number}
    // let the server create the id
    const p = axios.post(phonebookURL, obj)
    return p.then(res => res.data)
}

export default { getPhonebookAll, addPhonebookEntry }
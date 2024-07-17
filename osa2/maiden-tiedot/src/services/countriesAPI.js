import axios from 'axios'

const baseURL = "https://studies.cs.helsinki.fi/restcountries/api"

const getAll = () => {
    const promiseResponse = axios.get(`${baseURL}/all`).then(res => res.data)
    return promiseResponse
}

const getAllNames = () => {
    const promiseResponse = getAll().then(res => 
        res.map(obj => obj.name)
    )
    return promiseResponse
}

const getAllNamesCommon = () => {
    const promiseResponse = getAllNames().then(res =>
        res.map(obj => obj.common)
    )
    return promiseResponse
}

const getCountryByName = (name) => {
    const promiseResponse = axios.get(`${baseURL}/name/${name}`).then(res => res.data)
    return promiseResponse
}


export default { 
    getAllNamesCommon,
    getCountryByName
}
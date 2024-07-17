const SearchBar = (props) => {
    const onInputChange = props.onInputChange
    const value = props.value
    return (
        <div>
            find countries by name <></>
            <input onChange={onInputChange} value={value} />
        </div>
    )
}


export default SearchBar

const SearchOutput = (props) => {
    return (
        <ul>
            {props.countryNames.map(name => 
                <li key={name}>
                    {name} <></>
                    <button onClick={() => props.showFunction(name)}>
                        show
                    </button>
                </li>
            )}
        </ul>
    )
}


export default SearchOutput
const CountryInfo = ({countryObj}) => {
    if (!countryObj) {
        return <></>
    } else {
        //console.log(Object.values(countryObj.languages))
        const langs = Object.values(countryObj.languages)
        //console.log(countryObj.flags)
        const flag_src = countryObj.flags.png
        const flag_alt = countryObj.flags.alt
        return (
            <div>
                <h2>
                    {countryObj.name.common} {countryObj.flag}
                </h2>
                
                <p>capital {countryObj.capital[0]}</p>
                <p>area {countryObj.area} </p>
                <b>languages:</b>
                <ul>
                    {langs.map(lang =>
                        <li key={lang}>
                            {lang}
                        </li>
                    )}
                </ul>
                <img src={flag_src} alt={flag_alt} /> 
            </div>
        )
    }
}


export default CountryInfo
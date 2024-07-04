import { useState } from 'react'


const Button = (props) => {
  return (
    <div>
      <button onClick={props.handleClick}>
        {props.text}
      </button>
    </div>
  )
}

const Header = (props) => {
  return (
    <div>
      <h1>{props.text}</h1>
    </div>
  )
}

const StatisticsDisplay = (props) => {
  return (
    <div>
      <h2>Statistics</h2>
      <ul>
        <li>good {props.good}</li>
        <li>neutral {props.neutral}</li>
        <li>bad {props.bad}</li>
      </ul>
    </div>
  )
}


const App = () => {
  // tallenna napit omaan tilaansa
  const [good, setGood] = useState(0)
  const [neutral, setNeutral] = useState(0)
  const [bad, setBad] = useState(0)

  const header = "Give feedback"

  return (
    <div>
      <Header text={header}/>
      <Button handleClick={()=>setGood(good+1)} text='good' />
      <Button handleClick={()=>setNeutral(neutral+1)} text='neutral' />
      <Button handleClick={()=>setBad(bad+1)} text='bad' />
      <StatisticsDisplay good={good} neutral={neutral} bad={bad}/>
    </div>
  )
}

export default App
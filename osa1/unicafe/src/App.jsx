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

const StatisticsLine = ({text, value}) => {
  return (
    <tr>
      <td>{text}</td>
      <td>{value}</td>
    </tr>
  )
}

const StatisticsDisplay = (props) => {
  const total = props.good + props.bad + props.neutral
  const average = (props.good - props.bad) / total 
  const positive = ((props.good / total)*100).toString() + " %"
  if (total > 0) {
    return (
      <div>
        <h2>Statistics</h2>
        <table>
          <StatisticsLine text="good" value={props.good} />
          <StatisticsLine text="neutral" value={props.neutral} />
          <StatisticsLine text="bad" value={props.bad} />
          <StatisticsLine text="all" value={total} />
          <StatisticsLine text="average" value={average} />
          <StatisticsLine text="positive" value={positive} />
        </table>

      </div>
    )
  } else {
    return (
      <div>
        <h2>Statistics</h2>
        No feedback given
      </div>
    )
  }
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
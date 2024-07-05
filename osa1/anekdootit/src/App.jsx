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

const AnecdoteDisplay = (props) => {
  return (
    <div>
      <p>
        {props.text}
      </p>
      <p>
        has {props.votes} votes
      </p>
    </div>
  )
}


const App = () => {
  const anecdotes = [
    'If it hurts, do it more often.',
    'Adding manpower to a late software project makes it later!',
    'The first 90 percent of the code accounts for the first 90 percent of the development time...The remaining 10 percent of the code accounts for the other 90 percent of the development time.',
    'Any fool can write code that a computer can understand. Good programmers write code that humans can understand.',
    'Premature optimization is the root of all evil.',
    'Debugging is twice as hard as writing the code in the first place. Therefore, if you write the code as cleverly as possible, you are, by definition, not smart enough to debug it.',
    'Programming without an extremely heavy use of console.log is same as if a doctor would refuse to use x-rays or blood tests when dianosing patients.',
    'The only way to go fast, is to go well.'
  ]
   
  const [selected, setSelected] = useState(0)
  const [votes, setVotes] = useState(new Array(anecdotes.length).fill(0))

  const voteCurrentAnecdote = () => {
    let copy = [...votes]
    copy[selected] += 1
    setVotes(copy)
  }

  const mostAnecdoteIndx = getBiggestVotesIndx(votes)

  return (
    <div>
      <Header text="Anecdote of the day" />
      <AnecdoteDisplay text={anecdotes[selected]} votes={votes[selected]} />
      <Button handleClick={() => voteCurrentAnecdote()} text="vote" />
      <Button handleClick={() => setSelected(getRandomInt(anecdotes.length))} text="next anecdote" />
      <Header text="Anecdote with the most votes" />
      <AnecdoteDisplay text={anecdotes[mostAnecdoteIndx]} votes={votes[mostAnecdoteIndx]} />
      
    </div>
  )
}

function getBiggestVotesIndx(arr) {
  let biggest = 0
  let index = 0
  let i = 0
  arr.forEach(v => {
    if (v > biggest) {
      biggest = v
      index = i
    }
    i += 1
  })
  return index
}


function getRandomInt(max) {
  return Math.floor(Math.random() * max);
}

export default App
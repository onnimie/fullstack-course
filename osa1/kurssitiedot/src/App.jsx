const AppOLD = () => {
  const course = 'Half Stack application development'
  const part1 = 'Fundamentals of React'
  const exercises1 = 10
  const part2 = 'Using props to pass data'
  const exercises2 = 7
  const part3 = 'State of a component'
  const exercises3 = 14

  return (
    <div>
      <h1>{course}</h1>
      <p>
        {part1} {exercises1}
      </p>
      <p>
        {part2} {exercises2}
      </p>
      <p>
        {part3} {exercises3}
      </p>
      <p>Number of exercises {exercises1 + exercises2 + exercises3}</p>
    </div>
  )
}

const Header = (props) => {
  return (
    <h1>{props.course}</h1>
  )
}

const Content = (props) => {
  let exercises1 = props.parts[0].exercises
  let exercises2 = props.parts[1].exercises
  let exercises3 = props.parts[2].exercises
  let part1 = props.parts[0].name
  let part2 = props.parts[1].name
  let part3 = props.parts[2].name
  return (
    <div>
      <Part part_name={part1} nof_exercises={exercises1} />
      <Part part_name={part2} nof_exercises={exercises2} />
      <Part part_name={part3} nof_exercises={exercises3} />
    </div>
  )
}

const Part = (props) => {
  return (
    <p>{props.part_name} {props.nof_exercises}</p>
  )
}

const Total = (props) => {
  let ex1 = props.parts[0].exercises
  let ex2 = props.parts[1].exercises
  let ex3 = props.parts[2].exercises
  let sum = ex1+ex2+ex3

  return (
    <p>Number of exercises {sum}</p>
  )
}

const App = () => {
  // const-määrittelyt
  const course = {
    name: 'Half Stack application development',
    parts: [
      {
        name: 'Fundamentals of React',
        exercises: 10
      },
      {
        name: 'Using props to pass data',
        exercises: 7
      },
      {
        name: 'State of a component',
        exercises: 14
      }
    ]
  }

  return (
    <div>
      <Header course={course.name} />
      <Content parts={course.parts} />
      <Total parts={course.parts} />
    </div>
  )
}

export default App
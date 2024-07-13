const Header = (props) => {
  return (
    <h2>{props.course}</h2>
  )
}

const Content = ({parts}) => {
  return (
    <div>
      <ul>
        {parts.map(p => {
          return <Part part_name={p.name} nof_exercises={p.exercises} key={p.id} />
        })}
      </ul>
    </div>
  )
}

const Part = (props) => {
  return (
    <li>{props.part_name} {props.nof_exercises}</li>
  )
}

const Total = ({parts}) => {
  let sum = parts.reduce((prev, curr) => prev + curr.exercises, 0)
  return (
    <p><b>Number of exercises {sum}</b></p>
  )
}

const Course = (props) => {
  let course = props.course
  return (
    <div>
      <Header course={course.name} />
      <Content parts={course.parts} />
      <Total parts={course.parts} />
    </div>
  )
}

const App = () => {
  const courses = [
    {
      name: 'Half Stack application development',
      id: 1,
      parts: [
        {
          name: 'Fundamentals of React',
          exercises: 10,
          id: 1
        },
        {
          name: 'Using props to pass data',
          exercises: 7,
          id: 2
        },
        {
          name: 'State of a component',
          exercises: 14,
          id: 3
        },
        {
          name: 'Redux',
          exercises: 11,
          id: 4
        }
      ]
    }, 
    {
      name: 'Node.js',
      id: 2,
      parts: [
        {
          name: 'Routing',
          exercises: 3,
          id: 1
        },
        {
          name: 'Middlewares',
          exercises: 7,
          id: 2
        }
      ]
    }
  ]

  return (
    <div>
      <h1>Web development curriculum</h1>
      <ul>
        {courses.map(c => 
          <li key={c.id}>
            <Course course={c} />
          </li>
        )}
      </ul>
    </div>
  )
}


export default App
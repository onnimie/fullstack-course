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

export default Course
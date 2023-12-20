const Header = (props) => {
    return <h2>{props.course.name}</h2>
  }
  
  const Total = (props) => {
    const parts = props.course.parts
    const exercises = parts.map(part => part.exercises)
    const total = exercises.reduce( (s, p) => s+p)
    return (
    <b>total of {total} exercises</b>
    )
  }
  
  const Part = (props) => {
    const parts = props.course.parts
  
    return (
      <div>
        {parts.map(part => <div key={part.id}>{part.name} {part.exercises}</div>)}
      </div>
    )
  }
  
  const Content = (props) => {
    return (
      <div>
        <Part course={props.course} />
      </div>
    )
  }
  
  const Course = (props) => {
    return (
      <div>
        <Header course={props.course} />
        <Content course={props.course} />
        <Total course={props.course} />
      </div>
    )
  }

  export default Course
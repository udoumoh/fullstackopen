import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

const Header = (props) => (
  <h1>{props.course.name}</h1>
)

const Part = (props) => (<p>{props.name} {props.exercises}</p>)

const Content = (props) => (
  <div>
    {props.parts.map(x => <Part name={x.name} exercises={x.exercises} />)}
  </div>
)

const Total = (props) => (
  <div>
    <p>Number of exercises {props.parts.map(a => a.exercises).reduce((x, y) => x + y)} </p>
  </div>

)

const App = () => {
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
      <Header course={course} />
      <Content parts={course.parts} />
      <Total parts={course.parts} />
    </div>
  )
}

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);
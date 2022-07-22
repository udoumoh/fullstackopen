import React from 'react'
const Courses = [
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

const Header = (props) => {
    return (
        <>
            <h1>{props.name}</h1>
        </>
    )
}
const Parts = (props) => {
    return (
        <>{props.part}</>
    )
}
const Total = (props) => {
    return (
        <strong>Total of {props.total} exercises</strong>
    )
}
const Comp = (props) => {
    return (
        <>
            <Header name={props.name} />
            <Parts part={props.part} />
            <Total total={props.total} />
        </>
    )
}
const Course = () => {
    return(
        <>
        {Courses.map(course =>
        <Comp
        key = {course.id}
        name = {course.name }
        part = {course.parts.map(part => <p key={part.id}>{part.name} {part.exercises}</p>) }
        total = {course.parts.reduce((a, b) => a + b.exercises, 0) }
        />
        )}
        </>
    )
}

export default Course
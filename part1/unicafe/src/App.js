import { useState } from 'react'

const Button = ({click,text}) => {
  return(
      <button onClick={click}>{text}</button>
  )
}
const StatisticLine = ({text,stat}) => {  
  return(
    <>
    <tr>
      <td>{text} {stat}</td>
    </tr>
    </>
  )
}

const App = () => {
  // save clicks of each button to its own state
  const [good, setGood] = useState(0)
  const [neutral, setNeutral] = useState(0)
  const [bad, setBad] = useState(0)

  const incrementGood = () => { setGood(good + 1) }
  const incrementNeutral = () => {setNeutral(neutral + 1)}
  const incrementBad = () => { setBad(bad + 1) }
  const total = good+bad+neutral;

  if(good+bad+neutral === 0){
    return(
      <div>
        <h1>Give feedback</h1>
        <Button click={incrementGood} text="Good" />
        <Button click={incrementNeutral} text="Neutral" />
        <Button click={incrementBad} text="Bad" />
        <h1>Statistics</h1>
        <h3>No feedback given</h3>
        </div>
    )
  }
  
  return (
    <div>
      <h1>Give feedback</h1>
      <Button click={incrementGood} text = "Good"/>
      <Button click={incrementNeutral} text="Neutral" />
      <Button click={incrementBad} text="Bad" />
      <h1>Statistics</h1>
      <table>
        <tbody>
      <StatisticLine  text = "good" stat = {good} />
      <StatisticLine text="neutral" stat={neutral} />
      <StatisticLine text="bad" stat={bad} />
      <StatisticLine text="all" stat={total} />
      <StatisticLine text="average" stat={((good * 1)+(neutral * 0)+(bad * -1))/total} />
      <StatisticLine text="positive" stat={`${(good / total) * 100}%`} />
        </tbody>
      </table>
    </div>
  )
}

export default App
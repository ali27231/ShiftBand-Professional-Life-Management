import { useContext } from 'react'
import { ExerciseContext } from '../context/ExerciseContext'

const Exercise = () => {
  const { exercises, dispatch } = useContext(ExerciseContext)

  return (
    <div className="exercise">
      {exercises && exercises.map((exercise) => (
        <div className="exercise-details" key={exercise._id}>
          <h4>{exercise.title}</h4>
          <p><strong>Load (kg): </strong>{exercise.load}</p>
          <p><strong>Reps: </strong>{exercise.reps}</p>
          <p>{exercise.createdAt}</p>
          <span onClick={() => dispatch({type: 'DELETE_EXERCISE', payload: exercise._id})}>delete</span>
        </div>
      ))}
    </div>
  )
}

export default Exercise;
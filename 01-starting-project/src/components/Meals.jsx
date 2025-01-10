import MealItem from './MealItem.jsx';
import useHttp from '../util/useHttp.js';
import ErrorMessage from './UI/Error.jsx';

const requestConfig = {};

export default function Meals() {


  const { 
     data: loadedMeals,
     isLoading,
     error

  } = useHttp('http://localhost:3000/meals', requestConfig, [] );


  if (isLoading) {
    return <p className="center">Loading...</p>
  }

  if (error) {
    return <ErrorMessage title="Failed to load meals" message={error} />
  }

  return (
    <ul id="meals">
      {loadedMeals.map((meal) => (
        <MealItem key={meal.id} meal={meal} />
      ))}
    </ul>
  );
}
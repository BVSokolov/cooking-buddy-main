import {Route, Routes, useNavigate} from 'react-router-dom'
import {Recipes} from './Recipes/Recipes'
import {Button} from './UI/Button'

const HomeComponent = () => {
  const navigate = useNavigate()

  const goToRecipes = () => {
    navigate('/recipes')
  }

  return (
    <div>
      <Button onClick={(e) => goToRecipes()}>Recipes</Button>
    </div>
  )
}

export const Home = () => (
  <Routes>
    <Route path="/" element={<HomeComponent />} />
    <Route path="/recipes/*" element={<Recipes />} />
  </Routes>
)

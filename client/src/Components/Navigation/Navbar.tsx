import {useEffect, useState} from 'react'
import {Link, useLocation} from 'react-router-dom'
import {api} from '../../api/api'
import {Recipe} from '../../common/types'
import {Card} from '../UI/Card'

export const Navbar = () => {
  //TODO: use react-query instead
  const [recipes, setRecipes] = useState<Array<Recipe>>([])
  useEffect(() => {
    const getRecipes = async () => {
      const res = await api.recipes.getRecipes()
      if (res.status === 200) {
        setRecipes(res.data)
      }
    }
    getRecipes()
  }, [])

  // const {
  //   id,
  //   name,
  //   content: { ingredients, instructions },
  // } = recipes[Number(index)];

  const location = useLocation()
  const paths = location.pathname.split('/').filter((word) => word !== '')

  return (
    <Card>
      <nav>
        <Link to="/">Home</Link>
        {paths.map((path, i) => (
          <span>
            {paths.length > i ?? <span>/</span>}
            {path === 'recipes' ? (
              <Link to={`/${paths.slice(0, i + 1).join('/')}`}>Recipes</Link>
            ) : path === 'new' ? (
              <Link to="/recipes/new">New recipe</Link>
            ) : (
              <Link to={`/recipes/${path}`}>{recipes[Number(path)].name}</Link>
            )}
          </span>
        ))}
      </nav>
    </Card>
  )
}

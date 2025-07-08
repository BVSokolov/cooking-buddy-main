import React, {useEffect, useState} from 'react'
import {Route, Routes, useNavigate} from 'react-router-dom'
import {api} from '../../api/api'
import {Recipe} from '../../common/types'
import {RecipePage} from './RecipePage'
import {Page} from '../UI/Page'
import {Button} from '../UI/Button'
import {NewRecipePage} from './NewRecipePage'
import styled from 'styled-components'

const VerticalPage = styled(Page)`
  flex-direction: column;
`

const RecipesPage = () => {
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

  const navigate = useNavigate()
  const goToRecipes = (e: React.MouseEvent<HTMLElement>, index: number) => {
    e.preventDefault()
    navigate(`${index}`)
  }

  const onNewRecipeClick = (e: React.MouseEvent<HTMLElement>) => {
    e.preventDefault()
    navigate('new')
  }

  return (
    <VerticalPage>
      <h2>Recipes</h2>
      <Button onClick={onNewRecipeClick}>New recipe</Button>
      <div>
        {recipes.map((recipe, index) => (
          <Button key={recipe.id} onClick={(e) => goToRecipes(e, index)}>
            {recipe.name}
          </Button>
        ))}
      </div>
    </VerticalPage>
  )
}

export const Recipes = () => {
  return (
    <Routes>
      <Route path="/" element={<RecipesPage />} />
      <Route path="/new" element={<NewRecipePage />} />
      <Route path="/:index" element={<RecipePage />} />
    </Routes>
  )
}

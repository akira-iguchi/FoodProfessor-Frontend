import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'

import { fetchProfileData } from 'lib/apis/users/profile'

import { Recipe } from 'types/recipe'
import { Ingredient } from 'types/ingredient'

import RecipeCards from 'components/recipes/card'

const Profile: React.FC<any> = ({ match }) => {
  const [recentRecipes, setRecentRecipes] = useState<Recipe[] | null>()
  const [fastestRecipes, setFastestRecipes] = useState<Recipe[] | null>()
  const [ingredients, setIngredients] = useState<Ingredient[] | null>()

  console.log(match.params.userId)

  // APIに接続してデータ取得
  useEffect(() => {
    fetchProfileData(match.params.userId)
  })

  return <>aaaaaaaaaaaaaaaaa</>
}

export default Profile

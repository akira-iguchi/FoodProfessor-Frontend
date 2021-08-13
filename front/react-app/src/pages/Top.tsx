import React, { useState, useEffect, useContext } from 'react'

import { AuthContext } from 'App'
import { fetchTopData } from 'lib/apis/top'

import { Recipe } from 'types/recipe'
import { Ingredient } from 'types/ingredient'

import RecipeCards from 'components/recipes/card'

// とりあえず認証済みユーザーの名前やメールアドレスを表示
const Top: React.FC = () => {
  const { isLoggedIn, currentUser } = useContext(AuthContext)
  const [recentRecipes, setRecentRecipes] = useState<any>()
  const [fastestRecipes, setFastestRecipes] = useState<Recipe | undefined>()
  const [ingredients, setIngredients] = useState<Ingredient | undefined>()

  useEffect(() => {
    fetchTopData().then((data) => {
      setRecentRecipes(data.recentRecipes)
      setFastestRecipes(data.fastestRecipes)
      setIngredients(data.ingredients)
    })
  }, [])

  return (
    <>
      <p className="w-44 mb-4 py-2 text-center bg-darkRed rounded-full">
        <span className="font-bold text-orange">最近追加したレシピ</span>
      </p>

      <div className="grid grid-cols-5 maxXl:grid-cols-4 maxMd:grid-cols-3 maxSm:grid-cols-2 gap-4">
        {recentRecipes ? (
          recentRecipes.map((recipe: Recipe) => (
            <RecipeCards
              key={recipe.id}
              id={recipe.id}
              recipeName={recipe.recipeName}
              recipeImage={recipe.recipeImage}
              recipeTime={recipe.recipeTime}
              userId={recipe.userId}
              folderId={recipe.folderId}
            />
          ))
        ) : (
          <></>
        )}
      </div>
    </>
  )
}

export default Top

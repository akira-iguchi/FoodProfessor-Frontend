import { Link } from 'react-router-dom'

import { Recipe } from 'types/recipe'

import defaultRecipeImage from 'images/defaultRecipe.png'

const RecipeCard: React.FC<Recipe> = (props: Recipe) => {
  return (
    <>
      <div>
        {props.recipeImage ? (
          <img
            // レシピ画像が存在しないならデフォルト画像表示
            src={props.recipeImage.url ? props.recipeImage.url : defaultRecipeImage}
            className="w-full max-h-60 mb-2 cursor-pointer border-2 border-orange"
            alt="recipeImage"
          />
        ) : (
          <></>
        )}
      </div>
      <p className="text-2xl font-w6 text-center">{props.recipeName}</p>
    </>
  )
}

export default RecipeCard

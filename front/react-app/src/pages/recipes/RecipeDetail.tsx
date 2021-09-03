import React, { useState, useEffect, useContext } from 'react'
import { Link, useHistory } from 'react-router-dom'

import { fetchRecipeData } from 'lib/apis/recipes/recipeDetail'
import { favoriteRecipeData } from 'lib/apis/favorites/favorite'
import { unFavoriteRecipeData } from 'lib/apis/favorites/unfavorite'

import { AuthContext } from 'App'

import { User } from 'types/user'
import { Recipe } from 'types/recipe'
import { Ingredient } from 'types/ingredient'
import { Procedure } from 'types/procedure'
import { Category } from 'types/category'
import { Comment } from 'types/comment'

import { DefaultIconUrl } from 'images/defaultIcon'

import { DefaultRecipeImageUrl } from 'images/defaultRecipeImage'

import RecipeComments from 'components/comments/RecipeComments'
// お気に入りボタンの切り替えができないため直書きで対応
// import FavoriteButton from 'components/favorites/FavoriteButton'

const RecipeDetail: React.FC<any> = ({ match }) => {
  const { currentUser, isLoggedIn } = useContext(AuthContext)

  const [recipe, setRecipe] = useState<Recipe | null>()
  const [user, setUser] = useState<User | null>()
  const [ingredients, setIngredients] = useState<Ingredient[] | null>([])
  const [procedures, setProcedures] = useState<Procedure[] | null>([])
  const [categories, setCategories] = useState<Category[] | null>([])
  const [comments, setComments] = useState<Comment[] | null>([])
  const [commentUsers, setCommentUsers] = useState<User[] | null>([])
  const [favoriteUsers, setFavoriteUsers] = useState<User[] | null>([])
  const [isFavorite, setIsFavorite] = useState<boolean | null>()

  const [isDisabled, setIsDisabled] = useState<boolean>(false)

  const history = useHistory()

  // APIに接続してデータ取得
  useEffect(() => {
    fetchRecipeData(match.params.recipeId).then((data) => {
      setRecipe(data.recipe)
      setUser(data.user)
      setIngredients(data.ingredients)
      setProcedures(data.procedures)
      setCategories(data.categories)
      setComments(data.comments)
      setCommentUsers(data.commentUsers)
      setFavoriteUsers(data.favoriteUsers)
      setIsFavorite(data.isFavorite)
      const favoriteHeart = document.getElementById('redHeart')
      const unFavoriteHeart = document.getElementById('blackHeart')
      if (isFavorite) {
        unFavoriteHeart?.classList.add('hidden')
      } else {
        favoriteHeart?.classList.add('hidden')
      }
    })
  }, [])

  const changeIsFavorite = (e: React.MouseEvent<HTMLButtonElement>): void => {
    e.preventDefault()
    setIsDisabled(true)
    if (isFavorite) {
      unFavorite()
    } else {
      favorite()
    }
  }

  // FormData形式でデータを作成
  const createFormData = (): FormData => {
    const formData = new FormData()

    formData.append('recipeId', String(recipe?.id))
    formData.append('currentUserId', String(currentUser?.id))

    return formData
  }

  const favorite = async () => {
    if (isLoggedIn) {
      const params = createFormData()

      try {
        const res = await favoriteRecipeData(params)

        if (res.status === 200) {
          setIsFavorite(true)
          const favoriteHeart = document.getElementById('redHeart')
          const unFavoriteHeart = document.getElementById('blackHeart')
          favoriteHeart?.classList.remove('hidden')
          unFavoriteHeart?.classList.add('hidden')
        }
      } catch (err) {
        console.log(err)
      }
    } else {
      history.push('/login')
    }
    setIsDisabled(false)
  }

  const unFavorite = async () => {
    if (isLoggedIn) {
      try {
        const res = await unFavoriteRecipeData(recipe?.id, currentUser?.id)

        if (res.status === 200) {
          setIsFavorite(false)
          const favoriteHeart = document.getElementById('redHeart')
          const unFavoriteHeart = document.getElementById('blackHeart')
          favoriteHeart?.classList.add('hidden')
          unFavoriteHeart?.classList.remove('hidden')
        }
      } catch (err) {
        console.log(err)
      }
    } else {
      history.push('/login')
    }
    setIsDisabled(false)
  }

  return (
    <>
      {recipe ? (
        <div>
          <div className="grid grid-cols-2 maxMd:grid-cols-1 gap-4">
            <div>
              <p className="mb-6 text-darkRed text-4xl font-semibold">{recipe?.recipeName}</p>
              <div className="flex">
                <span className="mr-4 text-white bg-darkRed px-2 py-1">
                  <i className="fas fa-heart mr-3"></i>
                  {favoriteUsers?.length}
                </span>
                <span className="mr-4 text-white bg-darkRed px-2 py-1">
                  <i className="fa fa-comment mr-3"></i>
                  {comments?.length}
                </span>
                {user?.profileImage ? (
                  <Link to={`/users/${user.id}`} className="mr-auto">
                    <img
                      // レシピ画像が存在しないならデフォルト画像表示
                      src={user?.profileImage.url ? user.profileImage.url : DefaultIconUrl}
                      className="w-16 h-16 mr-auto maxSm:mx-auto rounded-full"
                      alt="profileImage"
                    />
                  </Link>
                ) : (
                  <></>
                )}
              </div>
              <div>
                {recipe?.recipeImage ? (
                  <img
                    // レシピ画像が存在しないならデフォルト画像表示
                    src={recipe?.recipeImage.url ? recipe?.recipeImage.url : DefaultRecipeImageUrl}
                    className="max-w-md my-6 border-2 border-orange hover:no-underline maxLg:max-w-xs"
                    alt="recipeImage"
                  />
                ) : (
                  <></>
                )}
              </div>
              {isFavorite !== undefined ? (
                <div>
                  <button id="redHeart" className="relative bottom-4" onClick={changeIsFavorite} disabled={isDisabled}>
                    <i className="fas fa-heart text-red"></i>
                  </button>
                  <button
                    id="blackHeart"
                    className="relative bottom-4"
                    onClick={changeIsFavorite}
                    disabled={isDisabled}
                  >
                    <i className="fas fa-heart"></i>
                  </button>
                </div>
              ) : (
                <></>
              )}
            </div>

            <div className="max-w-xl mb-6">
              <p className="w-20 mb-4 py-2 text-center bg-darkRed rounded-full">
                <span className="font-bold text-orange">材料</span>
              </p>
              <hr className="text-brown my-4" />
              {ingredients ? (
                ingredients.map((ingredient: Ingredient, index: number) => (
                  <div key={index}>
                    {ingredient.ingredientName} <span className="float-right">{ingredient.quantity}</span>
                    <hr className="text-brown my-4" />
                  </div>
                ))
              ) : (
                <></>
              )}
            </div>
          </div>
          <p className="w-32 mb-4 py-2 text-center bg-darkRed rounded-full">
            <span className="font-bold text-orange">作り方</span>
          </p>
          {procedures ? (
            procedures.map((procedure: Procedure, index: number) => (
              <div key={index}>
                <div className="flex">
                  <span className="font-medium text-xl w-10">{index} , </span>
                  <span className="font-normal ml-4 text-md">{procedure.procedureContent}</span>
                </div>
                <hr className="text-brown my-4" />
              </div>
            ))
          ) : (
            <></>
          )}
          <p className="w-32 mt-8 py-2 text-center bg-darkRed rounded-full">
            <span className="font-bold text-orange">カテゴリ</span>
          </p>
          <div>
            {categories ? (
              categories.map((category: Category, index: number) => (
                <div className="inline-block mt-6" key={index}>
                  <Link
                    to={`/categories/${category.categoryName}/recipes`}
                    className="whitespace-nowrap mr-4 px-4 py-2 font-bold text-darkRed text-center bg-white rounded-full border-2 border-darkRed hover:bg-darkRed hover:text-white"
                  >
                    {category.categoryName}
                  </Link>
                </div>
              ))
            ) : (
              <></>
            )}
          </div>
          <p className="w-32 mt-8 mb-2 py-2 text-center bg-darkRed rounded-full">
            <span className="font-bold text-orange">コメント</span>
          </p>
          {comments !== [] ? (
            <RecipeComments recipeId={recipe?.id} comments={comments} commentUsers={commentUsers} />
          ) : (
            <></>
          )}
        </div>
      ) : (
        <></>
      )}
    </>
  )
}

export default RecipeDetail

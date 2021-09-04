import React, { useState, useContext, useEffect } from 'react'
import { useHistory } from 'react-router-dom'

import { AuthContext } from 'App'

import { Recipe } from 'types/recipe'

import { fetchEditRecipeData } from 'lib/apis/recipes/editRecipe'
import { updateRecipeData } from 'lib/apis/recipes/editRecipe'

import AlertMessage from 'components/commons/AlertMessage'
import RecipeForm from 'components/recipes/form'

export type ingredientTypes = {
  // キャメルケースに変換できないためスネークケースに
  ingredient_name: string | null | undefined
  quantity: string | null | undefined
}

export type procedureTypes = {
  // キャメルケースに変換できないためスネークケースに
  procedure_content: string | null | undefined
}

const EditRecipe: React.FC<any> = ({ match }) => {
  const history = useHistory()

  const { currentUser, isLoggedIn } = useContext(AuthContext)

  const [alertMessageOpen, setAlertMessageOpen] = useState<boolean>(false)
  const [errorMessages, setErrorMessages] = useState<string[]>()

  const [recipe, setRecipe] = useState<Recipe | null>()

  const [recipeName, setRecipeName] = useState<string>('')
  const [recipeTime, setRecipeTime] = useState<any>(0)
  const [recipeImage, setRecipeImage] = useState<File>()

  const [ingredientParams, setIngredientParams] = useState<ingredientTypes[]>([{ ingredient_name: '', quantity: '' }])

  const [categories, setCategories] = useState<string[]>(['朝食'])

  const [procedureParams, setProcedureParams] = useState<procedureTypes[]>([{ procedure_content: '' }])

  // APIに接続してデータ取得
  useEffect(() => {
    fetchEditRecipeData(match.params.recipeId).then((data) => {
      setRecipe(data.recipe)
      setRecipeName(data.recipe.recipeName)
      setRecipeTime(data.recipe.recipeTime)
      setIngredientParams(data.ingredients)
      setCategories(data.categories)
      setProcedureParams(data.procedures)
      if (!isLoggedIn || data.recipe.userId !== currentUser?.id) {
        history.push('/top')
      }
    })
  }, [])

  // FormData形式でデータを作成
  const createFormData = (): FormData => {
    const formData = new FormData()

    if (currentUser) formData.append('currentUserId', String(currentUser?.id))

    formData.append('recipeName', recipeName)
    formData.append('recipeTime', recipeTime)
    if (recipeImage) formData.append('recipeImage', recipeImage)

    formData.append('ingredientParams', JSON.stringify(ingredientParams))

    formData.append('categories', JSON.stringify(categories))

    formData.append('procedureParams', JSON.stringify(procedureParams))

    return formData
  }

  const updateRecipe = async () => {
    if (isLoggedIn) {
      const params = createFormData()

      try {
        const res = await updateRecipeData(recipe?.id, params)

        console.log(res)

        if (res.status === 201) {
          // history.push(`/recipes/${params.id}`)
          history.push('/top')
        }
      } catch (err) {
        console.log(err.response.data)
        setAlertMessageOpen(true)
        // 「バリデーションに失敗しました:」という文字を削り、「, 」で分ける
        const newErrorMessages = err.response.data[0].slice(16).split(', ')
        setErrorMessages(newErrorMessages)
      }
    } else {
      history.push('/login')
    }
  }

  return (
    <>
      <AlertMessage // エラーが発生した場合はアラートを表示
        open={alertMessageOpen}
        message="レシピを更新できませんでした。"
      />
      {errorMessages ? (
        <div className="bg-errorBgColor mx-auto mb-6 px-4 pt-2 max-w-2xl border border-errorBorderColor text-errorTextColor">
          {errorMessages?.map((error: string, index: number) => (
            <div key={index}>
              {error.includes('。') ? (
                <p className="flex mb-2">
                  <span>・</span>
                  {error}
                </p>
              ) : (
                <p className="flex mb-2">
                  <span>・</span>
                  {error}。
                </p>
              )}
            </div>
          ))}
        </div>
      ) : (
        <></>
      )}
      <RecipeForm
        setRecipeName={setRecipeName}
        setRecipeTime={setRecipeTime}
        setRecipeImage={setRecipeImage}
        ingredientParams={ingredientParams}
        setIngredientParams={setIngredientParams}
        categories={categories}
        setCategories={setCategories}
        procedureParams={procedureParams}
        setProcedureParams={setProcedureParams}
        createRecipe={updateRecipe}
      />
    </>
  )
}

export default EditRecipe

import React, { useState, useContext } from 'react'
import { useHistory } from 'react-router-dom'

import { AuthContext } from 'App'

import { createRecipeData } from 'lib/apis/recipes/createRecipe'

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

const CreateRecipe: React.FC = () => {
  const history = useHistory()

  const { currentUser, isLoggedIn } = useContext(AuthContext)

  const [alertMessageOpen, setAlertMessageOpen] = useState<boolean>(false)
  const [errorMessages, setErrorMessages] = useState<string[]>()

  const [recipeName, setRecipeName] = useState<string>('')
  const [recipeTime, setRecipeTime] = useState<any>(0)
  const [recipeImage, setRecipeImage] = useState<File>()

  const [ingredientParams, setIngredientParams] = useState<ingredientTypes[]>([{ ingredient_name: '', quantity: '' }])

  const [categories, setCategories] = useState<string[]>(['朝食'])

  const [procedureParams, setProcedureParams] = useState<procedureTypes[]>([{ procedure_content: '' }])

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

  const createRecipe = async () => {
    if (isLoggedIn) {
      const params = createFormData()

      try {
        const res = await createRecipeData(params)

        if (res.status === 201) {
          history.push(`/recipes/${res.data.recipe.id}`)
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
        message="レシピを投稿できませんでした。"
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
        createRecipe={createRecipe}
      />
    </>
  )
}

export default CreateRecipe

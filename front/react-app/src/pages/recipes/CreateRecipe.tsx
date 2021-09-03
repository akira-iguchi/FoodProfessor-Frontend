import React, { useState, useContext } from 'react'
import { useHistory } from 'react-router-dom'

import { AuthContext } from 'App'

import { createRecipeData } from 'lib/apis/recipes/createRecipe'

import AlertMessage from 'components/commons/AlertMessage'
import RecipeForm from 'components/recipes/form'

export type createRecipeErrorMessageTypes = {
  recipeName: string[]
  recipeTime: string[]
  recipeImage: string[]
}

export type createIngredientErrorMessageTypes = {
  ingredientName: string[]
  quantity: string[]
}

export type createProcedureErrorMessageTypes = {
  procedureContent: string[]
}

export type ingredientTypes = {
  ingredientName: string | null | undefined
  quantity: string | null | undefined
}

const CreateRecipe: React.FC = () => {
  const history = useHistory()

  const { currentUser, isLoggedIn } = useContext(AuthContext)

  const [alertMessageOpen, setAlertMessageOpen] = useState<boolean>(false)
  const [recipeErrorMessages, setRecipeErrorMessages] = useState<createRecipeErrorMessageTypes | undefined>()
  const [ingredientErrorMessages, setIngredientErrorMessages] = useState<
    createIngredientErrorMessageTypes | undefined
  >()
  const [procedureErrorMessages, setProcedureErrorMessages] = useState<createProcedureErrorMessageTypes | undefined>()

  const [recipeName, setRecipeName] = useState<string>('')
  const [recipeTime, setRecipeTime] = useState<any>(0)
  const [recipeImage, setRecipeImage] = useState<File>()

  const [ingredientColumns, setIngredientColumns] = useState<ingredientTypes[]>([{ ingredientName: '', quantity: '' }])

  const [procedureContent, setProcedureContent] = useState<string>('')

  // FormData形式でデータを作成
  const createFormData = (): FormData => {
    const formData = new FormData()

    console.log(ingredientColumns)

    if (currentUser) formData.append('currentUserId', String(currentUser?.id))

    formData.append('recipeName', recipeName)
    formData.append('recipeTime', recipeTime)
    if (recipeImage) formData.append('recipeImage', recipeImage)

    // formData.append('ingredientColumns', ingredientColumns)

    formData.append('procedureContent', procedureContent)

    return formData
  }

  const createRecipe = async () => {
    if (isLoggedIn) {
      const params = createFormData()

      try {
        const res = await createRecipeData(params)

        console.log(res)

        if (res.status === 201) {
          // history.push(`/recipes/${params.id}`)
          history.push('/top')
        }
      } catch (err) {
        console.log(err.response.data)
        setAlertMessageOpen(true)
        setRecipeErrorMessages(err.response.data[0])
        setIngredientErrorMessages(err.response.data[1])
        setProcedureErrorMessages(err.response.data[2])
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
      <RecipeForm
        setRecipeName={setRecipeName}
        setRecipeTime={setRecipeTime}
        setRecipeImage={setRecipeImage}
        ingredientColumns={ingredientColumns}
        setIngredientColumns={setIngredientColumns}
        setProcedureContent={setProcedureContent}
        createRecipe={createRecipe}
        recipeErrorMessages={recipeErrorMessages}
        ingredientErrorMessages={ingredientErrorMessages}
        procedureErrorMessages={procedureErrorMessages}
      />
    </>
  )
}

export default CreateRecipe

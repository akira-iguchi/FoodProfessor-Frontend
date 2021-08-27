import React, { useState, useContext, useCallback } from 'react'
import { Redirect, useHistory } from 'react-router-dom'

import { AuthContext } from 'App'

import { createRecipeData } from 'lib/apis/recipes/createRecipe'

import AlertMessage from 'components/commons/AlertMessage'
import RecipeForm from 'components/recipes/form'

export type errorMessageTypes = {
  recipeName: string[]
  recipeTime: string[]
  recipeImage: string[]
  ingredientName: string[]
  quantity: string[]
  procedureContent: string[]
  order: string[]
  procedureImage: string[]
}

const CreateRecipe: React.FC = () => {
  const history = useHistory()

  const { currentUser, isLoggedIn, setIsLoggedIn } = useContext(AuthContext)

  const [alertMessageOpen, setAlertMessageOpen] = useState<boolean>(false)

  const [recipeName, setRecipeName] = useState<string>('')
  const [recipeTime, setRecipeTime] = useState<any>(0)
  const [recipeImage, setRecipeImage] = useState<File>()

  const [ingredientName, setIngredientName] = useState<string>('')
  const [quantity, setQuantity] = useState<any>(0)

  const [procedureContent, setProcedureContent] = useState<string>('')
  const [order, setOrder] = useState<any>(0)
  const [procedureImage, setProcedureImage] = useState<File>()

  const [errorMessages, setErrorMessages] = useState<errorMessageTypes | undefined>()

  const handleCloseAlertMessage = (): void => setAlertMessageOpen(false)

  // FormData形式でデータを作成
  const createFormData = (): FormData => {
    const formData = new FormData()

    if (currentUser) formData.append('currentUserId', String(currentUser?.id))

    formData.append('recipeName', recipeName)
    formData.append('recipeTime', recipeTime)
    if (recipeImage) formData.append('recipeImage', recipeImage)

    formData.append('ingredientName', ingredientName)
    formData.append('quantity', quantity)

    formData.append('procedureContent', procedureContent)
    formData.append('order', order)
    if (procedureImage) formData.append('procedureImage', procedureImage)

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
        setAlertMessageOpen(true)
        console.log(err.response.data)
        setErrorMessages(err.response.data)
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
        handleCloseAlertMessage={handleCloseAlertMessage}
      />
      <RecipeForm
        recipeName={recipeName}
        setRecipeName={setRecipeName}
        setRecipeTime={setRecipeTime}
        setRecipeImage={setRecipeImage}
        setIngredientName={setIngredientName}
        setQuantity={setQuantity}
        setProcedureContent={setProcedureContent}
        setOrder={setOrder}
        setProcedureImage={setProcedureImage}
        createRecipe={createRecipe}
        errorMessages={errorMessages}
      />
    </>
  )
}

export default CreateRecipe

import React, { useState, useCallback } from 'react'

import TextField from '@material-ui/core/TextField'
import Card from '@material-ui/core/Card'
import CardContent from '@material-ui/core/CardContent'
import CardHeader from '@material-ui/core/CardHeader'

import { errorMessageTypes } from 'pages/recipes/CreateRecipe'

type RecipeParamProps = {
  recipeName: string
  setRecipeName: (e: string) => void
  setRecipeTime: (e: number) => void
  setRecipeImage: (e: File) => void
  setIngredientName: (e: string) => void
  setQuantity: (e: number) => void
  setProcedureContent: (e: string) => void
  setOrder: (e: number) => void
  setProcedureImage: (e: File) => void
  createRecipe: () => void
  errorMessages: errorMessageTypes | undefined
}

const RecipeForm: React.FC<RecipeParamProps> = ({
  recipeName,
  setRecipeName,
  setRecipeTime,
  setRecipeImage,
  setIngredientName,
  setQuantity,
  setProcedureContent,
  setOrder,
  setProcedureImage,
  createRecipe,
  errorMessages,
}) => {
  const [recipeNameBlackErrorMessage, setRecipeNameBlackErrorMessage] = useState<string>('')

  const uploadRecipeImage = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.currentTarget.files) {
      const file: File = e.currentTarget.files[0]
      setRecipeImage(file)
    }
  }, [])

  const uploadProcedureImage = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.currentTarget.files) {
      const file: File = e.currentTarget.files[0]
      setProcedureImage(file)
    }
  }, [])

  const sendRecipeData = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()
    window.scrollTo(0, 0)
    if (recipeName === '') {
      setRecipeNameBlackErrorMessage('まずはレシピ名を入力してください')
      return
    } else {
      setRecipeNameBlackErrorMessage('')
    }
    createRecipe()
  }

  return (
    <form noValidate autoComplete="off">
      <Card className="px-14 maxSm:px-4 py-2 max-w-xl text-center mx-auto">
        <CardHeader title="レシピ作成" />
        <CardContent>
          <TextField
            variant="outlined"
            required
            label="レシピ名"
            margin="dense"
            className="mr-2 mb-4"
            onChange={(event) => setRecipeName(event.target.value)}
          />
          <p className="text-red text-sm">{recipeNameBlackErrorMessage}</p>
          {errorMessages?.recipeName ? (
            errorMessages.recipeName.map((error: string, index: number) => (
              <p className="text-red text-sm" key={index}>
                レシピ名{error}
              </p>
            ))
          ) : (
            <></>
          )}
          <TextField
            variant="outlined"
            label="調理時間"
            type="number"
            required
            defaultValue={0}
            inputProps={{ min: 0 }}
            margin="dense"
            onChange={(event) => setRecipeTime(Number(event.target.value))}
          />
          {errorMessages?.recipeTime ? (
            errorMessages.recipeTime.map((error: string, index: number) => (
              <p className="text-red text-sm" key={index}>
                レシピ名{error}
              </p>
            ))
          ) : (
            <></>
          )}
          <br />
          <label htmlFor="recipeImage" className="float-left mt-2 cursor-pointer">
            画像
          </label>
          <input
            accept="image/*,.png,.jpg,.jpeg,.gif"
            id="recipeImage"
            type="file"
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
              uploadRecipeImage(e)
            }}
          />
          {errorMessages?.recipeImage ? (
            errorMessages.recipeImage.map((error: string, index: number) => (
              <p className="text-red text-sm" key={index}>
                レシピ名{error}
              </p>
            ))
          ) : (
            <></>
          )}
          <br />

          <TextField
            variant="outlined"
            required
            fullWidth
            label="材料名"
            margin="dense"
            className="mb-4"
            onChange={(event) => setIngredientName(event.target.value)}
          />
          <TextField
            variant="outlined"
            type="number"
            required
            fullWidth
            label="量"
            defaultValue={0}
            inputProps={{ min: 0 }}
            margin="dense"
            onChange={(event) => setQuantity(Number(event.target.value))}
          />

          <TextField
            variant="outlined"
            type="number"
            required
            fullWidth
            label="手順"
            defaultValue={0}
            inputProps={{ min: 0 }}
            margin="dense"
            onChange={(event) => setOrder(Number(event.target.value))}
          />
          <TextField
            variant="outlined"
            multiline
            rows={4}
            required
            fullWidth
            label="内容"
            margin="dense"
            onChange={(event) => setProcedureContent(event.target.value)}
          />
          <label htmlFor="procedureImage" className="float-left mt-2 cursor-pointer">
            画像
          </label>
          <input
            accept="image/*,.png,.jpg,.jpeg,.gif"
            id="procedureImage"
            type="file"
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
              uploadProcedureImage(e)
            }}
          />
          <br />

          <button
            type="submit"
            className="mt-8 mb-4 px-10 py-2 rounded-full bg-lightGreen text-white"
            onClick={(e) => sendRecipeData(e)}
          >
            投稿
          </button>
        </CardContent>
      </Card>
    </form>
  )
}

export default RecipeForm

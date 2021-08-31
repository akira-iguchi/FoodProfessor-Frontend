import React, { useState, useCallback } from 'react'

import Card from '@material-ui/core/Card'
import CardContent from '@material-ui/core/CardContent'
import TextField from '@material-ui/core/TextField'

import { ingredientTypes } from 'pages/recipes/CreateRecipe'

import { createRecipeErrorMessageTypes } from 'pages/recipes/CreateRecipe'
import { createIngredientErrorMessageTypes } from 'pages/recipes/CreateRecipe'
import { createProcedureErrorMessageTypes } from 'pages/recipes/CreateRecipe'

type RecipeParamProps = {
  setRecipeName: (e: string) => void
  setRecipeTime: (e: number) => void
  setRecipeImage: (e: File) => void
  ingredientColumns: ingredientTypes[]
  setIngredientColumns: (e: ingredientTypes[]) => void
  setProcedureContent: (e: string) => void
  setOrder: (e: number) => void
  createRecipe: () => void
  recipeErrorMessages: createRecipeErrorMessageTypes | undefined
  ingredientErrorMessages: createIngredientErrorMessageTypes | undefined
  procedureErrorMessages: createProcedureErrorMessageTypes | undefined
}

const RecipeForm: React.FC<RecipeParamProps> = ({
  setRecipeName,
  setRecipeTime,
  setRecipeImage,
  ingredientColumns,
  setIngredientColumns,
  setProcedureContent,
  setOrder,
  createRecipe,
  recipeErrorMessages,
  ingredientErrorMessages,
  procedureErrorMessages,
}) => {
  const [numberOfIngredientForms, setNumberOfIngredientForms] = useState<number>(1)
  const [procedureForms, setProcedureForms] = useState<number>(1)

  const ingredientForms = () => {
    return [...Array(numberOfIngredientForms)].map((_, index: number) => (
      <div key={index}>
        <div className="flex justify-around">
          <TextField
            variant="outlined"
            margin="dense"
            label="材料名"
            id={'ingredientNameOf' + String(index)}
            value={ingredientColumns[index].ingredientName}
            className="mb-4 mr-2"
            onChange={(event) => inputIngredientName(event, index)}
          />
          <TextField
            variant="outlined"
            type="number"
            label="分量"
            id={'quantityOf' + String(index)}
            value={ingredientColumns[index].quantity}
            inputProps={{ min: 0 }}
            margin="dense"
            className="mr-2"
            onChange={(event) => inputQuantity(event, index)}
          />
          {index === numberOfIngredientForms - 1 && index !== 0 ? (
            <button
              className="h-8 mt-2 px-3 bg-red text-white font-bold rounded-sm"
              onClick={(e) => deleteIngredientForm(e, index)}
            >
              ー
            </button>
          ) : (
            <span className="ml-10"></span>
          )}
        </div>
        {ingredientErrorMessages?.quantity ? (
          ingredientErrorMessages.quantity.map((error: string, index: number) => (
            <p className="text-red text-sm" key={index}>
              分量{error}
            </p>
          ))
        ) : (
          <></>
        )}
        {ingredientErrorMessages?.ingredientName ? (
          ingredientErrorMessages.ingredientName.map((error: string, index: number) => (
            <p className="text-red text-sm" key={index}>
              材料名{error}
            </p>
          ))
        ) : (
          <></>
        )}
      </div>
    ))
  }

  const addIngredientForm = (e: React.MouseEvent<HTMLButtonElement>): void => {
    e.preventDefault()
    setIngredientColumns([...ingredientColumns, { ingredientName: '', quantity: 0 }])
    setNumberOfIngredientForms(numberOfIngredientForms + 1)
  }

  const addProcedureForms = (e: React.MouseEvent<HTMLButtonElement>): void => {
    e.preventDefault()
    setProcedureForms(procedureForms + 1)
  }

  const deleteIngredientForm = (e: React.MouseEvent<HTMLButtonElement>, index: number): void => {
    e.preventDefault()
    // こうすると最初の要素が消されてエラーになる
    setNumberOfIngredientForms(numberOfIngredientForms - 1)
    setIngredientColumns(ingredientColumns.splice(index, 1))
    console.log(ingredientColumns)
  }

  const inputIngredientName = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, index: number): void => {
    // quantityのvalueを取得してingredientNameの入力時にそのquantityをセット
    const quantityValue = document.getElementById('quantityOf' + String(index))
    const ingredientColumnCopy = ingredientColumns.slice()
    ingredientColumnCopy[index] = {
      ingredientName: e.target.value,
      quantity: Number(quantityValue?.getAttribute('value')),
    }
    setIngredientColumns(ingredientColumnCopy)
  }

  const inputQuantity = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, index: number): void => {
    // ingredientNameのvalueを取得してquantityの入力時にそのingredientNameをセット
    const ingredientNameValue = document.getElementById('ingredientNameOf' + String(index))
    const ingredientColumnCopy = ingredientColumns.slice()
    ingredientColumnCopy[index] = {
      ingredientName: ingredientNameValue?.getAttribute('value'),
      quantity: Number(e.target.value),
    }
    setIngredientColumns(ingredientColumnCopy)
  }

  const uploadRecipeImage = useCallback((e: React.ChangeEvent<HTMLInputElement>): void => {
    if (e.currentTarget.files) {
      const file: File = e.currentTarget.files[0]
      setRecipeImage(file)
    }
  }, [])

  const sendRecipeData = (e: React.MouseEvent<HTMLButtonElement>): void => {
    e.preventDefault()
    window.scrollTo(0, 0)
    createRecipe()
  }

  return (
    <form noValidate autoComplete="off">
      <Card className="max-w-2xl mx-auto px-2 py-2">
        <p className="text-center my-4 font-semibold text-3xl">レシピ登録</p>
        <CardContent>
          <p className="w-40 mb-4 py-2 text-center bg-darkRed rounded-full">
            <span className="font-bold text-orange">レシピ名</span>
          </p>
          <div className="text-center">
            <TextField
              variant="outlined"
              fullWidth
              margin="dense"
              className="mr-2 mb-4 max-w-xl"
              onChange={(event) => setRecipeName(event.target.value)}
            />
          </div>
          {recipeErrorMessages?.recipeName ? (
            recipeErrorMessages.recipeName.map((error: string, index: number) => (
              <p className="text-red text-sm mb-4" key={index}>
                レシピ名{error}
              </p>
            ))
          ) : (
            <p className="mb-4"></p>
          )}
          <label htmlFor="recipeImage" className="mr-4 cursor-pointer">
            レシピ画像（任意）
          </label>
          <input
            accept="image/*,.png,.jpg,.jpeg,.gif"
            id="recipeImage"
            type="file"
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
              uploadRecipeImage(e)
            }}
          />
          {recipeErrorMessages?.recipeImage ? (
            recipeErrorMessages.recipeImage.map((error: string, index: number) => (
              <p className="text-red text-sm" key={index}>
                レシピ画像{error}
              </p>
            ))
          ) : (
            <></>
          )}
          <p className="w-28 mt-12 mb-4 py-2 text-center bg-darkRed rounded-full">
            <span className="font-bold text-orange">材料</span>
          </p>
          {/* numberOfIngredientForms(1)個フォームを表示し、ボタンで追加 */}
          {ingredientForms()}
          <div className="text-left">
            <button
              className="mr-14 mt-2 px-4 py-1 bg-orange text-white font-bold rounded-sm maxSm:mr-4"
              onClick={(e) => addIngredientForm(e)}
            >
              +
            </button>
          </div>
          <p className="w-28 mt-12 mb-4 py-2 text-center bg-darkRed rounded-full">
            <span className="font-bold text-orange">手順</span>
          </p>
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
          {recipeErrorMessages?.recipeTime ? (
            recipeErrorMessages.recipeTime.map((error: string, index: number) => (
              <p className="text-red text-sm mb-4" key={index}>
                調理時間{error}
              </p>
            ))
          ) : (
            <p className="mb-6"></p>
          )}
          {[...Array(procedureForms)].map((value: number, index: number) => (
            <div key={index}>
              <TextField
                variant="outlined"
                type="number"
                label="手順"
                defaultValue={index + 1}
                inputProps={{ min: 0 }}
                margin="dense"
                onChange={(event) => setOrder(Number(event.target.value))}
              />
              {procedureErrorMessages?.order ? (
                procedureErrorMessages.order.map((error: string, index: number) => (
                  <p className="text-red text-sm" key={index}>
                    手順{error}
                  </p>
                ))
              ) : (
                <></>
              )}
              <TextField
                variant="outlined"
                multiline
                rows={4}
                fullWidth
                label="内容"
                margin="dense"
                onChange={(event) => setProcedureContent(event.target.value)}
              />
              {procedureErrorMessages?.procedureContent ? (
                procedureErrorMessages.procedureContent.map((error: string, index: number) => (
                  <p className="text-red text-sm" key={index}>
                    内容{error}
                  </p>
                ))
              ) : (
                <p className="mb-4"></p>
              )}
              <hr className="text-brown my-4" />
            </div>
          ))}
          <div className="text-right">
            <button
              className="mt-2 px-4 py-1 bg-orange text-white font-bold rounded-sm"
              onClick={(e) => addProcedureForms(e)}
            >
              +
            </button>
          </div>
          <button
            type="submit"
            className="block mt-8 mb-4 mx-auto px-10 py-2 rounded-full bg-lightGreen text-white"
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

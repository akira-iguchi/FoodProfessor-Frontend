import React, { useState, useCallback } from 'react'

import ReactTagInput from '@pathofdev/react-tag-input'
import '@pathofdev/react-tag-input/build/index.css'

import Card from '@material-ui/core/Card'
import CardContent from '@material-ui/core/CardContent'
import TextField from '@material-ui/core/TextField'

import { ingredientTypes } from 'pages/recipes/CreateRecipe'
import { procedureTypes } from 'pages/recipes/CreateRecipe'

type RecipeParamProps = {
  setRecipeName: (e: string) => void
  setRecipeTime: (e: number) => void
  setRecipeImage: (e: File) => void
  ingredientParams: ingredientTypes[]
  setIngredientParams: (e: ingredientTypes[]) => void
  categories: string[]
  setCategories: (e: string[]) => void
  procedureParams: procedureTypes[]
  setProcedureParams: (e: procedureTypes[]) => void
  createRecipe: () => void
}

const RecipeForm: React.FC<RecipeParamProps> = ({
  setRecipeName,
  setRecipeTime,
  setRecipeImage,
  ingredientParams,
  categories,
  setCategories,
  setIngredientParams,
  procedureParams,
  setProcedureParams,
  createRecipe,
}) => {
  const [numberOfIngredientForms, setNumberOfIngredientForms] = useState<number>(1)
  const [numberOfProcedureForms, setNumberOfProcedureForms] = useState<number>(1)

  const addIngredientForm = (e: React.MouseEvent<HTMLButtonElement>): void => {
    e.preventDefault()
    setIngredientParams([...ingredientParams, { ingredient_name: '', quantity: '' }])
    setNumberOfIngredientForms(numberOfIngredientForms + 1)
  }

  const addProcedureForms = (e: React.MouseEvent<HTMLButtonElement>): void => {
    e.preventDefault()
    setProcedureParams([...procedureParams, { procedure_content: '' }])
    setNumberOfProcedureForms(numberOfProcedureForms + 1)
  }

  // うまく行かないため中止
  // const deleteIngredientForm = (e: React.MouseEvent<HTMLButtonElement>, index: number): void => {
  //   e.preventDefault()
  //   // こうすると最初の要素が消されてエラーになる
  //   setNumberOfIngredientForms(numberOfIngredientForms - 1)
  //   setIngredientParams(ingredientParams.splice(index, 1))
  //   console.log(ingredientParams)
  // }

  const inputIngredientName = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, index: number): void => {
    // quantityのvalueを取得してingredient_nameの入力時にそのquantityをセット
    const quantityValue = document.getElementById('quantityOf' + String(index))
    const ingredientColumnCopy = ingredientParams.slice()
    ingredientColumnCopy[index] = {
      ingredient_name: e.target.value,
      quantity: quantityValue?.getAttribute('value'),
    }
    setIngredientParams(ingredientColumnCopy)
  }

  const inputQuantity = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, index: number): void => {
    // ingredient_nameのvalueを取得してquantityの入力時にそのingredient_nameをセット
    const ingredientNameValue = document.getElementById('ingredientNameOf' + String(index))
    const ingredientColumnCopy = ingredientParams.slice()
    ingredientColumnCopy[index] = {
      ingredient_name: ingredientNameValue?.getAttribute('value'),
      quantity: e.target.value,
    }
    setIngredientParams(ingredientColumnCopy)
  }

  const inputProcedureContent = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, index: number): void => {
    const procedureColumnCopy = procedureParams.slice()
    procedureColumnCopy[index] = {
      procedure_content: e.target.value,
    }
    setProcedureParams(procedureColumnCopy)
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
          <p className="w-32 mb-4 py-2 text-center bg-darkRed rounded-full">
            <span className="font-bold text-orange">レシピ名</span>
          </p>
          <div className="text-center">
            <TextField
              variant="outlined"
              required
              fullWidth
              margin="dense"
              className="mr-2 mb-4 max-w-xl"
              onChange={(event) => setRecipeName(event.target.value)}
            />
          </div>
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
          <p className="w-28 mt-12 mb-4 py-2 text-center bg-darkRed rounded-full">
            <span className="font-bold text-orange">材料</span>
          </p>
          {/* numberOfIngredientForms(1)個フォームを表示し、ボタンで追加 */}
          {[...Array(numberOfIngredientForms)].map((_, index: number) => (
            <div key={index}>
              <div className="flex justify-around">
                <TextField
                  variant="outlined"
                  margin="dense"
                  required
                  label="材料名"
                  id={'ingredientNameOf' + String(index)}
                  value={ingredientParams[index].ingredient_name}
                  className="mb-4 mr-2"
                  onChange={(event) => inputIngredientName(event, index)}
                />
                <TextField
                  variant="outlined"
                  label="分量"
                  required
                  id={'quantityOf' + String(index)}
                  value={ingredientParams[index].quantity}
                  margin="dense"
                  className="mr-2"
                  onChange={(event) => inputQuantity(event, index)}
                />
              </div>
            </div>
          ))}
          <div className="text-right">
            <button
              className="mr-14 mt-2 px-4 py-1 bg-orange text-white font-bold rounded-sm maxSm:mr-4"
              onClick={(e) => addIngredientForm(e)}
            >
              +
            </button>
          </div>

          <p className="w-36 mt-12 mb-4 py-2 text-center bg-darkRed rounded-full">
            <span className="font-bold text-orange">カテゴリ</span>
          </p>
          <ReactTagInput
            placeholder="カテゴリ名(Enterで登録)"
            maxTags={10}
            editable={true}
            readOnly={false}
            removeOnBackspace={true}
            tags={categories}
            onChange={(newCategories) => setCategories(newCategories)}
          />

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
          <span className="relative top-4 left-2 text-xl font-medium">分</span>

          {/* numberOfProcedureForms(1)個フォームを表示し、ボタンで追加 */}
          {[...Array(numberOfProcedureForms)].map((_, index: number) => (
            <div key={index}>
              <p className="text-xl font-middle">{index + 1} .</p>
              <TextField
                variant="outlined"
                multiline
                rows={4}
                required
                fullWidth
                label="内容"
                margin="dense"
                onChange={(event) => inputProcedureContent(event, index)}
              />
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

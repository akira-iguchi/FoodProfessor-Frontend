import React, { useState, useEffect, createContext } from 'react'
import { BrowserRouter as Router, Switch, Route, Redirect } from 'react-router-dom'

import { User } from 'types/user'

import { getCurrentUser } from 'lib/apis/auth'

import CommonLayout from 'components/commons/CommonLayout'

import Top from 'pages/Top'

import Register from 'pages/auth/Register'
import Login from 'pages/auth/Login'

import Profile from 'pages/users/Profile'
import EditProfile from 'pages/users/EditProfile'

import RecipeDetail from 'pages/recipes/RecipeDetail'
import CreateRecipe from 'pages/recipes/CreateRecipe'
import EditRecipe from 'pages/recipes/EditRecipe'
import SearchRecipes from 'pages/recipes/SearchRecipes'

import IngredientRecipes from 'pages/ingredients/Recipes'

import CategoryRecipes from 'pages/categories/Recipes'

// グローバルで扱う変数・関数
export const AuthContext = createContext(
  {} as {
    loading: boolean
    setLoading: React.Dispatch<React.SetStateAction<boolean>>
    isLoggedIn: boolean
    setIsLoggedIn: React.Dispatch<React.SetStateAction<boolean>>
    currentUser: User | undefined
    setCurrentUser: React.Dispatch<React.SetStateAction<User | undefined>>
    handleGetCurrentUser: any
  }
)

const App: React.FC = () => {
  const [loading, setLoading] = useState<boolean>(true)
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false)
  const [currentUser, setCurrentUser] = useState<User | undefined>()

  // 認証済みのユーザーがいるかどうかチェック
  // 確認できた場合はそのユーザーの情報を取得
  const handleGetCurrentUser = async () => {
    try {
      const res = await getCurrentUser()

      if (res?.data.isLogin === true) {
        setIsLoggedIn(true)
        setCurrentUser(res?.data.data)
      }
    } catch (err) {
      console.log(err)
    }

    setLoading(false)
  }

  useEffect(() => {
    handleGetCurrentUser()
  }, [setCurrentUser])

  // ユーザーが認証済みかどうかでルーティングを決定
  const Private = ({ children }: { children: any }) => {
    if (!loading) {
      if (isLoggedIn) {
        return children
      } else {
        return <Redirect to="/login" />
      }
    } else {
      return <></>
    }
  }

  return (
    <Router>
      <AuthContext.Provider
        value={{ loading, setLoading, isLoggedIn, setIsLoggedIn, currentUser, setCurrentUser, handleGetCurrentUser }}
      >
        <CommonLayout>
          <Switch>
            <Route exact path="/top" component={Top} />
            <Route exact path="/register" component={Register} />
            <Route exact path="/login" component={Login} />
            <Route exact path="/recipes/:recipeId" component={RecipeDetail} />
            <Route exact path="/recipes/search/:recipeName" component={SearchRecipes} />
            <Route exact path="/ingredients/:ingredientName/recipes" component={IngredientRecipes} />
            <Route exact path="/categories/:categoryName/recipes" component={CategoryRecipes} />
            <Private>
              <Route exact path="/users/:userId" component={Profile} />
              <Route exact path="/users/:userId/edit" component={EditProfile} />
              <Route exact path="/recipe/create" component={CreateRecipe} />
              <Route exact path="/recipe/:recipeId/edit" component={EditRecipe} />
            </Private>
          </Switch>
        </CommonLayout>
      </AuthContext.Provider>
    </Router>
  )
}

export default App

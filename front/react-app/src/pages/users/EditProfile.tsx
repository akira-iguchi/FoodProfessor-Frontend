import React, { useState, useEffect, useContext, useCallback } from 'react'
import { Redirect, useHistory } from 'react-router-dom'

import { fetchEditProfileData } from 'lib/apis/users/editProfile'

import { AuthContext } from 'App'

import { User } from 'types/user'
import { UpdateProfileData } from 'lib/apis/users/editProfile'

import TextField from '@material-ui/core/TextField'
import Card from '@material-ui/core/Card'
import CardContent from '@material-ui/core/CardContent'
import CardHeader from '@material-ui/core/CardHeader'

const Profile: React.FC<any> = ({ match }) => {
  const history = useHistory()

  const { currentUser, isLoggedIn, setIsLoggedIn } = useContext(AuthContext)
  const [user, setUser] = useState<User | null>()

  const [firstName, setFirstName] = useState<string>('')
  const [lastName, setLastName] = useState<string>('')
  const [email, setEmail] = useState<string>('')
  const [profileImage, setProfileImage] = useState<File>()

  // APIに接続してデータ取得
  useEffect(() => {
    fetchEditProfileData(match.params.userId).then((data) => {
      setUser(data.user)
      setFirstName(data.user.firstName)
      setLastName(data.user.lastName)
      setEmail(data.user.email)
    })
  }, [])

  if (user && user?.id !== currentUser?.id) {
    return <Redirect to="/top" />
  }

  const uploadProfileImage = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.currentTarget.files) {
      const file: File = e.currentTarget.files[0]
      setProfileImage(file)
    }
  }, [])

  // FormData形式でデータを作成
  const createFormData = (): FormData => {
    const formData = new FormData()

    formData.append('firstName', firstName)
    formData.append('lastName', lastName)
    if (profileImage) formData.append('profileImage', profileImage)

    formData.append('email', email)

    return formData
  }

  const handleUpdate = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()
    window.scrollTo(0, 0)

    const params = createFormData()

    if (isLoggedIn) {
      if (user && user?.id !== currentUser?.id) {
        return <Redirect to="/top" />
      }

      try {
        const res = await UpdateProfileData(user?.id, params)

        if (res.status === 201) {
          history.push(`/users/${user?.id}`)
          history.go(0) // ヘッダーのアイコンを更新するためページをリロード
        }
      } catch (err) {
        console.log(err)
      }
    } else {
      history.push('/login')
    }
  }

  return (
    <>
      {/* ユーザー情報を読み込ませてからvalueに追加 */}
      {user ? (
        <form noValidate autoComplete="off">
          <Card className="px-14 maxSm:px-4 py-2 max-w-xl text-center mx-auto">
            <CardHeader title="プロフィール編集" />
            <CardContent>
              <div className="flex justify-between">
                <TextField
                  variant="outlined"
                  required
                  label="姓"
                  defaultValue={user?.firstName}
                  margin="dense"
                  className="mr-2 mb-4"
                  onChange={(event) => setFirstName(event.target.value)}
                />
                <TextField
                  variant="outlined"
                  required
                  label="名"
                  defaultValue={user?.lastName}
                  margin="dense"
                  onChange={(event) => setLastName(event.target.value)}
                />
              </div>
              <TextField
                variant="outlined"
                required
                label="メールアドレス"
                fullWidth
                defaultValue={user?.email}
                margin="dense"
                className="mb-4"
                onChange={(event) => setEmail(event.target.value)}
              />
              <label htmlFor="profileImage" className="float-left mt-2 cursor-pointer">
                プロフィール画像
              </label>
              <input
                accept="image/*,.png,.jpg,.jpeg,.gif"
                id="profileImage"
                type="file"
                className="mt-2 float-left"
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                  uploadProfileImage(e)
                }}
              />
              <br />
              <button
                type="submit"
                className="mt-8 mb-4 px-10 py-2 rounded-full bg-lightGreen text-white"
                onClick={handleUpdate}
              >
                変更
              </button>
            </CardContent>
          </Card>
        </form>
      ) : (
        <></>
      )}
    </>
  )
}

export default Profile

import React, { useState, useEffect, useContext } from 'react'
import { AuthContext } from 'App'
import { Link, useHistory } from 'react-router-dom'

import { User } from 'types/user'
import { Comment } from 'types/comment'

import { DefaultIconUrl } from 'images/defaultIcon'

import CommentForm from 'components/comments/CommentForm'
import { deleteCommentData } from 'lib/apis/comments/deleteComment'

type Comments = {
  recipeId: number | undefined
  comments: Comment[] | null
  commentUsers: User[] | null
}

const RecipeComments: React.FC<Comments> = (props) => {
  const { currentUser, isLoggedIn } = useContext(AuthContext)
  const [comments, setComments] = useState<Comment[] | null | undefined>([])

  const history = useHistory()

  useEffect(() => {
    setComments(props.comments)
  }, [])

  // コメントの追加、削除でコメント一覧更新
  const reduceComment = (index: number): void => {
    const updateComments = props.comments?.splice(index, 1)
    setComments(updateComments)
  }

  const increaseComment = (comment: Comment): void => {
    props.comments?.unshift(comment)
    setComments(props.comments)
  }

  const deleteComment = async (e: React.MouseEvent<HTMLElement, MouseEvent>, comment: Comment, index: number) => {
    e.preventDefault()

    if (isLoggedIn) {
      if (currentUser?.id !== comment.userId) return

      const check = confirm('削除しますか？')

      if (check) {
        try {
          const res = await deleteCommentData(props.recipeId, comment.id)

          if (res.status === 200) {
            reduceComment(index)
          }
        } catch (err) {
          console.log(err)
        }
      }
    } else {
      history.push('/login')
    }
  }

  return (
    <>
      {props ? (
        props.comments?.map((comment: Comment, index: number) => (
          <div key={index}>
            {props.commentUsers?.map((user: User) => {
              // すべてのユーザーとコメントの投稿者のidが一致すると画像表示
              if (user.id === comment.userId) {
                return (
                  <div className="flex" key={index}>
                    <Link to={`/users/${user.id}`}>
                      <img
                        // レシピ画像が存在しないならデフォルト画像表示
                        src={user?.profileImage.url ? user.profileImage.url : DefaultIconUrl}
                        className="max-w-verySmall h-12 mt-2 mr-6 rounded-full"
                        alt="profileImage"
                      />
                    </Link>
                    <div>
                      <div className="table mr-4">
                        <div className="relative top-6 w-3.5 h-3.5 transform rotate-45 border border-brown"></div>
                        <div className="relative left-1 max-w-xl mb-4 p-2 bg-white border border-brown rounded-md">
                          <p>{comment.commentContent}</p>
                        </div>
                      </div>
                      {user.id === currentUser?.id ? (
                        <button className="relative bottom-2 z-10" onClick={(e) => deleteComment(e, comment, index)}>
                          <i className="fas fa-trash-alt"></i>
                        </button>
                      ) : (
                        <></>
                      )}
                    </div>
                  </div>
                )
              }
            })}
          </div>
        ))
      ) : (
        <></>
      )}
      {isLoggedIn ? <CommentForm recipeId={props.recipeId} increaseComment={increaseComment} /> : <></>}
    </>
  )
}

export default RecipeComments

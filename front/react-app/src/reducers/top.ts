import { REQUEST_STATE } from 'lib/constants'

export const initialState = {
  fetchState: REQUEST_STATE.INITIAL,
  List: [],
}

export const topActionTypes = {
  FETCHING: 'FETCHING',
  FETCH_SUCCESS: 'FETCH_SUCCESS',
}

export const topReducer = (state: any, action: any) => {
  switch (action.type) {
    case topActionTypes.FETCHING:
      return {
        ...state,
        fetchState: REQUEST_STATE.LOADING,
      }
    case topActionTypes.FETCH_SUCCESS:
      return {
        fetchState: REQUEST_STATE.OK,
        List: action.payload,
      }
    default:
      throw new Error()
  }
}

// reducers/usersReducer.js

const initialState = {
  items: [], // array of users
  loading: false, // is data loading?
  error: null, // error message (if any)
};

export default function usersReducer(state = initialState, action) {
  switch (action.type) {
    case "FETCH_USERS_REQUEST":
      return {
        ...state,
        loading: true,
        error: null,
      };
    case "FETCH_USERS_SUCCESS":
      return {
        ...state,
        loading: false,
        items: action.payload, // saga: yield put({ type: FETCH_USERS_SUCCESS, payload: response.data })
        error: null,
      };
    case "FETCH_USERS_FAILURE":
      return {
        ...state,
        loading: false,
        error: action.payload,
      };
    default:
      return state;
  }
}

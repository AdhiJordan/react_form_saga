// reducers/projectsReducer.js

const initialState = {
  items: [], // array of projects
  loading: false, // is data loading?
  error: null, // error message (if any)
};

export default function projectsReducer(state = initialState, action) {
  switch (action.type) {
    case "FETCH_PROJECTS_REQUEST":
      return {
        ...state,
        loading: true,
        error: null,
      };
    case "FETCH_PROJECTS_SUCCESS":
      return {
        ...state,
        loading: false,
        items: action.payload, // found in saga: payload: response.data
        error: null,
      };
    case "FETCH_PROJECTS_FAILURE":
      return {
        ...state,
        loading: false,
        error: action.payload,
      };
    default:
      return state;
  }
}

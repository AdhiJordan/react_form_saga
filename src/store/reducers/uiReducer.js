// uiReducer.js

const initialState = {
  taskForm: { isOpen: false, mode: "create", taskId: null },
  filters: { project: null, assignee: null, status: "all", taskType: "all" },
  loading: { tasks: false, users: false, projects: false },
  errors: { tasks: null, form: null },
};

const uiReducer = (state = initialState, action) => {
  switch (action.type) {
    case "OPEN_TASK_FORM":
      return {
        ...state,
        taskForm: { ...state.taskForm, ...action.payload, isOpen: true },
      };
    case "CLOSE_TASK_FORM":
      return {
        ...state,
        taskForm: { isOpen: false, mode: "create", taskId: null },
      };
    case "SET_FORM_MODE":
      return {
        ...state,
        taskForm: { ...state.taskForm, mode: action.payload },
      };
    case "SET_SEARCH":
      return {
        ...state,
        filters: { ...state.filters, search: action.payload },
      };
    case "SET_FILTERS":
      return {
        ...state,
        filters: { ...state.filters, ...action.payload },
      };
    case "SET_LOADING":
      return {
        ...state,
        loading: { ...state.loading, ...action.payload },
      };
    case "SET_ERROR":
      return {
        ...state,
        errors: { ...state.errors, ...action.payload },
      };
    default:
      return state;
  }
};

export default uiReducer;

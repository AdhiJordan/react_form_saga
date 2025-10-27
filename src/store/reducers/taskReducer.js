// reducers/taskReducer.js

import {
  FETCH_TASKS_REQUEST,
  FETCH_TASKS_SUCCESS,
  FETCH_TASKS_FAILURE,
  CREATE_TASK_REQUEST,
  CREATE_TASK_SUCCESS,
  CREATE_TASK_FAILURE,
  CREATE_TASK_OPTIMISTIC,
  UPDATE_TASK_REQUEST,
  UPDATE_TASK_SUCCESS,
  UPDATE_TASK_FAILURE,
  UPDATE_TASK_OPTIMISTIC,
  DELETE_TASK_REQUEST,
  DELETE_TASK_SUCCESS,
  DELETE_TASK_FAILURE,
  DELETE_TASK_OPTIMISTIC,
} from "../actions/taskActions";

const initialState = {
  items: [],
  loading: false,
  error: null,
};

export default function taskReducer(state = initialState, action) {
  switch (action.type) {
    // ---------- FETCH ----------
    case FETCH_TASKS_REQUEST:
      return { ...state, loading: true, error: null };
    case FETCH_TASKS_SUCCESS:
      return { ...state, loading: false, items: action.payload, error: null };
    case FETCH_TASKS_FAILURE:
      return { ...state, loading: false, error: action.payload };

    // ---------- CREATE TASK (Optimistic update) ----------
    case CREATE_TASK_OPTIMISTIC:
      return {
        ...state,
        items: [...state.items, action.payload], // Add with temp id
      };
    case CREATE_TASK_SUCCESS:
      // Replace temp task with real task (match by tempId if present)
      if (action.meta && action.meta.tempId) {
        return {
          ...state,
          items: state.items.map((task) =>
            task.id === action.meta.tempId ? action.payload : task
          ),
        };
      }
      return {
        ...state,
        items: [...state.items, action.payload],
      };
    case CREATE_TASK_FAILURE:
      // Remove temp task if creation failed
      if (action.meta && action.meta.tempId) {
        return {
          ...state,
          items: state.items.filter((task) => task.id !== action.meta.tempId),
          error: action.payload,
        };
      }
      return { ...state, error: action.payload };

    // ---------- UPDATE TASK (Optimistic update) ----------
    case UPDATE_TASK_OPTIMISTIC:
      return {
        ...state,
        items: state.items.map((task) =>
          task.id === action.payload.id ? { ...task, ...action.payload } : task
        ),
      };
    case UPDATE_TASK_SUCCESS:
      return {
        ...state,
        items: state.items.map((task) =>
          task.id === action.payload.id ? action.payload : task
        ),
      };
    case UPDATE_TASK_FAILURE:
      // Rollback to original if provided
      if (action.meta && action.meta.originalTask) {
        return {
          ...state,
          items: state.items.map((task) =>
            task.id === action.meta.id ? action.meta.originalTask : task
          ),
          error: action.payload,
        };
      }
      return { ...state, error: action.payload };

    // ---------- DELETE TASK (Optimistic update) ----------
    case DELETE_TASK_OPTIMISTIC:
      return {
        ...state,
        items: state.items.filter((task) => task.id !== action.payload),
      };
    case DELETE_TASK_SUCCESS:
      // Nothing extra to do, already optimistically removed
      return state;
    case DELETE_TASK_FAILURE:
      // Rollback: re-add task if provided
      if (action.meta && action.meta.task) {
        return {
          ...state,
          items: [...state.items, action.meta.task],
          error: action.payload,
        };
      }
      return { ...state, error: action.payload };

    default:
      return state;
  }
}

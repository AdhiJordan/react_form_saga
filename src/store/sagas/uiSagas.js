// sagas/uiSagas.js
import { mockApi } from "../../api/mockApi";
// import {
//   setFormMode,
//   setLoading,
//   setError,
//   //   clearError,
// } from "../actions/uiActions";

import { takeLatest, put, select, call } from "redux-saga/effects";
import {
  SET_FILTERS,
  CLEAR_FILTERS,
  SET_SEARCH,
  OPEN_TASK_FORM,
} from "../actions/uiActions";
import {
  FETCH_TASKS_SUCCESS,
  FETCH_TASKS_FAILURE,
} from "../actions/taskActions";

const defaultFilters = {
  projectId: null,
  assigneeId: null,
  status: "all",
  taskType: "all",
  search: "",
};

// Worker saga: what to do when OPEN_TASK_FORM is dispatched
function* handleOpenTaskForm(action) {
  //   try {
  //     // Start loading state for UI
  //     yield put(setLoading(true));
  //     // Optionally, clear previous errors
  //     yield put(clearError());
  //     // openModal could include info about mode ('create' or 'edit') or data
  //     const { openModal } = action.payload || {};
  //     // Optionally, set the mode if present
  //     if (openModal?.mode) {
  //       yield put(setFormMode(openModal.mode));
  //     }
  //     // Stop loading
  //     yield put(setLoading(false));
  //     // You can also put other logic here, like logging analytics, etc.
  //   } catch (error) {
  //     yield put(setError(error.message || "Failed to open form", "ui"));
  //     yield put(setLoading(false));
  //   }
}

// Worker saga for updating filters and fetching filtered tasks
// function* handleFiltersChange() {
//   try {
//     // 1. Get current filters from Redux state
//     const filters = yield select((state) => state.ui.filters);
//     console.log("&&&&", filters);
//     // 2. Call the mock API with those filters
//     const response = yield call(mockApi.fetchTasks, filters);
//     console.log("&&&&", response);
//     // 3. Dispatch success with tasks if all went well
//     yield put({ type: FETCH_TASKS_SUCCESS, payload: response.data });
//   } catch (error) {
//     // 4. Dispatch error if API fails
//     yield put({ type: FETCH_TASKS_FAILURE, payload: error.message });
//   }
// }

function* fetchTasksBasedOnFilters() {
  try {
    const filters = yield select((state) => state.ui.filters);
    const response = yield call(mockApi.fetchTasks, filters);
    yield put({ type: FETCH_TASKS_SUCCESS, payload: response.data });
  } catch (error) {
    yield put({ type: FETCH_TASKS_FAILURE, payload: error.message });
  }
}

// Handle clearing filters
function* handleClearFilters() {
  // Optionally reset to default filters in Redux store
  yield put({ type: SET_FILTERS, payload: defaultFilters });
  // Then fetch tasks using default filters
  yield call(fetchTasksBasedOnFilters);
}

// Handle search updates
function* handleSetSearch() {
  // Simply fetch tasks again with updated filters (which include search term)
  yield call(fetchTasksBasedOnFilters);
}

// Handle clearing filters
// function* handleClearFilters() {
//   // Optionally reset to default filters in Redux store
//   yield put({ type: SET_FILTERS, payload: defaultFilters });
//   // Then fetch tasks using default filters
//   yield call(fetchTasksBasedOnFilters);
// }

// Handle search updates
// function* handleSetSearch() {
//   // Simply fetch tasks again with updated filters (which include search term)
//   yield call(fetchTasksBasedOnFilters);
// }

// // Watcher saga: watch for OPEN_TASK_FORM actions
export function* watchOpenTaskForm() {
  yield takeLatest(OPEN_TASK_FORM, handleOpenTaskForm);
}

export function* watchFilters() {
  yield takeLatest(OPEN_TASK_FORM, watchOpenTaskForm);
  yield takeLatest(SET_FILTERS, fetchTasksBasedOnFilters);
  yield takeLatest(CLEAR_FILTERS, handleClearFilters);
  yield takeLatest(SET_SEARCH, handleSetSearch);
}

// To use, add watchOpenTaskForm to your root saga:

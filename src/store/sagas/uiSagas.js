// sagas/uiSagas.js
import { takeLatest, put } from "redux-saga/effects";
import { OPEN_TASK_FORM } from "../actions/uiActions";
import {
  setFormMode,
  setLoading,
  setError,
  clearError,
} from "../actions/uiActions";

// Worker saga: what to do when OPEN_TASK_FORM is dispatched
function* handleOpenTaskForm(action) {
  try {
    // Start loading state for UI
    yield put(setLoading(true));

    // Optionally, clear previous errors
    yield put(clearError());

    // openModal could include info about mode ('create' or 'edit') or data
    const { openModal } = action.payload || {};

    // Optionally, set the mode if present
    if (openModal?.mode) {
      yield put(setFormMode(openModal.mode));
    }

    // Stop loading
    yield put(setLoading(false));

    // You can also put other logic here, like logging analytics, etc.
  } catch (error) {
    yield put(setError(error.message || "Failed to open form", "ui"));
    yield put(setLoading(false));
  }
}

// Watcher saga: watch for OPEN_TASK_FORM actions
export function* watchOpenTaskForm() {
  yield takeLatest(OPEN_TASK_FORM, handleOpenTaskForm);
}

// To use, add watchOpenTaskForm to your root saga:
import { all, fork } from "redux-saga/effects";

export default function* rootSaga() {
  yield all([
    fork(watchOpenTaskForm),
    // ... other sagas
  ]);
}

// Task sagas for handling async operations
// TODO: Implement saga functions for task management

import {
  call,
  put,
  takeEvery,
  takeLatest,
  race,
  delay,
  select,
} from "redux-saga/effects";
import { mockApi } from "../../api/mockApi";

// TODO: Import action types and action creators
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

// TODO: Implement saga functions
// Requirements:
// 1. Handle fetch tasks with error handling
// 2. Handle create task with optimistic updates
// 3. Handle update task with optimistic updates
// 4. Handle delete task with optimistic updates
// 5. Implement retry logic for failed requests
// 6. Handle race conditions (cancel previous requests)

// TODO: Implement fetchTasksSaga - use call, put, try-catch
// TODO: Implement createTaskSaga - optimistic updates with rollback
// TODO: Implement updateTaskSaga - similar to create
// TODO: Implement deleteTaskSaga - with confirmation handling

// TODO: Export watcher sagas using takeLatest/takeEvery

// Selectors for optimistic rollback (optional)
const getTasks = (state) => state.tasks.items;

// --- Fetch Tasks Saga ---
function* fetchTasksSaga(action) {
  try {
    const { filters } = action.payload || {};
    const response = yield call(mockApi.fetchTasks, filters || {});
    yield put({ type: FETCH_TASKS_SUCCESS, payload: response.data });
  } catch (error) {
    yield put({ type: FETCH_TASKS_FAILURE, payload: error.message });
  }
}

// --- Create Task Saga with Optimistic Update ---
function* createTaskSaga(action) {
  const tempId = `temp-${Date.now()}`;
  const optimisticTask = { ...action.payload, id: tempId };
  // Show task optimistically
  yield put({ type: CREATE_TASK_OPTIMISTIC, payload: optimisticTask });

  try {
    const response = yield call(mockApi.createTask, action.payload);
    yield put({
      type: CREATE_TASK_SUCCESS,
      payload: response.data,
      meta: { tempId },
    });
  } catch (error) {
    // Rollback optimistic task if API fails
    yield put({
      type: CREATE_TASK_FAILURE,
      payload: error.message,
      meta: { tempId },
    });
  }
}

// --- Update Task Saga with Optimistic Update ---
function* updateTaskSaga(action) {
  const { id, updates } = action.payload;
  const tasks = yield select(getTasks);
  const originalTask = tasks.find((t) => t.id === id);

  if (!originalTask) {
    yield put({
      type: UPDATE_TASK_FAILURE,
      payload: "Task not found",
      meta: { id },
    });
    return;
  }

  const optimisticTask = { ...originalTask, ...updates };
  yield put({ type: UPDATE_TASK_OPTIMISTIC, payload: optimisticTask });

  try {
    const response = yield call(mockApi.updateTask, id, updates);
    yield put({ type: UPDATE_TASK_SUCCESS, payload: response.data });
  } catch (error) {
    // Rollback
    yield put({
      type: UPDATE_TASK_FAILURE,
      payload: error.message,
      meta: { id, originalTask },
    });
  }
}

// --- Delete Task Saga with Optimistic Update ---
function* deleteTaskSaga(action) {
  const { id } = action.payload;
  const tasks = yield select(getTasks);
  console.log("tasks", tasks, id);
  const taskToDelete = tasks.find((t) => t.id === id);
  console.log("taskToDelete", taskToDelete);
  if (!taskToDelete) {
    yield put({
      type: DELETE_TASK_FAILURE,
      payload: "Task not found",
      meta: { id },
    });
    return;
  }

  // Optimistically remove from UI
  yield put({ type: DELETE_TASK_OPTIMISTIC, payload: id });

  try {
    yield call(mockApi.deleteTask, id);
    yield put({ type: DELETE_TASK_SUCCESS, payload: id });
  } catch (error) {
    // Rollback deletion
    yield put({
      type: DELETE_TASK_FAILURE,
      payload: error.message,
      meta: { task: taskToDelete },
    });
  }
}

// --- Watcher Sagas ---
export function* watchFetchTasks() {
  yield takeLatest(FETCH_TASKS_REQUEST, fetchTasksSaga);
}

export function* watchCreateTask() {
  yield takeEvery(CREATE_TASK_REQUEST, createTaskSaga);
}

export function* watchUpdateTask() {
  yield takeEvery(UPDATE_TASK_REQUEST, updateTaskSaga);
}

export function* watchDeleteTask() {
  yield takeEvery(DELETE_TASK_REQUEST, deleteTaskSaga);
}

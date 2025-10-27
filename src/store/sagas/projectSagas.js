import { mockApi } from "../../api/mockApi";
import { takeLatest, call, put } from "redux-saga/effects";
import {
  FETCH_PROJECTS_REQUEST,
  FETCH_PROJECTS_SUCCESS,
  FETCH_PROJECTS_FAILURE,
} from "./../actions/projectActions.js";

function* fetchProjectsSaga() {
  try {
    const response = yield call(mockApi.fetchProjects);
    console.log("response", response);
    yield put({ type: FETCH_PROJECTS_SUCCESS, payload: response.data });
  } catch (error) {
    yield put({ type: FETCH_PROJECTS_FAILURE, payload: error.message });
  }
}

export function* watchProjects() {
  yield takeLatest(FETCH_PROJECTS_REQUEST, fetchProjectsSaga);
}

import { mockApi } from "../../api/mockApi.js";
import { takeLatest, call, put } from "redux-saga/effects";
import {
  FETCH_USERS_REQUEST,
  FETCH_USERS_SUCCESS,
  FETCH_USERS_FAILURE,
} from "../actions/userActions.js";

function* fetchUsersSaga() {
  try {
    const response = yield call(mockApi.fetchUsers);
    yield put({ type: FETCH_USERS_SUCCESS, payload: response.data });
  } catch (error) {
    yield put({ type: FETCH_USERS_FAILURE, payload: error.message });
  }
}

export function* watchUsers() {
  yield takeLatest(FETCH_USERS_REQUEST, fetchUsersSaga);
}

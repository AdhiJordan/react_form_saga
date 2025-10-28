import { all } from "redux-saga/effects";
// import { watchTasks } from "./taskSagas";
import { watchUsers } from "./userSagas";
import { watchProjects } from "./projectSagas";
import {
  watchFetchTasks,
  watchCreateTask,
  watchUpdateTask,
  watchDeleteTask,
} from "./taskSagas";
import { watchOpenTaskForm, watchFilters } from "./uiSagas";

export default function* rootSaga() {
  yield all([
    watchProjects(),
    watchUsers(),
    watchFetchTasks(),
    watchCreateTask(),
    watchUpdateTask(),
    watchDeleteTask(),
    watchOpenTaskForm(),
    watchFilters(),
  ]);
}

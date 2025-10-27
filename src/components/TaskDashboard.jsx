// Main Dashboard Component
// TODO: Implement the main container component

import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import TaskForm from "./TaskForm";
import TaskList from "./TaskList";
import FilterBar from "./FilterBar";

// TODO: Import selectors and actions
// import {
//   selectAllTasks,
//   selectFilteredTasks,
//   selectTaskFormState,
//   selectUsers,
//   selectProjects,
//   selectFilters,
//   selectLoading,
//   selectErrors
// } from '../store/selectors';

//import {
// fetchTasksRequest,
// createTaskRequest,
// updateTaskRequest,
// deleteTaskRequest,
//openTaskForm,
// closeTaskForm,
// setFilters,
//} from "../store/actions";
import {
  openTaskForm,
  closeTaskForm,
  editMode,
} from "../store/actions/uiActions";

const TaskDashboard = () => {
  const [getTaskId, setTaskId] = useState(null);

  const dispatch = useDispatch();
  const taskForm = useSelector((state) => state.ui.taskForm);
  const tasksList = useSelector((state) => state.tasks.items);

  // TODO: Connect to Redux state using useSelector

  // TODO: Fetch initial data on component mount

  // TODO: Refetch tasks when filters change

  useEffect(() => {
    dispatch({ type: "FETCH_TASKS_REQUEST" });
  }, [dispatch]);

  // TODO: Implement event handlers
  const handleCreateTask = () => {
    // TODO: Dispatch open form action for create mode
    dispatch(openTaskForm(true));
  };

  const handleEditTask = (taskId) => {
    dispatch(openTaskForm(true));
    setTaskId(taskId);
    dispatch(editMode("edit"));
    // TODO: Dispatch open form action for edit mode
    dispatch({ type: "UPDATE_TASK_REQUEST", payload: { id: taskId } });
  };

  const handleDeleteTask = (taskId) => {
    console.log("333", taskId);
    // TODO: Show confirmation and dispatch delete action
    dispatch({ type: "DELETE_TASK_REQUEST", payload: { id: taskId } });
  };

  const handleFormSubmit = (data) => {
    // TODO: Dispatch create or update action based on form mode
    console.log("data", data);
    // Generate ids for new subtasks if missing (for create mode)
    const subtasksWithIds = (data.subtasks || []).map((sub, idx) => ({
      id: sub.id && sub.id !== "" ? sub.id : `sub${Date.now()}_${idx}`,
      title: sub.title,
      completed: sub.completed ?? false,
    }));

    // acceptanceCriteria as string array (strip empty)
    const acceptanceCriteriaArray = (data.acceptanceCriteria || [])
      .map(String)
      .map((s) => s.trim())
      .filter((s) => s.length > 0);

    const task = {
      // Preserves id for edit, or generates new; you may leave id undefined for the saga/api to create it on backend
      id: data.id,
      title: data.title,
      description: data.description,
      taskType: data.taskType,
      priority: data.priority,
      status: data.status || "Todo",
      assigneeId: data.assigneeId,
      projectId: data.projectId,
      dueDate: data.dueDate || null,
      businessValue: data.businessValue || "",
      severity: data.severity, // for bugs
      stepsToReproduce: data.stepsToReproduce,
      currentBehavior: data.currentBehavior,
      proposedBehavior: data.proposedBehavior,
      researchQuestions: data.researchQuestions,
      expectedOutcomes: data.expectedOutcomes,
      createdAt: data.createdAt || new Date().toISOString(),
      acceptanceCriteria: acceptanceCriteriaArray,
      subtasks: subtasksWithIds,
    };
    console.log("####", task);

    dispatch({ type: "CREATE_TASK_REQUEST", payload: task });
    dispatch(closeTaskForm(false));
  };

  const handleFormClose = () => {
    dispatch(closeTaskForm(false));
    // TODO: Dispatch close form action and clear localStorage
  };

  const handleFiltersChange = (newFilters) => {
    // TODO: Dispatch filter change action
  };

  console.log("taskForm", taskForm);

  return (
    <div className="task-dashboard">
      <header className="dashboard-header">
        <h1>Task Management Dashboard</h1>
        <button className="create-task-btn" onClick={handleCreateTask}>
          + Create Task
        </button>
      </header>

      {/* TODO: Show error messages */}
      {/* {errors.tasks && (
        <div className="error-banner">
          Error: {errors.tasks}
        </div>
      )} */}

      <FilterBar
        // filters={filters}
        // projects={projects}
        // users={users}
        onFiltersChange={handleFiltersChange}
      />

      <TaskList
        tasks={tasksList}
        // loading={loading.tasks}
        onEditTask={handleEditTask}
        onDeleteTask={handleDeleteTask}
      />

      <TaskForm
        isOpen={taskForm.isOpen}
        mode={taskForm.mode}
        initialData={
          getTaskId ? tasksList.find((t) => t.id === getTaskId) : null
        }
        // users={users}
        // projects={projects}
        // loading={loading.tasks}
        onSubmit={handleFormSubmit}
        onClose={handleFormClose}
      />
    </div>
  );
};

export default TaskDashboard;

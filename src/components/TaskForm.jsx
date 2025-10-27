// Dynamic Task Form Component
// TODO: Implement complex form with React Hook Form

import React, { useEffect } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { TASK_TYPES, PRIORITIES, BUG_SEVERITIES } from "../api/mockApi";
import { useDispatch, useSelector } from "react-redux";

// TODO: Implement TaskForm component
// Requirements:
// 1. Dynamic fields based on task type
// 2. Form validation with custom rules
// 3. Field arrays for subtasks and acceptance criteria
// 4. Integration with Redux for data and state
// 5. Auto-save functionality
// 6. File attachment simulation

const TaskForm = ({
  isOpen,
  mode, // 'create' or 'edit'
  initialData = null,
  onSubmit,
  onClose,
  // users = [],
  // projects = [],
  loading = false,
}) => {
  const {
    register,
    watch,
    handleSubmit,
    control,
    formState: { isValid, errors },
  } = useForm({
    mode: "onChange",
    defaultValues: initialData || {
      title: "",
      description: "",
      taskType: "Feature",
      priority: "Medium",
      acceptanceCriteria: [""],
      subtasks: [{ title: "", completed: false }],
      researchQuestions: [{ questions: "" }],
    },
  });

  const {
    fields: acceptanceCriteriaFields,
    append: appendCriteria,
    remove: removeCriteria,
  } = useFieldArray({
    control,
    name: "acceptanceCriteria",
  });

  const {
    fields: subtasksFields,
    append: appendSubtask,
    remove: removeSubtask,
  } = useFieldArray({
    control,
    name: "subtasks",
  });

  const {
    fields: researchQuestionsFields,
    append: appendResearchQuestions,
    remove: removeResearchQuestions,
  } = useFieldArray({
    control,
    name: "researchQuestions",
  });

  const dispatch = useDispatch();
  const listofProjects = useSelector((state) => state.projects.items);
  const users = useSelector((state) => state.users.items);
  // TODO: Setup React Hook Form with useForm hook
  // TODO: Configure defaultValues, validation mode, and form options

  // TODO: Setup useFieldArray for subtasks and acceptance criteria

  // TODO: Watch task type and project changes for dynamic behavior

  // TODO: Filter available users based on selected project

  // TODO: Implement auto-save functionality to localStorage

  // TODO: Restore form data from localStorage on mount

  useEffect(() => {
    dispatch({ type: "FETCH_PROJECTS_REQUEST" });
    dispatch({ type: "FETCH_USERS_REQUEST" });
  }, [dispatch]);

  const selectedProjectId = watch("projectId");

  // Filter assignees based on project
  const listofUsers = React.useMemo(() => {
    if (!selectedProjectId) return users;
    // Find the selected project
    const selectedProject = listofProjects.find(
      (prj) => prj.id === selectedProjectId
    );
    console.log("selectedProject", selectedProject);
    if (!selectedProject || !selectedProject.userIds) return users;
    // Filter users assigned to the selected project
    return users.filter((u) => selectedProject.userIds.includes(u.id));
  }, [selectedProjectId, users, listofProjects]);

  // TODO: Render dynamic fields based on task type
  const renderDynamicFields = () => {
    switch (watch("taskType")) {
      case "Bug":
        return (
          <>
            {/* Severity */}
            <div className="form-group">
              <label>Severity *</label>
              <select
                {...register("severity", { required: "Severity is required" })}
              >
                <option value="">Select Severity</option>
                {BUG_SEVERITIES.map((sev) => (
                  <option key={sev} value={sev}>
                    {sev}
                  </option>
                ))}
              </select>
              {errors.severity && (
                <span className="error-msg">{errors.severity.message}</span>
              )}
            </div>
            <div className="form-group">
              <label>Steps to Reproduce</label>
              <textarea
                {...register("stepsToReproduce", {
                  required: "Provide at least one step",
                })}
                placeholder={`1. Step one 
2. Step two
3. Expected vs actual result`}
                rows={3}
              />
              {errors.stepsToReproduce && (
                <span className="error-msg">
                  {errors.stepsToReproduce.message}
                </span>
              )}
            </div>
          </>
        );
      case "Feature":
        return (
          <>
            {/* Business Value */}
            <div className="form-group">
              <label>Business Value</label>
              <input
                {...register("businessValue", { maxLength: 200 })}
                placeholder="Describe the business impact"
              />
              {errors.businessValue && (
                <span className="error-msg">
                  {errors.businessValue.message}
                </span>
              )}
            </div>
            {/* Acceptance Criteria - Array */}
            <div className="form-group">
              <label>Acceptance Criteria</label>
              {acceptanceCriteriaFields.map((field, idx) => (
                <div
                  key={field.id}
                  className="array-item"
                  style={{ marginBottom: 10 }}
                >
                  <input
                    {...register(`acceptanceCriteria.${idx}`, {
                      required: "Criterion is required",
                    })}
                    style={{ width: "80%" }}
                    placeholder={`Criterion ${idx + 1}`}
                  />
                  <button
                    type="button"
                    onClick={() => removeCriteria(idx)}
                    style={{ marginLeft: 8 }}
                  >
                    Remove
                  </button>
                  {errors.acceptanceCriteria?.[idx] && (
                    <span className="error-msg">
                      {errors.acceptanceCriteria[idx].message}
                    </span>
                  )}
                </div>
              ))}
              <button
                type="button"
                onClick={() => appendCriteria({ value: "" })}
              >
                + Add Criterion
              </button>
            </div>
          </>
        );
      case "Enhancement":
        return (
          <>
            {/* Current Behavior */}
            <div className="form-group">
              <label>Current Behavior</label>
              <textarea
                {...register("currentBehavior")}
                placeholder="How does it work now?"
              />
            </div>
            {/* Proposed Behavior */}
            <div className="form-group">
              <label>Proposed Behavior *</label>
              <textarea
                {...register("proposedBehavior", {
                  required: "Proposed behavior is required",
                })}
                placeholder="Describe the proposed improvement"
              />
              {errors.proposedBehavior && (
                <span className="error-msg">
                  {errors.proposedBehavior.message}
                </span>
              )}
            </div>
          </>
        );
      case "Research":
        return (
          <>
            {/* Research Questions - Array */}
            <div className="form-group">
              <label>Research Questions</label>
              {researchQuestionsFields.map((field, idx) => (
                <div key={field.id} className="array-item">
                  <input
                    {...register(`researchQuestions.${idx}`, {
                      required: "Question is required",
                    })}
                    placeholder={`Question ${idx + 1}`}
                  />
                  <button type="button" onClick={() => removeResearch(idx)}>
                    Remove
                  </button>
                  {errors.researchQuestions?.[idx] && (
                    <span className="error-msg">
                      {errors.researchQuestions[idx].message}
                    </span>
                  )}
                </div>
              ))}
              <button type="button" onClick={() => appendResearch("")}>
                + Add Question
              </button>
            </div>
            {/* Expected Outcomes */}
            <div className="form-group">
              <label>Expected Outcomes *</label>
              <textarea
                {...register("expectedOutcomes", {
                  required: "Expected outcomes is required",
                })}
                placeholder="What do you hope to learn?"
              />
              {errors.expectedOutcomes && (
                <span className="error-msg">
                  {errors.expectedOutcomes.message}
                </span>
              )}
            </div>
          </>
        );
      default:
        return null;
    }
  };

  const onFormSubmit = (data) => {
    onSubmit(data);
  };

  if (!isOpen) return null;

  console.log("mode", mode);

  return (
    <div className="task-form-overlay">
      <div className="task-form">
        <div className="task-form-header">
          <h2>{mode === "create" ? "Create New Task" : "Edit Task"}</h2>
          <button onClick={onClose}>×</button>
        </div>

        <form onSubmit={handleSubmit(onFormSubmit)}>
          {/* TODO: Implement form fields */}

          {/* Basic Fields */}
          <div className="form-group">
            <label>Title *</label>
            <input
              {...register("title", {
                required: "Title is required",
                minLength: { value: 3, message: "Min length is 3" },
              })}
              placeholder="Enter task title"
            />
            {errors.title && (
              <span className="error-msg">{errors.title.message}</span>
            )}
            {/* TODO: Add title input with validation */}
          </div>

          <div className="form-group">
            <label>Task Type *</label>
            <select {...register("taskType", { required: true })}>
              {TASK_TYPES.map((type) => (
                <option value={type} key={type}>
                  {type}
                </option>
              ))}
            </select>
            {/* TODO: Add task type dropdown */}
          </div>

          <div className="form-group">
            <label>Priority *</label>
            <select {...register("priority", { required: true })}>
              {PRIORITIES.map((priority) => (
                <option value={priority} key={priority}>
                  {priority}
                </option>
              ))}
            </select>
            {/* TODO: Add priority dropdown */}
          </div>

          <div className="form-group">
            <label>Project</label>
            <select {...register("projectId")}>
              {listofProjects.map((prj) => (
                <option key={prj.id} value={prj.id}>
                  {prj.name}
                </option>
              ))}
            </select>
            {/* TODO: Add project dropdown */}
          </div>

          <div className="form-group">
            <label>Assignee</label>
            <select {...register("assigneeId")}>
              {listofUsers.map((user) => (
                <option key={user.id} value={user.id}>
                  {user.name}
                </option>
              ))}
            </select>
            {/* TODO: Add assignee dropdown (filtered by project) */}
          </div>

          <div className="form-group">
            <label>Description</label>
            <textarea
              {...register("description", {
                maxLength: { value: 500, message: "Max 500 characters" },
              })}
              placeholder="Enter task description"
              rows={3}
            />
            {errors.description && (
              <span className="error-msg">{errors.description.message}</span>
            )}
            {/* TODO: Add description textarea */}
          </div>

          <div className="form-group">
            <label>Due Date</label>
            <input
              type="date"
              {...register("dueDate", {
                validate: (value) => {
                  // If value is empty, it's valid (optional field)
                  if (!value) return true;
                  // Check if the selected date is today or in the future
                  const selected = new Date(value);
                  const today = new Date();
                  today.setHours(0, 0, 0, 0); // remove time part
                  return selected >= today || "Due date cannot be in the past";
                },
              })}
            />
            {errors.dueDate && (
              <span className="error-msg">{errors.dueDate.message}</span>
            )}
          </div>

          {/* Dynamic Fields */}
          {renderDynamicFields()}

          {/* Subtasks */}
          <div className="form-group">
            <label>Subtasks</label>
            {subtasksFields.map((field, idx) => (
              <div
                key={field.id}
                className="array-item"
                style={{ marginBottom: 10 }}
              >
                <input
                  {...register(`subtasks.${idx}.title`, {
                    required: "Title required",
                    minLength: 2,
                  })}
                  style={{ width: "80%" }}
                  placeholder={`Subtask ${idx + 1}`}
                />
                {/* <input
                  type="checkbox"
                  {...register(`subtasks.${idx}.completed`)}
                  style={{ marginLeft: 8 }}
                />
                <span>Completed</span> */}
                <button
                  type="button"
                  onClick={() => removeSubtask(idx)}
                  style={{ marginLeft: 8 }}
                >
                  Remove
                </button>
                {errors.subtasks?.[idx]?.title && (
                  <span className="error-msg">
                    {errors.subtasks[idx].title.message}
                  </span>
                )}
              </div>
            ))}
            <button
              type="button"
              onClick={() => appendSubtask({ title: "", completed: false })}
              style={{ marginTop: 8 }}
            >
              + Add Subtask
            </button>
          </div>

          {/* Form Actions */}
          <div className="form-actions">
            <button type="button" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" disabled={loading || !isValid}>
              {loading
                ? "Saving..."
                : mode === "create"
                ? "Create Task"
                : "Update Task"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TaskForm;

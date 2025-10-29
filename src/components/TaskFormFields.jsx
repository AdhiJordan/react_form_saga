import React from "react";
import { TASK_TYPES, PRIORITIES, BUG_SEVERITIES } from "../api/mockApi";

const TaskFormFields = ({
  register,
  watch,
  errors,
  control,
  acceptanceCriteriaFields,
  appendCriteria,
  removeCriteria,
  subtasksFields,
  appendSubtask,
  removeSubtask,
  researchQuestionsFields,
  appendResearch,
  removeResearch,
  listofProjects,
  listofUsers,
  renderDynamicFields,
}) => (
  <>
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
    </div>
    <div className="form-group">
      <label>Due Date</label>
      <input
        type="date"
        {...register("dueDate", {
          validate: (value) => {
            if (!value) return true;
            const selected = new Date(value);
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            return selected >= today || "Due date cannot be in the past";
          },
        })}
      />
      {errors.dueDate && (
        <span className="error-msg">{errors.dueDate.message}</span>
      )}
    </div>
    {/* Dynamic Fields (Bug, Feature, etc.) */}
    {renderDynamicFields()}
    {/* Subtasks */}
    <div className="form-group">
      <label>Subtasks</label>
      {subtasksFields.map((field, idx) => (
        <div key={field.id} className="array-item" style={{ marginBottom: 10 }}>
          <input
            {...register(`subtasks.${idx}.title`, {
              required: "Title required",
              minLength: 2,
            })}
            style={{ width: "80%" }}
            placeholder={`Subtask ${idx + 1}`}
          />
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
  </>
);

export default TaskFormFields;

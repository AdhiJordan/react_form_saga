import React, { useEffect } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import TaskFormFields from "./TaskFormFields.jsx";
import { TASK_TYPES, PRIORITIES, BUG_SEVERITIES } from "../api/mockApi";

const TaskForm = ({
  isOpen,
  mode,
  initialData = null,
  onSubmit,
  onClose,
  loading = false,
}) => {
  const {
    register,
    watch,
    handleSubmit,
    control,
    reset,
    formState: { isValid, errors },
  } = useForm({
    mode: "onChange",
    defaultValues: initialData
      ? {
          ...initialData,
          acceptanceCriteria: initialData.acceptanceCriteria?.length
            ? initialData.acceptanceCriteria
            : [""],
          subtasks: initialData.subtasks?.length
            ? initialData.subtasks
            : [{ title: "", completed: false }],
          researchQuestions: initialData.researchQuestions?.length
            ? initialData.researchQuestions
            : [""],
        }
      : {
          title: "",
          description: "",
          taskType: "Feature",
          priority: "Medium",
          acceptanceCriteria: [""],
          subtasks: [{ title: "", completed: false }],
          researchQuestions: [""],
        },
  });

  useEffect(() => {
    if (initialData) {
      reset({
        ...initialData,
        acceptanceCriteria: initialData.acceptanceCriteria?.length
          ? initialData.acceptanceCriteria
          : [""],
        subtasks: initialData.subtasks?.length
          ? initialData.subtasks
          : [{ title: "", completed: false }],
        researchQuestions: initialData.researchQuestions?.length
          ? initialData.researchQuestions
          : [""],
      });
    }
  }, [initialData, reset]);

  const {
    fields: acceptanceCriteriaFields,
    append: appendCriteria,
    remove: removeCriteria,
  } = useFieldArray({ control, name: "acceptanceCriteria" });

  const {
    fields: subtasksFields,
    append: appendSubtask,
    remove: removeSubtask,
  } = useFieldArray({ control, name: "subtasks" });

  const {
    fields: researchQuestionsFields,
    append: appendResearch,
    remove: removeResearch,
  } = useFieldArray({ control, name: "researchQuestions" });

  const dispatch = useDispatch();
  const listofProjects = useSelector((state) => state.projects.items);
  const users = useSelector((state) => state.users.items);

  useEffect(() => {
    dispatch({ type: "FETCH_PROJECTS_REQUEST" });
    dispatch({ type: "FETCH_USERS_REQUEST" });
  }, [dispatch]);

  const selectedProjectId = watch("projectId");
  const listofUsers = React.useMemo(() => {
    if (!selectedProjectId) return users;
    const selectedProject = listofProjects.find(
      (prj) => prj.id === selectedProjectId
    );
    if (!selectedProject || !selectedProject.userIds) return users;
    return users.filter((u) => selectedProject.userIds.includes(u.id));
  }, [selectedProjectId, users, listofProjects]);

  // Dynamic fields logic
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
                    {...register(`acceptanceCriteria.${idx}.${field}`, {
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
                <div
                  key={field.id}
                  className="array-item"
                  style={{ marginBottom: 10 }}
                >
                  <input
                    {...register(`researchQuestions.${idx}.${field}`, {
                      required: "Question is required",
                    })}
                    style={{ width: "80%" }}
                    // placeholder={`Question ${idx + 1}`}
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
              <button
                type="button"
                onClick={() => appendResearch([{ value: "" }])}
              >
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

  const onFormSubmit = (data) => onSubmit(data);

  if (!isOpen) return null;

  return (
    <div className="task-form-overlay">
      <div className="task-form">
        <div className="task-form-header">
          <h2>{mode === "create" ? "Create New Task" : "Edit Task"}</h2>
          <button onClick={onClose}>×</button>
        </div>
        <form onSubmit={handleSubmit(onFormSubmit)}>
          <TaskFormFields
            register={register}
            watch={watch}
            errors={errors}
            control={control}
            acceptanceCriteriaFields={acceptanceCriteriaFields}
            appendCriteria={appendCriteria}
            removeCriteria={removeCriteria}
            subtasksFields={subtasksFields}
            appendSubtask={appendSubtask}
            removeSubtask={removeSubtask}
            researchQuestionsFields={researchQuestionsFields}
            appendResearch={appendResearch}
            removeResearch={removeResearch}
            listofProjects={listofProjects}
            listofUsers={listofUsers}
            renderDynamicFields={renderDynamicFields}
          />
          <div className="form-actions">
            <button type="button" onClick={onClose}>
              Cancel
            </button>
            <button type="submit">
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

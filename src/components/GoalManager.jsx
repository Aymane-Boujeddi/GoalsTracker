import React, { useState, useEffect } from "react";
import "./GoalManager.css";

const GoalManager = () => {
  // State for goals and form inputs
  const [goals, setGoals] = useState(() => {
    const savedGoals = localStorage.getItem("fitnessGoals");
    return savedGoals ? JSON.parse(savedGoals) : [];
  });
  const [newGoal, setNewGoal] = useState({
    title: "",
    target: "",
    category: "steps",
    unit: "pas",
  });
  const [editingGoalId, setEditingGoalId] = useState(null);
  const [progressInput, setProgressInput] = useState({ goalId: "", value: "" });

  // Categories and their units
  const categories = [
    { id: "steps", name: "Pas", unit: "pas" },
    { id: "water", name: "Hydratation", unit: "verres" },
    { id: "workout", name: "Entraînement", unit: "séances" },
    { id: "sleep", name: "Sommeil", unit: "heures" },
  ];

  // Save goals to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem("fitnessGoals", JSON.stringify(goals));
  }, [goals]);

  // Add a new goal
  const handleAddGoal = (e) => {
    e.preventDefault();

    if (editingGoalId) {
      // Update existing goal
      setGoals(
        goals.map((goal) =>
          goal.id === editingGoalId
            ? {
                ...goal,
                title: newGoal.title,
                target: parseInt(newGoal.target),
                category: newGoal.category,
                unit: newGoal.unit,
              }
            : goal
        )
      );
      setEditingGoalId(null);
    } else {
      // Add new goal
      const selectedCategory = categories.find(
        (cat) => cat.id === newGoal.category
      );
      const goal = {
        id: Date.now().toString(),
        title: newGoal.title,
        target: parseInt(newGoal.target),
        category: newGoal.category,
        unit: selectedCategory.unit,
        progress: 0,
        history: [],
        createdAt: new Date().toISOString(),
      };
      setGoals([...goals, goal]);
    }

    // Reset form
    setNewGoal({ title: "", target: "", category: "steps", unit: "pas" });
  };

  // Start editing a goal
  const handleEdit = (goal) => {
    setNewGoal({
      title: goal.title,
      target: goal.target.toString(),
      category: goal.category,
      unit: goal.unit,
    });
    setEditingGoalId(goal.id);
  };

  // Delete a goal
  const handleDelete = (id) => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer cet objectif?")) {
      setGoals(goals.filter((goal) => goal.id !== id));
    }
  };

  // Update progress for a goal
  const handleProgressUpdate = (e) => {
    e.preventDefault();

    const { goalId, value } = progressInput;
    const progressValue = parseInt(value);

    if (!goalId || isNaN(progressValue)) return;

    setGoals(
      goals.map((goal) => {
        if (goal.id === goalId) {
          const today = new Date().toISOString().split("T")[0];
          const newHistory = [
            ...goal.history,
            { date: today, value: progressValue },
          ];
          const newProgress = goal.progress + progressValue;

          return {
            ...goal,
            progress: newProgress,
            history: newHistory,
          };
        }
        return goal;
      })
    );

    setProgressInput({ goalId: "", value: "" });
  };

  // Calculate performance summary
  const calculateSummary = () => {
    const totalGoals = goals.length;
    const completedGoals = goals.filter(
      (goal) => goal.progress >= goal.target
    ).length;
    const completionRate =
      totalGoals > 0 ? Math.round((completedGoals / totalGoals) * 100) : 0;

    // Calculate progress by category
    const categoryProgress = {};
    categories.forEach((cat) => {
      const catGoals = goals.filter((goal) => goal.category === cat.id);
      if (catGoals.length > 0) {
        const totalProgress = catGoals.reduce((sum, goal) => {
          return sum + (goal.progress / goal.target) * 100;
        }, 0);
        categoryProgress[cat.id] = Math.round(totalProgress / catGoals.length);
      } else {
        categoryProgress[cat.id] = 0;
      }
    });

    return { totalGoals, completedGoals, completionRate, categoryProgress };
  };

  const summary = calculateSummary();

  // Get goals for the current week
  const getWeeklyGoals = () => {
    const now = new Date();
    const startOfWeek = new Date(now.setDate(now.getDate() - now.getDay()));
    startOfWeek.setHours(0, 0, 0, 0);

    return goals.filter((goal) => {
      const goalDate = new Date(goal.createdAt);
      return goalDate >= startOfWeek;
    });
  };

  const weeklyGoals = getWeeklyGoals();
  const weeklyCompleted = weeklyGoals.filter(
    (goal) => goal.progress >= goal.target
  ).length;

  return (
    <div className="goal-manager">
      <section className="goal-form-container">
        <h2>{editingGoalId ? "Modifier Objectif" : "Ajouter un Objectif"}</h2>
        <form onSubmit={handleAddGoal} className="goal-form">
          <div className="form-group">
            <input
              type="text"
              placeholder="Ex: Marcher 10 000 pas"
              value={newGoal.title}
              onChange={(e) =>
                setNewGoal({ ...newGoal, title: e.target.value })
              }
              required
            />
          </div>

          <div className="form-group">
            <input
              type="number"
              placeholder="Cible (ex: 10000)"
              value={newGoal.target}
              onChange={(e) =>
                setNewGoal({ ...newGoal, target: e.target.value })
              }
              required
            />
          </div>

          <div className="form-group">
            <select
              value={newGoal.category}
              onChange={(e) => {
                const selectedCat = categories.find(
                  (cat) => cat.id === e.target.value
                );
                setNewGoal({
                  ...newGoal,
                  category: e.target.value,
                  unit: selectedCat.unit,
                });
              }}
            >
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          <button type="submit" className="btn-primary">
            {editingGoalId ? "Mettre à jour" : "Ajouter"}
          </button>

          {editingGoalId && (
            <button
              type="button"
              className="btn-secondary"
              onClick={() => {
                setEditingGoalId(null);
                setNewGoal({
                  title: "",
                  target: "",
                  category: "steps",
                  unit: "pas",
                });
              }}
            >
              Annuler
            </button>
          )}
        </form>
      </section>

      <section className="progress-update-container">
        <h2>Saisir un Progrès</h2>
        <form onSubmit={handleProgressUpdate} className="progress-form">
          <div className="form-group">
            <select
              value={progressInput.goalId}
              onChange={(e) =>
                setProgressInput({ ...progressInput, goalId: e.target.value })
              }
              required
            >
              <option value="">Sélectionner un objectif</option>
              {goals.map((goal) => (
                <option key={goal.id} value={goal.id}>
                  {goal.title}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <input
              type="number"
              placeholder="Quantité"
              value={progressInput.value}
              onChange={(e) =>
                setProgressInput({ ...progressInput, value: e.target.value })
              }
              required
            />
          </div>

          <button type="submit" className="btn-primary">
            Enregistrer Progrès
          </button>
        </form>
      </section>

      <section className="goals-list-container">
        <h2>Objectifs Actifs</h2>
        {goals.length === 0 ? (
          <p className="empty-state">
            Aucun objectif enregistré. Commencez par ajouter un objectif!
          </p>
        ) : (
          <div className="goals-list">
            {goals.map((goal) => {
              const progressPercentage = Math.min(
                100,
                Math.round((goal.progress / goal.target) * 100)
              );
              return (
                <div key={goal.id} className="goal-item">
                  <div className="goal-header">
                    <h3>{goal.title}</h3>
                    <div className="goal-actions">
                      <button
                        className="btn-edit"
                        onClick={() => handleEdit(goal)}
                      >
                        <span role="img" aria-label="Edit">
                          ✏️
                        </span>
                      </button>
                      <button
                        className="btn-delete"
                        onClick={() => handleDelete(goal.id)}
                      >
                        <span role="img" aria-label="Delete">
                          🗑️
                        </span>
                      </button>
                    </div>
                  </div>
                  <div className="goal-details">
                    <p>
                      <strong>Catégorie:</strong>{" "}
                      {categories.find((cat) => cat.id === goal.category)?.name}
                    </p>
                    <p>
                      <strong>Progrès:</strong> {goal.progress} / {goal.target}{" "}
                      {goal.unit}
                    </p>
                  </div>
                  <div className="progress-bar-container">
                    <div
                      className={`progress-bar ${
                        progressPercentage >= 100 ? "complete" : ""
                      }`}
                      style={{ width: `${progressPercentage}%` }}
                    ></div>
                  </div>
                  <div className="progress-percentage">
                    {progressPercentage}%
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      <section className="summary-container">
        <h2>Résumé des Performances</h2>
        <div className="summary-cards">
          <div className="summary-card">
            <h3>Cette Semaine</h3>
            <p>
              {weeklyCompleted} / {weeklyGoals.length} objectifs atteints
            </p>
          </div>
          <div className="summary-card">
            <h3>Taux de Complétion</h3>
            <p>{summary.completionRate}% des objectifs atteints</p>
          </div>
          <div className="summary-card">
            <h3>Objectifs Totaux</h3>
            <p>
              {summary.completedGoals} / {summary.totalGoals} complétés
            </p>
          </div>
        </div>

        <h3>Progression par Catégorie</h3>
        <div className="category-progress">
          {categories.map((cat) => (
            <div key={cat.id} className="category-item">
              <span>{cat.name}</span>
              <div className="category-progress-bar-container">
                <div
                  className="category-progress-bar"
                  style={{ width: `${summary.categoryProgress[cat.id]}%` }}
                ></div>
              </div>
              <span>{summary.categoryProgress[cat.id]}%</span>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default GoalManager;

import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getAssignments } from "../services/api";

function AssignmentList() {
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    getAssignments()
      .then((data) => {
        setAssignments(data);
        setLoading(false);
      })
      .catch(() => {
        setError("Failed to load assignments.");
        setLoading(false);
      });
  }, []);

  if (loading) return <p className="status-text">Loading assignments...</p>;
  if (error) return <p className="status-text status-text--error">{error}</p>;

  return (
    <div className="assignment-list">
      <h1 className="assignment-list__title">SQL Assignments</h1>

      {assignments.length === 0 ? (
        <p className="status-text">No assignments found.</p>
      ) : (
        <ul className="assignment-list__items">
          {assignments.map((assignment) => (
            <li key={assignment._id} className="assignment-card">
              <h2 className="assignment-card__title">{assignment.title}</h2>
              <p className="assignment-card__description">
                {assignment.description}
              </p>
              <span className={`assignment-card__badge assignment-card__badge--${assignment.difficulty.toLowerCase()}`}>
                {assignment.difficulty}
              </span>
              <Link
                to={`/assignments/${assignment._id}`}
                className="assignment-card__link"
              >
                Start Assignment
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default AssignmentList;

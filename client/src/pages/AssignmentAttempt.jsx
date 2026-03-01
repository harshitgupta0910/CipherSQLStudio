import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Editor from "@monaco-editor/react";
import { getAssignmentById, executeQuery, getHint, saveAttempt, getAttempts } from "../services/api";
import ResultTable from "../components/ResultTable";

function AssignmentAttempt() {
  const { id } = useParams();

  const [assignment, setAssignment] = useState(null);
  const [sqlQuery, setSqlQuery] = useState("SELECT ");
  const [results, setResults] = useState(null);
  const [queryError, setQueryError] = useState(null);
  const [hint, setHint] = useState(null);
  const [loadingHint, setLoadingHint] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [attempts, setAttempts] = useState([]);

  useEffect(() => {
    Promise.all([getAssignmentById(id), getAttempts(id)])
      .then(([assignmentData, attemptsData]) => {
        setAssignment(assignmentData);
        setAttempts(attemptsData);
        setLoading(false);
      })
      .catch(() => {
        setError("Failed to load assignment.");
        setLoading(false);
      });
  }, [id]);

  const handleRunQuery = async () => {
    setQueryError(null);
    setResults(null);

    try {
      const data = await executeQuery(sqlQuery);
      setResults(data.rows);

      await saveAttempt(id, sqlQuery, "success", null, data.rows.length);
      const updated = await getAttempts(id);
      setAttempts(updated);
    } catch (err) {
      const message =
        err.response?.data?.error || "Something went wrong running the query.";
      setQueryError(message);

      await saveAttempt(id, sqlQuery, "error", message, 0).catch(() => {});
      const updated = await getAttempts(id).catch(() => attempts);
      setAttempts(updated);
    }
  };

  const handleGetHint = async () => {
    setLoadingHint(true);
    setHint(null);

    try {
      const data = await getHint(assignment.description, sqlQuery);
      setHint(data.hint);
    } catch {
      setHint("Could not get a hint right now. Try again later.");
    } finally {
      setLoadingHint(false);
    }
  };

  if (loading) return <p className="status-text">Loading assignment...</p>;
  if (error) return <p className="status-text status-text--error">{error}</p>;

  return (
    <div className="attempt">
      <div className="attempt__header">
        <h1 className="attempt__title">{assignment.title}</h1>
        <p className="attempt__description">{assignment.description}</p>
        <span className={`assignment-card__badge assignment-card__badge--${assignment.difficulty.toLowerCase()}`}>
          {assignment.difficulty}
        </span>
        {assignment.relatedTables.length > 0 && (
          <p className="attempt__tables">
            Tables: <strong>{assignment.relatedTables.join(", ")}</strong>
          </p>
        )}
      </div>

      <div className="attempt__editor">
        <Editor
          height="250px"
          defaultLanguage="sql"
          value={sqlQuery}
          onChange={(value) => setSqlQuery(value || "")}
          theme="vs-dark"
          options={{
            minimap: { enabled: false },
            fontSize: 14,
          }}
        />
      </div>

      <div className="attempt__actions">
        <button className="btn btn--primary" onClick={handleRunQuery}>
          Run Query
        </button>
        <button
          className="btn btn--secondary"
          onClick={handleGetHint}
          disabled={loadingHint}
        >
          {loadingHint ? "Getting hint..." : "Get Hint"}
        </button>
      </div>

      {queryError && (
        <p className="status-text status-text--error">{queryError}</p>
      )}

      {hint && (
        <div className="attempt__hint">
          <strong>Hint:</strong> {hint}
        </div>
      )}

      {results !== null && <ResultTable rows={results} />}

      {/* Past Attempts */}
      {attempts.length > 0 && (
        <div className="attempt-history">
          <h3 className="attempt-history__title">Your Previous Attempts</h3>
          <ul className="attempt-history__list">
            {attempts.map((a) => (
              <li key={a._id} className={`attempt-history__item attempt-history__item--${a.status}`}>
                <div className="attempt-history__meta">
                  <span className={`attempt-history__badge attempt-history__badge--${a.status}`}>
                    {a.status === "success" ? `Success (${a.rowCount} rows)` : "Error"}
                  </span>
                  <span className="attempt-history__time">
                    {new Date(a.createdAt).toLocaleString()}
                  </span>
                </div>
                <code className="attempt-history__query">{a.query}</code>
                {a.status === "error" && a.errorMessage && (
                  <p className="attempt-history__error">{a.errorMessage}</p>
                )}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default AssignmentAttempt;

// === src/pages/dashboard/ReviewerDashboard.jsx ===
import { useFetchAllSummariesQuery } from "../../api/EditorApi";

export default function ReviewerDashboard() {
  const { data: summaries, isLoading } = useFetchAllSummariesQuery();

  if (isLoading) return <p className="text-center mt-6">Loading summaries...</p>;

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">🔍 Reviewer Dashboard</h2>
      <p className="text-gray-600 mb-6">Viewing all submitted summaries (read-only)</p>

      {summaries?.length === 0 ? (
        <p className="text-gray-500">No summaries found.</p>
      ) : (
        <ul className="space-y-4">
          {summaries.map((summary) => (
            <li key={summary._id} className="border p-4 rounded shadow-sm bg-white">
              <div className="text-sm text-gray-600 mb-2">
                <strong>Date:</strong> {new Date(summary.createdAt).toLocaleString()}<br />
                <strong>User:</strong> {summary.owner?.name || "Unknown"} ({summary.owner?.email || "-"})<br />
                <strong>Word Count:</strong> {summary.wordCount || "-"}
              </div>
              <p className="text-gray-800 whitespace-pre-wrap">{summary.summaryText}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
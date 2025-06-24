// === src/pages/dashboard/EditorDashboard.jsx ===
import {
  useFetchAllSummariesQuery,
  useUpdateSummaryMutation,
  useDeleteSummaryMutation,
} from "../../api/EditorApi";

export default function EditorDashboard() {
  const { data: summaries, isLoading } = useFetchAllSummariesQuery();
  const [updateSummary] = useUpdateSummaryMutation();
  const [deleteSummary] = useDeleteSummaryMutation();

  const handleEdit = async (summary) => {
    const updated = prompt("Edit summary:", summary.summaryText);
    if (updated && updated !== summary.summaryText) {
      try {
        await updateSummary({ id: summary._id, summaryText: updated });
        alert("Summary updated");
      } catch (err) {
        alert("Update failed");
      }
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this summary?")) {
      try {
        await deleteSummary(id);
        alert("Deleted");
      } catch (err) {
        alert("Delete failed");
      }
    }
  };

  if (isLoading) return <p>Loading summaries...</p>;

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">✏️ Editor Dashboard</h2>
      {summaries?.length === 0 ? (
        <p>No summaries found.</p>
      ) : (
        <ul className="space-y-4">
          {summaries?.map((s) => (
            <li key={s._id} className="border p-4 rounded shadow-sm">
              <p className="text-sm text-gray-600">
                <strong>User:</strong> {s.owner?.name || "Unknown"} ({s.owner?.email || "No email"})<br />
                <strong>Date:</strong> {new Date(s.createdAt).toLocaleString()}<br />
                <strong>Word Count:</strong> {s.wordCount || "-"}
              </p>
              <p className="mt-2 whitespace-pre-wrap">{s.summaryText}</p>
              <div className="mt-3 flex space-x-2">
                <button
                  onClick={() => handleEdit(s)}
                  className="px-3 py-1 text-sm bg-blue-600 text-white rounded"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(s._id)}
                  className="px-3 py-1 text-sm bg-red-600 text-white rounded"
                >
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

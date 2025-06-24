import { Navigate, Link } from "react-router-dom";
import {
  useFetchMeQuery,
  useFetchSummariesQuery,
  useDeleteSummaryMutation,
  useUpdateSummaryMutation,
} from "../../api/AuthSlice";

export default function Dashboard() {
  const { data: user, isLoading: loadingUser } = useFetchMeQuery();
  const { data: summaries, isLoading: loadingSummaries } = useFetchSummariesQuery();

  const [deleteSummary] = useDeleteSummaryMutation();
  const [updateSummary] = useUpdateSummaryMutation();

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this summary?")) {
      try {
        await deleteSummary(id).unwrap();
      } catch (err) {
        console.error("Failed to delete:", err);
      }
    }
  };

  const handleEdit = async (summary) => {
    const newText = prompt("Edit summary text:", summary.summaryText);
    if (!newText || newText === summary.summaryText) return;
    try {
      await updateSummary({ id: summary._id, summaryText: newText }).unwrap();
    } catch (err) {
      console.error("Update failed:", err);
    }
  };

  if (loadingUser || loadingSummaries) {
    return <p>Loading...</p>;
  }

  if (!user) return <Navigate to="/login" />;


  if (user.role === "admin") return <Navigate to="/admin" />;
  if (user.role === "editor") return <Navigate to="/editor" />;
  if (user.role === "reviewer") return <Navigate to="/reviewer" />;

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="flex justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Welcome, {user.name}</h1>
            <div className="flex items-center space-x-4 mt-2">
              <span className="px-3 py-1 bg-gray-100 text-gray-800 rounded-full text-sm font-medium">
                {user.role}
              </span>
              {/*  Only for users */}
              {user.role === "user" && (
                <span className="px-3 py-1 bg-indigo-100 text-indigo-800 rounded-full text-sm font-medium">
                  Credits: {user.credits}
                </span>
              )}
            </div>
          </div>
          {user.role === "user" && (
            <Link
              to="/summarize"
              className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition"
            >
              + Create Summary
            </Link>
          )}
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Your Summaries</h2>

        {summaries?.length === 0 ? (
          <p>No summaries found.</p>
        ) : (
          <div className="space-y-4">
            {summaries.map((summary) => (
              <div key={summary._id} className="border p-4 rounded-md shadow-sm">
                <div className="flex justify-between">
                  <div>
                    <p className="text-sm text-gray-600">
                      {new Date(summary.createdAt).toLocaleString()}
                    </p>
                    <p className="mt-1 text-gray-800">
                      {summary.summaryText.slice(0, 150)}...
                    </p>
                  </div>

                  {/* Delete only if owner === user */}
                  {user._id === summary.owner && (
                    <div className="flex gap-2">
                      <button onClick={() => handleEdit(summary)} title="Edit">
                        ✏️
                      </button>
                      <button onClick={() => handleDelete(summary._id)} title="Delete">
                        🗑️
                      </button>
                    </div>
                  )}
                </div>
                <Link
                  to={`/summary/${summary._id}`}
                  className="text-sm text-indigo-600 hover:underline mt-2 inline-block"
                >
                  View Full →
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

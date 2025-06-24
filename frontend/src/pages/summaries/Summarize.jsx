import { useState, useEffect } from "react";
import {
  useGetSummaryStatusQuery,
  useQueueSummaryMutation,
} from "../../api/AuthSlice";

export default function Summarize() {
  const [inputText, setInputText] = useState("");
  const [file, setFile] = useState(null);
  const [fileName, setFileName] = useState("");
  const [jobId, setJobId] = useState(null);
  const [error, setError] = useState(null);
  const [customPrompt, setCustomPrompt] = useState("");

  const [queueSummary, { isLoading }] = useQueueSummaryMutation();

  const {
    data: statusData,
    error: statusError,
    isLoading: isStatusLoading,
  } = useGetSummaryStatusQuery(jobId, {
    skip: !jobId,
    pollingInterval: 3000,
    refetchOnMountOrArgChange: true,
  });

  useEffect(() => {
    if (statusError) {
      console.error("Polling failed:", statusError);
    }
  }, [jobId, statusData, statusError]);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      setFileName(selectedFile.name);
    }
  };

const handleSubmit = async (e) => {
  e.preventDefault();
  setError(null);

  if (!inputText.trim() && !file) {
    setError("Please provide text or a file to summarize.");
    return;
  }

  const formData = new FormData();
  if (inputText.trim()) formData.append("inputText", inputText);
  if (customPrompt.trim()) formData.append("prompt", customPrompt);
  if (file) formData.append("file", file);


  if (jobId) {
    formData.append("isReedit", true);
    formData.append("originalJobId", jobId);
  }

  try {
    const res = await queueSummary(formData).unwrap();
    setJobId(res.jobId);
  } catch (err) {
    setError(
      err.data?.message || "Failed to queue summary. Please try again."
    );
  }
};


  const resetForm = () => {
    setInputText("");
    setFile(null);
    setFileName("");
    setCustomPrompt("");
    setJobId(null);
    setError(null);
  };

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">
        Content Summarization
      </h2>

      {!jobId ? (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Text to summarize
            </label>
            <textarea
              rows={6}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="Paste your content here..."
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Custom Prompt (optional)
            </label>
            <input
              type="text"
              value={customPrompt}
              onChange={(e) => setCustomPrompt(e.target.value)}
              placeholder="E.g., Summarize in 3 bullet points"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div className="flex items-center space-x-4">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Or upload a file
              </label>
              <div className="flex items-center">
                <label className="cursor-pointer bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                  Choose File
                  <input
                    type="file"
                    className="sr-only"
                    onChange={handleFileChange}
                  />
                </label>
                <span className="ml-3 text-sm text-gray-500 truncate max-w-xs">
                  {fileName || "No file chosen"}
                </span>
              </div>
            </div>
          </div>

          {error && (
            <div className="p-3 bg-red-50 text-red-600 rounded-md text-sm">
              {error}
            </div>
          )}

          <div className="flex justify-end space-x-3 pt-2">
            <button
              type="submit"
              disabled={isLoading}
              className={`px-4 py-2 rounded-md text-white font-medium ${
                isLoading
                  ? "bg-indigo-400"
                  : "bg-indigo-600 hover:bg-indigo-700"
              } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500`}
            >
              {isLoading ? (
                <span className="flex items-center">
                  <svg
                    className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Processing...
                </span>
              ) : (
                "Summarize Content"
              )}
            </button>
          </div>
        </form>
      ) : (
        <div className="space-y-4">
          <div className="p-4 bg-gray-50 rounded-md">
            <div className="flex justify-between items-center mb-2">
              <h3 className="font-medium text-gray-700">
                Job ID:{" "}
                <span className="font-mono text-indigo-600">{jobId}</span>
              </h3>
              <span
                className={`px-2 py-1 text-xs rounded-full ${
                  statusData?.state === "completed"
                    ? "bg-green-100 text-green-800"
                    : statusData?.state === "failed"
                    ? "bg-red-100 text-red-800"
                    : "bg-blue-100 text-blue-800"
                }`}
              >
                {isStatusLoading ? "Checking..." : statusData?.state}
              </span>
            </div>

            {statusData?.state === "completed" &&
              statusData?.result?.summaryText && (
                <>
                  <div className="mt-4">
                    <h4 className="font-medium text-gray-700 mb-2">Summary:</h4>
                    <div className="p-3 bg-white border border-gray-200 rounded-md">
                      <p className="text-gray-800 whitespace-pre-line">
                        {statusData.result.summaryText}
                      </p>
                    </div>
                  </div>
                  <div className="mt-4 flex justify-end">
                    <button
                      onClick={() => {
                        setInputText(statusData.result.inputText); // assuming backend returns this
                        setCustomPrompt(statusData.result.prompt || "");
                        setJobId(statusData.result.jobId); // reuse jobId
                      }}
                      className="px-4 py-2 bg-yellow-500 text-white rounded-md hover:bg-yellow-600"
                    >
                       Re-edit and Resubmit
                    </button>
                  </div>
                </>
              )}

            {statusData?.state === "failed" && (
              <div className="mt-4 p-3 bg-red-50 text-red-600 rounded-md text-sm">
                Summarization failed. Please try again.
              </div>
            )}
          </div>

          <button
            onClick={resetForm}
            className="mt-4 px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Start New Summary
          </button>
        </div>
      )}
    </div>
  );
}

import { useState } from "react";
import {
  useGetAllUsersQuery,
  useRechargeCreditsMutation,
} from "../../api/AuthSlice";

export default function AdminPanel() {
  const { data: users, isLoading, refetch } = useGetAllUsersQuery();
  const [rechargeCredits] = useRechargeCreditsMutation();
  const [amounts, setAmounts] = useState({});
  const [feedback, setFeedback] = useState({});
  const [searchTerm, setSearchTerm] = useState("");

  const handleRecharge = async (userId) => {
    const amount = parseInt(amounts[userId]);
    if (!amount || amount <= 0) {
      setFeedback((prev) => ({ ...prev, [userId]: "Enter a valid amount" }));
      return;
    }

    try {
      await rechargeCredits({ userId, amount }).unwrap();
      setFeedback((prev) => ({ ...prev, [userId]: "Credits added successfully!" }));
      setAmounts((prev) => ({ ...prev, [userId]: "" }));
      setTimeout(() => {
        setFeedback((prev) => ({ ...prev, [userId]: "" }));
      }, 3000);
      refetch(); // Refresh user data
    } catch (err) {
      setFeedback((prev) => ({ ...prev, [userId]: "Failed to recharge" }));
      setTimeout(() => {
        setFeedback((prev) => ({ ...prev, [userId]: "" }));
      }, 3000);
    }
  };

  // Filter only regular users (exclude admins, editors, reviewers)
  const filteredUsers = users?.filter(
    (user) =>
      user.role === "user" &&
      (user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  if (isLoading)
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-800"> Admin Dashboard</h2>
          <div className="mt-4 md:mt-0">
            <input
              type="text"
              placeholder="Search users..."
              className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Credits</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredUsers?.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-6 py-4 text-center text-gray-500">
                    No users found
                  </td>
                </tr>
              ) : (
                filteredUsers?.map((user) => (
                  <tr key={user._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-medium">
                          {user.name.charAt(0).toUpperCase()}
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{user.name}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.email}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs rounded-full bg-green-100 text-green-800`}>
                        {user.role}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <span className="font-medium">{user.credits}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center space-x-2">
                        <input
                          type="number"
                          placeholder="Amount"
                          min="1"
                          className="w-20 px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-500"
                          value={amounts[user._id] || ""}
                          onChange={(e) =>
                            setAmounts((prev) => ({
                              ...prev,
                              [user._id]: e.target.value,
                            }))
                          }
                        />
                        <button
                          onClick={() => handleRecharge(user._id)}
                          className="px-3 py-1 bg-indigo-600 text-white text-sm rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                        >
                          Add
                        </button>
                      </div>
                      {feedback[user._id] && (
                        <div className={`mt-1 text-xs ${
                          feedback[user._id].includes("Failed") ? 'text-red-500' : 'text-green-500'
                        }`}>
                          {feedback[user._id]}
                        </div>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

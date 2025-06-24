import React, { useEffect } from "react";
import { useFetchMeQuery } from "../api/AuthSlice";
import { Link } from "react-router-dom";

const Navbar = () => {
  const { data, isLoading } = useFetchMeQuery();

  if (isLoading) return <h1>Loading</h1>;
  return (
    <nav className="bg-white border-b border-gray-200 py-4 px-6">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <Link to={data ? "/dashboard" : "/login"}>
          <div className="text-xl font-bold text-indigo-600 cursor-pointer">
            SmartBrief-Ai
          </div>
        </Link>

        <div className="flex items-center space-x-4">
          {data ? (
            <>
              <div className="flex items-center space-x-2">
                <div className="h-8 w-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-medium">
                  {data.name.charAt(0).toUpperCase()}
                </div>
                <span className="font-medium text-gray-700">{data.name}</span>
              </div>
              <div className="px-3 py-1 bg-gray-100 rounded-full text-sm font-medium text-gray-800">
                Credits: {data.credits}
              </div>
            </>
          ) : (
            <div className="flex space-x-3">
              <button className="px-4 py-2 text-gray-600 hover:text-gray-900 font-medium">
                Login
              </button>
              <button className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 font-medium">
                Sign Up
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

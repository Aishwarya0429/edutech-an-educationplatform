import React from "react";
import { Link } from "react-router-dom";

const Error = () => {
  return (
    <div className="flex flex-1 flex-col justify-center items-center py-32 text-center">
      <h1 className="text-4xl font-bold text-richblack-5">404 - Page Not Found</h1>
      <p className="mt-4 text-richblack-300">
        The page you are looking for does not exist or has been moved.
      </p>
      <Link
        to="/"
        className="mt-8 rounded-md bg-yellow-50 px-6 py-3 font-semibold text-richblack-900 transition-all duration-200 hover:scale-95"
      >
        Back to Home
      </Link>
    </div>
  );
};

export default Error;

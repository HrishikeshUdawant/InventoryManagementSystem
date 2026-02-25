import React, { useContext } from "react";
import { AuthContext } from "./AuthContext";

export default function ProtectedRoute({ children }) {
  const { isAuthenticated } = useContext(AuthContext);

  if (!isAuthenticated) {
    return (
      <div>
        <h2>Please login to access the system.</h2>
      </div>
    );
  }

  return children;
}

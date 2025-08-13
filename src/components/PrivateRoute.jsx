import React from 'react';
import { Navigate } from 'react-router-dom';

// Simple route guard checking for authenticated user and optional roles
export default function PrivateRoute({ user, roles = [], element }) {
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  if (roles.length && !roles.includes(user.role)) {
    return <Navigate to="/" replace />;
  }
  return element;
}

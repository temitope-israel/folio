// ProtectedRoute.tsx
// A wrapper component that checks if the user is logged in.
// If not, redirects to the login page.
// Wrap any route you want to protect with this component.

import { Navigate } from "react-router-dom";
// Navigate → renders a redirect — like navigate() but as JSX
import { isAuthenticated } from "@/lib/api";

interface ProtectedRouteProps {
  children: React.ReactNode;
  // children → the component to render if authenticated
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  if (!isAuthenticated()) {
    return <Navigate to="/admin/login" replace />;
    // replace → replaces the current history entry instead of adding a new one
    // So pressing the back button doesn't bring them back to the protected page
  }

  return <>{children}</>;
  // If authenticated, render the protected content normally
}
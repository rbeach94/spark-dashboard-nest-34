
import { Navigate, useLocation } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Loader2 } from "lucide-react";

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAdmin?: boolean;
}

const ProtectedRoute = ({ children, requireAdmin = false }: ProtectedRouteProps) => {
  const location = useLocation();
  
  const { data: session } = useQuery({
    queryKey: ["session"],
    queryFn: async () => {
      const { data: { session } } = await supabase.auth.getSession();
      return session;
    },
  });

  const { data: userRole, isLoading } = useQuery({
    queryKey: ["userRole", session?.user?.id],
    queryFn: async () => {
      if (!session?.user?.id) return null;
      
      const { data: roles } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", session.user.id)
        .single();
      
      return roles?.role;
    },
    enabled: !!session?.user?.id,
  });

  if (!session) {
    return <Navigate to="/login" replace />;
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  // Check if this is an admin accessing a profile
  const isProfileRoute = location.pathname.startsWith('/profile/');
  const isAdminAccess = new URLSearchParams(location.search).get('admin') === 'true';
  
  // Allow admin access to any profile
  if (isProfileRoute && isAdminAccess && userRole === 'admin') {
    return <div className="page-transition">{children}</div>;
  }

  if (requireAdmin && userRole !== "admin") {
    return <Navigate to="/dashboard" replace />;
  }

  return <div className="page-transition">{children}</div>;
};

export default ProtectedRoute;

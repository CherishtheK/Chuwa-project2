// TODO: 根据 useAuth() 判断是否登录 + role 是否匹配，不匹配就 <Navigate to="/login" />
import type { ReactNode } from "react";
interface ProtectedRouteProps {
  children: ReactNode;
  role?: "employee" | "hr";
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  return <>{children}</>;
}

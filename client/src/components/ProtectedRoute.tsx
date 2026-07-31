// TODO: 根据 useAuth() 判断是否登录 + role 是否匹配，不匹配就 <Navigate to="/login" />
import { Navigate } from "react-router-dom";
import { useQuery } from "@apollo/client/react";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { ME_QUERY } from "./graphql/ProtectedRouteQueries";
import { setCredentials, logout } from "../features/auth/authSlice";

interface MeResult {
  me: {
    id: string;
    userName: string;
    role: string;
  } | null;
}

interface Props {
  role: "employee" | "hr";
  children: React.ReactNode;
}

export default function ProtectedRoute({ role, children }: Props) {
  const dispatch = useDispatch();
  const token = localStorage.getItem("token");

  const { data, loading, error } = useQuery<MeResult>(ME_QUERY, {
    skip: !token,
    fetchPolicy: "network-only",
  });

  useEffect(() => {
    if (data?.me && token) {
      dispatch(setCredentials({ user: data.me, token }));
    }
    if (error) {
      localStorage.removeItem("token");
      dispatch(logout());
    }
  }, [data, error, token, dispatch]);

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error || !data?.me) {
    return <Navigate to="/login" replace />;
  }

  if (data.me.role !== role) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}
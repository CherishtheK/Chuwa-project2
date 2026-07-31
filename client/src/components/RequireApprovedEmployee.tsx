import { Navigate, Outlet } from "react-router-dom";
import { useQuery } from "@apollo/client/react";
import { MY_ONBOARDING_APPLICATION_QUERY } from "../features/onboarding/graphql/onboardingQueries";
import type { MyOnboardingApplicationResult } from "../types/onboarding";


export default function RequireApprovedEmployee() {
  const { data, loading } = useQuery<MyOnboardingApplicationResult>(
    MY_ONBOARDING_APPLICATION_QUERY,
  );

  if (loading) return <p>Loading...</p>;

  const status = data?.myOnboardingApplication?.status;

  if (status !== "APPROVED") {
    return <Navigate to="/onboarding" replace />;
  }

  return <Outlet />;
}

import { useQuery } from "@apollo/client/react";
import { Navigate } from "react-router-dom";
import { MY_ONBOARDING_APPLICATION_QUERY } from "./graphql/onboardingQueries";
import OnboardingForm from "./OnboardingForm";
import type { MyOnboardingApplicationResult } from "../../types/onboarding";
import PendingView from "./PendingView";



export default function OnboardingApplicationPage() {
  const { data, loading } = useQuery<MyOnboardingApplicationResult>(
    MY_ONBOARDING_APPLICATION_QUERY,
  );

  if (loading) return <p>Loading...</p>;

  const application = data?.myOnboardingApplication;

  if (application?.status === "APPROVED") {
    return <Navigate to="/" replace />;
  }

  if (application?.status === "PENDING") {
    return <PendingView application={application} />;
  }

  return (
    <div>
      <h1>Onboarding Application</h1>
      <p className="mb-6 text-sm text-gray-500">
        Fill in your details below. Fields marked * are required.
      </p>
      <OnboardingForm existingApplication={application} />
    </div>
  );
}
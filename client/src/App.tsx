import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute";

import LoginPage from "./features/auth/LoginPage";
import RegistrationPage from "./features/auth/RegistrationPage";
import OnboardingApplicationPage from "./features/onboarding/OnboardingApplicationPage";
import PersonalInformationPage from "./features/personalInfo/PersonalInformationPage";
import EmployeeHomePage from "./features/home/EmployeeHomePage";

import HRHomePage from "./features/home/HRHomePage";
import EmployeeProfilesPage from "./features/employeeProfiles/EmployeeProfilesPage";
import EmployeeFullProfilePage from "./features/employeeProfiles/EmployeeFullProfilePage";
import HiringManagementPage from "./features/hiringManagement/HiringManagementPage";
import ApplicationReviewPage from "./features/hiringManagement/ApplicationReviewPage";
import EmployeeVisaStatusPage from "./features/visaStatus/EmployeeVisaStatusPage";
import HRVisaStatusPage from "./features/visaStatus/HRVisaStatusPage";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegistrationPage />} />

        <Route
          path="/"
          element={
            <ProtectedRoute role="employee">
              <EmployeeHomePage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/onboarding"
          element={
            <ProtectedRoute role="employee">
              <OnboardingApplicationPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/personal-info"
          element={
            <ProtectedRoute role="employee">
              <PersonalInformationPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/visa-status"
          element={
            <ProtectedRoute role="employee">
              <EmployeeVisaStatusPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/hr"
          element={
            <ProtectedRoute role="hr">
              <HRHomePage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/hr/employees"
          element={
            <ProtectedRoute role="hr">
              <EmployeeProfilesPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/hr/employees/:userId"
          element={
            <ProtectedRoute role="hr">
              <EmployeeFullProfilePage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/hr/hiring"
          element={
            <ProtectedRoute role="hr">
              <HiringManagementPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/hr/applications/:userId"
          element={
            <ProtectedRoute role="hr">
              <ApplicationReviewPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/hr/visa"
          element={
            <ProtectedRoute role="hr">
              <HRVisaStatusPage />
            </ProtectedRoute>
          }
        />

        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

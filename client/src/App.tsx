import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute";
import AppLayout from "./components/layout/AppLayout";

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
          element={
            <ProtectedRoute role="employee">
              <AppLayout role="employee" />
            </ProtectedRoute>
          }
        >
          <Route path="/" element={<EmployeeHomePage />} />
          <Route path="/onboarding" element={<OnboardingApplicationPage />} />
          <Route path="/personal-info" element={<PersonalInformationPage />} />
          <Route path="/visa-status" element={<EmployeeVisaStatusPage />} />
        </Route>

        <Route
          element={
            <ProtectedRoute role="hr">
              <AppLayout role="hr" />
            </ProtectedRoute>
          }
        >
          <Route path="/hr" element={<HRHomePage />} />
          <Route path="/hr/employees" element={<EmployeeProfilesPage />} />
          <Route path="/hr/hiring" element={<HiringManagementPage />} />
          <Route path="/hr/visa" element={<HRVisaStatusPage />} />
        </Route>

        <Route
          path="/hr/employees/:userId"
          element={
            <ProtectedRoute role="hr">
              <EmployeeFullProfilePage />
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

        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

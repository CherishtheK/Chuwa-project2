import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { useApolloClient, useQuery } from "@apollo/client/react";
import { logout } from "../../features/auth/authSlice";
import { MY_ONBOARDING_APPLICATION_QUERY } from "../../features/onboarding/graphql/onboardingQueries";
import type { MyOnboardingApplicationResult } from "../../types/onboarding";

const hrLinks = [
  { to: "/hr", label: "Home" },
  { to: "/hr/employees", label: "Employee Profiles" },
  { to: "/hr/visa", label: "Visa Status Management" },
  { to: "/hr/hiring", label: "Hiring Management" },
];

const employeeLinks = [
  { to: "/", label: "Home" },
  { to: "/personal-info", label: "Personal Information" },
  { to: "/visa-status", label: "Visa Status Management" },
];

export default function AppLayout({ role }: { role: "hr" | "employee" }) {

  const { data } = useQuery<MyOnboardingApplicationResult>(
    MY_ONBOARDING_APPLICATION_QUERY,
    { skip: role !== "employee" },
  );
  const isApproved = data?.myOnboardingApplication?.status === "APPROVED";

  const links = role === "hr" ? hrLinks : isApproved ? employeeLinks : [];
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const client = useApolloClient();

  const handleLogout = async () => {
    localStorage.removeItem("token");
    dispatch(logout());
    await client.clearStore();
    navigate("/login");
  };

  return (
    <div className="flex min-h-screen bg-page">
      <aside className="flex w-60 flex-col bg-sidebar text-white">
        <div className="flex items-center gap-2 px-6 py-6 text-lg font-bold">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
            ◇
          </span>
          Meridian
        </div>
        <p className="px-6 pb-2 text-xs uppercase tracking-widest text-gray-400">
          {role === "hr" ? "HR Console" : "Menu"}
        </p>
        <nav className="flex flex-1 flex-col gap-1 px-3">
          {links.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              end={l.to === "/" || l.to === "/hr"}
              className={({ isActive }) =>
                `rounded-lg px-3 py-2 text-sm ${isActive ? "bg-primary text-white" : "text-gray-400 hover:text-white"}`
              }
            >
              {l.label}
            </NavLink>
          ))}
        </nav>
        <button
          onClick={handleLogout}
          className="px-6 py-5 text-left text-sm text-gray-400 hover:text-white"
        >
          Logout
        </button>
      </aside>
      <main className="flex-1 p-10">
        <Outlet />
      </main>
    </div>
  );
}
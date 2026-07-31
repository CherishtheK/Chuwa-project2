import { useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { useApolloClient, useQuery } from "@apollo/client/react";
import { Drawer } from "antd";
import { MenuOutlined } from "@ant-design/icons";
import { logout } from "../../features/auth/authSlice";
import { MY_ONBOARDING_APPLICATION_QUERY } from "../../features/onboarding/graphql/onboardingQueries";
import type { MyOnboardingApplicationResult } from "../../types/onboarding";
import SidebarContent from "./SidebarContent";

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
  const [menuOpen, setMenuOpen] = useState(false);

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
    <div className="min-h-screen bg-page md:flex">
      <header className="flex items-center justify-between bg-sidebar px-4 py-3 text-white md:hidden">
        <div className="flex items-center gap-2 font-bold">
          <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary">
            ◇
          </span>
          Meridian
        </div>
        <button onClick={() => setMenuOpen(true)} aria-label="Open menu">
          <MenuOutlined className="text-lg" />
        </button>
      </header>

      <Drawer
        placement="left"
        open={menuOpen}
        onClose={() => setMenuOpen(false)}
        width={240}
        closable={false}
        styles={{ body: { padding: 0 } }}
      >
        <SidebarContent
          role={role}
          links={links}
          onLogout={handleLogout}
          onNavigate={() => setMenuOpen(false)}
        />
      </Drawer>

      <aside className="hidden w-60 md:block">
        <SidebarContent role={role} links={links} onLogout={handleLogout} />
      </aside>

      <main className="flex-1 p-6 md:p-10">
        <Outlet />
      </main>
    </div>
  );
}

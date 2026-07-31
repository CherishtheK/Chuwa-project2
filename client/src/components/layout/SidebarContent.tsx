import { NavLink } from "react-router-dom";

interface Props {
  role: "hr" | "employee";
  links: { to: string; label: string }[];
  onLogout: () => void;
  onNavigate?: () => void;
}

export default function SidebarContent({
  role,
  links,
  onLogout,
  onNavigate,
}: Props) {
  return (
    <div className="flex h-full flex-col bg-sidebar text-white">
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
            onClick={onNavigate}
            className={({ isActive }) =>
              `rounded-lg px-3 py-2 text-sm ${isActive ? "bg-primary text-white" : "text-gray-400 hover:text-white"}`
            }
          >
            {l.label}
          </NavLink>
        ))}
      </nav>
      <button
        onClick={onLogout}
        className="px-6 py-5 text-left text-sm text-gray-400 hover:text-white"
      >
        Logout
      </button>
    </div>
  );
}

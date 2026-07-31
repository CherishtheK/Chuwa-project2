import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import type { RootState } from "../../app/store";

export default function EmployeeHomePage() {
  const user = useSelector((state: RootState) => state.auth.user);

  return (
    <div>
      <h1>Welcome{user ? `, ${user.userName}` : ""}!</h1>
      <p className="mb-6 text-sm text-gray-500">
        Here's a quick overview of what you can do.
      </p>

      <div className="grid grid-cols-2 gap-4">
        <Link
          to="/personal-info"
          className="rounded-xl border border-gray-200 bg-white p-6 hover:border-primary"
        >
          <h2 className="mb-1 text-lg font-bold">Personal Information</h2>
          <p className="text-sm text-gray-500">
            View and update your personal details.
          </p>
        </Link>

        <Link
          to="/visa-status"
          className="rounded-xl border border-gray-200 bg-white p-6 hover:border-primary"
        >
          <h2 className="mb-1 text-lg font-bold">Visa Status Management</h2>
          <p className="text-sm text-gray-500">
            Track your work authorization documents.
          </p>
        </Link>
      </div>
    </div>
  );
}
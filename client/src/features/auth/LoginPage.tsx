import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useMutation } from "@apollo/client/react";
import { useDispatch } from "react-redux";
import { LOGIN_MUTATION } from "./graphql/authMutations";
import type { LoginResult, LoginVariables } from "../../types/auth";
import { setCredentials } from "./authSlice";

export default function LoginPage() {
  const [loginName, setLoginName] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [login, { loading }] = useMutation<LoginResult, LoginVariables>(LOGIN_MUTATION);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    const result = await login({
      variables: { input: { loginName, loginPassword } },
    });

    const data = result.data?.login;

    if (data?.success && data.token && data.user) {
    localStorage.setItem("token", data.token);
    dispatch(setCredentials({ user: data.user, token: data.token }));

    if (data.user.role === "hr") {
      navigate("/hr");
    } else {
      navigate("/onboarding");
    }
    } else {
      setErrorMsg(data?.message ?? "Login failed");
    }
  };

  return (
    <div>
      <h1>Sign in</h1>
      <p className="mb-6 text-sm text-gray-500">
        Enter your credentials to access the portal.
      </p>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">
            Username
          </label>
          <input
            className="w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
            value={loginName}
            onChange={(e) => setLoginName(e.target.value)}
            required
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">
            Password
          </label>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
              value={loginPassword}
              onChange={(e) => setLoginPassword(e.target.value)}
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-sm font-medium text-primary"
            >
              {showPassword ? "Hide" : "Show"}
            </button>
          </div>
        </div>

        {errorMsg && <p className="text-sm text-danger">{errorMsg}</p>}

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-lg bg-primary py-2.5 text-sm font-semibold text-white transition hover:opacity-90 disabled:opacity-60"
        >
          {loading ? "Signing in..." : "Sign in"}
        </button>

        <p className="text-center text-xs text-gray-400">
          Access is invitation-only. New hires receive a registration link
          from HR.
        </p>
      </form>
    </div>
  );
}
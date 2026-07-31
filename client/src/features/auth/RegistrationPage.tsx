import { useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { useQuery, useMutation } from "@apollo/client/react";
import { useDispatch } from "react-redux";
import { VALIDATE_REGISTER_TOKEN_QUERY } from "./graphql/authQueries";
import { REGISTER_MUTATION } from "./graphql/authMutations";
import { setCredentials } from "./authSlice";
import type { ValidateTokenResult, ValidateTokenVariables, RegisterResult, RegisterVariables,} from "../../types/auth";

export default function RegistrationPage() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token") ?? "";

  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { data, loading: validating } = useQuery
    <ValidateTokenResult,
    ValidateTokenVariables
  >(VALIDATE_REGISTER_TOKEN_QUERY, {
    variables: { token },
    skip: !token,
  });

  const [register, { loading: submitting }] = useMutation
    <RegisterResult,
    RegisterVariables
  >(REGISTER_MUTATION);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (password !== confirmPassword) {
      setErrorMsg("Passwords do not match.");
      return;
    }

    const result = await register({
      variables: { input: { token, registerName: userName, password } },
    });

    const registerData = result.data?.register;
    if (registerData?.success && registerData.token && registerData.user) {
      localStorage.setItem("token", registerData.token);
      dispatch(
        setCredentials({ user: registerData.user, token: registerData.token }),
      );
      navigate("/onboarding");
    } else {
      setErrorMsg(registerData?.message ?? "Registration failed");
    }
  };

  if (!token) {
    return (
      <div>
        <h1>Invalid link</h1>
        <p className="text-sm text-gray-500">
          This registration link is missing required information.
        </p>
      </div>
    );
  }

  if (validating) {
    return <p className="text-sm text-gray-500">Verifying invitation...</p>;
  }

  const tokenInfo = data?.validateRegistrationToken;

  if (!tokenInfo?.valid) {
    return (
      <div>
        <h1>Link expired</h1>
        <p className="text-sm text-gray-500">
          This registration link is invalid or has expired. Please contact HR
          for a new invitation.
        </p>
      </div>
    );
  }

  return (
    <div>
      <h1>Create your account</h1>
      <p className="mb-6 text-sm text-gray-500">
        You&apos;ve been invited to join{" "}
        <span className="font-semibold text-gray-700">Meridian</span>. Set up
        your login to begin onboarding.
      </p>

      <div className="mb-6 flex items-center gap-2 rounded-lg border border-success/20 bg-success/10 px-4 py-3 text-sm text-success">
        <span className="flex h-5 w-5 items-center justify-center rounded-full bg-success text-white">
          ✓
        </span>
        Invitation verified
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="mb-1 flex items-center gap-1 text-sm font-medium text-gray-700">
            Email <span className="text-gray-400">· locked</span>
          </label>
          <div className="relative">
            <input
              value={tokenInfo.email ?? ""}
              disabled
              className="w-full cursor-not-allowed rounded-lg border border-gray-200 bg-gray-100 px-3 py-2 text-sm text-gray-500"
            />
            <span className="absolute right-3 top-1/2 -translate-y-1/2">
              🔒
            </span>
          </div>
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">
            Username
          </label>
          <input
            className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
            required
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Password
            </label>
            <input
              type="password"
              className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Confirm
            </label>
            <input
              type="password"
              className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              minLength={6}
            />
          </div>
        </div>

        {errorMsg && <p className="text-sm text-danger">{errorMsg}</p>}

        <button
          type="submit"
          disabled={submitting}
          className="w-full rounded-lg bg-primary py-2.5 text-sm font-semibold text-white transition hover:opacity-90 disabled:opacity-60"
        >
          {submitting ? "Creating account..." : "Create account & continue"}
        </button>
      </form>
    </div>
  );
}
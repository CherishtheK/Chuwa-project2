import { Outlet } from "react-router-dom";

export default function AuthLayout() {
  return (
    <div className="flex min-h-screen w-full">
    
      <div className="relative hidden w-1/2 flex-col justify-between overflow-hidden bg-sidebar p-10 text-white md:flex">
        <div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full border border-white/10" />
        <div className="pointer-events-none absolute -bottom-24 -left-16 h-64 w-64 rounded-full border border-white/10" />

        <div className="flex items-center gap-2 text-lg font-bold">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
            ◇
          </span>
          Meridian
        </div>

        <div>
          <h1 className="mb-3 text-3xl font-bold leading-tight text-white">
            Welcome!
          </h1>
          <p className="text-sm text-white/70">
            Complete your paperwork, track your visa documents, and stay in
            sync with HR — all in one place.
          </p>
        </div>

        <p className="text-xs text-white/50">
          © 2026 Meridian, Inc. · Privacy · Support
        </p>
      </div>

      
      <div className="flex w-full flex-col justify-center bg-white px-10 md:w-1/2 md:px-20">
        <div className="mx-auto w-full max-w-sm">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
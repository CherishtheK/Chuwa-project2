import { Segmented } from "antd";
import type { AppSummary } from "../graphql/hiringManagementQueries";

const TABS = ["PENDING", "APPROVED", "REJECTED"] as const;
export type Tab = (typeof TABS)[number];

interface Props {
  tab: Tab;
  onTabChange: (tab: Tab) => void;
  counts: Record<Tab, number | undefined>;
  apps: AppSummary[];
  loading: boolean;
}

export default function ApplicationReviewTabs({
  tab,
  onTabChange,
  counts,
  apps,
  loading,
}: Props) {
  return (
    <div className="mt-6 rounded-xl bg-white p-6 shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2>Onboarding application review</h2>
        <Segmented
          className="max-w-full overflow-x-auto"
          value={tab}
          className="[&_.ant-segmented-item]:font-semibold [&_.ant-segmented-item-selected]:text-primary!"
          onChange={(v) => onTabChange(v as Tab)}
          options={TABS.map((s) => ({
            label: (
              <span>
                {s[0] + s.slice(1).toLowerCase()}
                {counts[s] !== undefined && (
                  <span className="hidden sm:inline"> ({counts[s]})</span>
                )}
              </span>
            ),
            value: s,
          }))}
        />
      </div>
      {apps.map((a) => (
        <div
          key={a.owner}
          className="mt-4 flex flex-col gap-3 rounded-lg border p-4 sm:flex-row sm:items-center sm:justify-between"
        >
          <div>
            <p className="font-semibold">
              {a.firstName} {a.lastName}
            </p>
            <p className="text-sm text-gray-500">{a.onboardEmail}</p>
          </div>
          <a
            href={`/hr/applications/${a.owner}`}
            target="_blank"
            rel="noreferrer"
            className="self-start rounded-lg border px-4 py-2 text-sm font-semibold text-primary sm:self-auto"
          >
            View application ↗
          </a>
        </div>
      ))}
      {apps.length === 0 && !loading && (
        <p className="mt-6 text-center text-sm text-gray-400">
          No {tab.toLowerCase()} applications.
        </p>
      )}
    </div>
  );
}

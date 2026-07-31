import { ConfigProvider, Steps } from "antd";
import { STEP_LABELS, type VisaStep } from "../graphql/visaQueries";

export default function StepTracker({
  steps,
  currentIdx,
}: {
  steps: VisaStep[];
  currentIdx: number;
}) {
  return (
    <div className="mt-8">
      <ConfigProvider theme={{ token: { colorPrimary: "#2f66d6" } }}>
        <Steps
          current={currentIdx === -1 ? steps.length : currentIdx}
          status={
            currentIdx !== -1 && steps[currentIdx].status === "REJECTED"
              ? "error"
              : "process"
          }
          labelPlacement="vertical"
          items={steps.map((s) => ({ title: STEP_LABELS[s.type] }))}
        />
      </ConfigProvider>
    </div>
  );
}

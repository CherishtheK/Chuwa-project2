// 复用组件：Pending/Approved/Rejected 状态小圆点，全站都在用
const COLORS: Record<string, string> = {
  APPROVED: "bg-green-50 text-success",
  SUBMITTED: "bg-green-50 text-success",
  PENDING: "bg-amber-50 text-amber-600",
  REJECTED: "bg-red-50 text-danger",
  NOT_STARTED: "bg-gray-100 text-gray-500",
};

export default function StatusBadge({ status }: { status: string }) {
  return (
    <span
      className={`rounded-full px-3 py-1 text-xs font-semibold ${COLORS[status] ?? "bg-gray-100 text-gray-500"}`}
    >
      {status.replace(/_/g, " ")}
    </span>
  );
}

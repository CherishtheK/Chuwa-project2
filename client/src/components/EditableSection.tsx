import type { ReactNode, FormEvent } from "react";

interface EditableSectionProps {
  title: string;
  editing: boolean;
  submitting?: boolean;
  onEdit: () => void;
  onCancel: () => void;
  onSubmit?: (e: FormEvent) => void;
  viewContent: ReactNode;
  editContent: ReactNode;
}

export default function EditableSection({
  title,
  editing,
  submitting,
  onEdit,
  onCancel,
  onSubmit,
  viewContent,
  editContent,
}: EditableSectionProps) {
  return (
    <section className="rounded-xl border border-gray-200 bg-white p-6">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-bold">{title}</h2>
        {!editing && (
          <button onClick={onEdit} className="text-sm font-medium text-primary">
            Edit
          </button>
        )}
      </div>

      {editing ? (
        <form onSubmit={onSubmit} className="space-y-4">
          {editContent}
          <div className="flex justify-end gap-3">
            <button type="button" onClick={onCancel} className="rounded-lg border border-gray-200 px-4 py-2 text-sm">
              Cancel
            </button>
            <button type="submit" disabled={submitting} className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white">
              Save
            </button>
          </div>
        </form>
      ) : (
        viewContent
      )}
    </section>
  );
}
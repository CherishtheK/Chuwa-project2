import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@apollo/client/react";
import { useState } from "react";
import { UPDATE_CONTACT_SECTION } from "./graphql/PersonalInfoMutations";
import { contactSectionSchema, type ContactSectionValues } from "./personalInfoSchemas";
import type {
  MyPersonalInfoData,
  UpdateContactResult,
  UpdateContactVariables,
} from "../../types/personalInfo";

interface Props {
  info: MyPersonalInfoData;
  onSaved: () => void;
}

export default function ContactSection({ info, onSaved }: Props) {
  const [editing, setEditing] = useState(false);

  const defaultValues: ContactSectionValues = {
    cellPhone: info.cellPhone,
    workPhone: info.workPhone ?? "",
  };

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ContactSectionValues>({
    resolver: zodResolver(contactSectionSchema),
    defaultValues,
  });

  const [updateContact] = useMutation<UpdateContactResult, UpdateContactVariables>(
    UPDATE_CONTACT_SECTION,
  );

  const handleCancel = () => {
    if (confirm("Discard your changes?")) {
      reset(defaultValues);
      setEditing(false);
    }
  };

  const onSubmit = async (values: ContactSectionValues) => {
    const result = await updateContact({
      variables: { input: { cellPhone: values.cellPhone, workPhone: values.workPhone || undefined } },
    });
    if (result.data?.updateContactSection.success) {
      setEditing(false);
      onSaved();
    } else {
      alert(result.data?.updateContactSection.message ?? "Update failed");
    }
  };

  return (
    <section className="rounded-xl border border-gray-200 bg-white p-6">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-bold">Contact Info</h2>
        {!editing && (
          <button onClick={() => setEditing(true)} className="text-sm font-medium text-primary">
            Edit
          </button>
        )}
      </div>

      {editing ? (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="mb-1 block text-sm font-medium">Cell phone</label>
              <input {...register("cellPhone")} className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm" />
              {errors.cellPhone && <p className="mt-1 text-xs text-danger">{errors.cellPhone.message}</p>}
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium">Work phone</label>
              <input {...register("workPhone")} className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm" />
              {errors.workPhone && <p className="mt-1 text-xs text-danger">{errors.workPhone.message}</p>}
            </div>
          </div>
          <div className="flex justify-end gap-3">
            <button type="button" onClick={handleCancel} className="rounded-lg border border-gray-200 px-4 py-2 text-sm">
              Cancel
            </button>
            <button type="submit" disabled={isSubmitting} className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white">
              Save
            </button>
          </div>
        </form>
      ) : (
        <div className="text-sm">
          <div><span className="text-gray-500">Cell:</span> {info.cellPhone}</div>
          <div><span className="text-gray-500">Work:</span> {info.workPhone ?? "-"}</div>
        </div>
      )}
    </section>
  );
}
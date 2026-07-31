import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@apollo/client/react";
import { useState } from "react";
import { UPDATE_EMERGENCY_CONTACT_SECTION } from "../graphql/PersonalInfoMutations";
import EditableSection from "../../../components/EditableSection";
import {
  emergencyContactSectionSchema,
  type EmergencyContactSectionValues,
} from "../personalInfoSchemas";
import type {
  MyPersonalInfoData,
  UpdateEmergencyContactResult,
  UpdateEmergencyContactVariables,
} from "../../../types/personalInfo";

interface Props {
  info: MyPersonalInfoData;
  onSaved: () => void;
}

export default function EmergencyContactSection({ info, onSaved }: Props) {
  const [editing, setEditing] = useState(false);

  const defaultValues: EmergencyContactSectionValues = {
    emergencyContact: info.emergencyContact.map((c) => ({
      firstName: c.firstName,
      lastName: c.lastName,
      middleName: c.middleName ?? "",
      phone: c.phone ?? "",
      email: c.email ?? "",
      relationship: c.relationship,
    })),
  };

  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<EmergencyContactSectionValues>({
    resolver: zodResolver(emergencyContactSectionSchema),
    defaultValues,
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "emergencyContact",
  });

  const [updateEmergencyContact] = useMutation
    <UpdateEmergencyContactResult,
    UpdateEmergencyContactVariables
  >(UPDATE_EMERGENCY_CONTACT_SECTION);

  const handleCancel = () => {
    if (confirm("Discard your changes?")) {
      reset(defaultValues);
      setEditing(false);
    }
  };

  const onSubmit = async (values: EmergencyContactSectionValues) => {
    const result = await updateEmergencyContact({
      variables: {
        input: values.emergencyContact.map((c) => ({
          firstName: c.firstName,
          lastName: c.lastName,
          middleName: c.middleName || undefined,
          phone: c.phone || undefined,
          email: c.email || undefined,
          relationship: c.relationship,
        })),
      },
    });
    if (result.data?.updateEmergencyContactSection.success) {
      setEditing(false);
      onSaved();
    } else {
      alert(result.data?.updateEmergencyContactSection.message ?? "Update failed");
    }
  };

  return (
    <EditableSection
      title="Emergency Contacts"
      editing={editing}
      submitting={isSubmitting}
      onEdit={() => setEditing(true)}
      onCancel={handleCancel}
      onSubmit={handleSubmit(onSubmit)}
      viewContent={
        <div className="space-y-2 text-sm">
          {info.emergencyContact.map((c, i) => (
            <div key={i}>{c.firstName} {c.lastName} — {c.relationship}</div>
          ))}
        </div>
      }
      editContent={
        <>
          {fields.map((field, index) => (
            <div key={field.id} className="grid grid-cols-2 gap-4 border-b border-gray-100 pb-4">
              <div>
                <input
                  placeholder="First name"
                  {...register(`emergencyContact.${index}.firstName`)}
                  className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm"
                />
                {errors.emergencyContact?.[index]?.firstName && (
                  <p className="mt-1 text-xs text-danger">{errors.emergencyContact[index]?.firstName?.message}</p>
                )}
              </div>
              <div>
                <input
                  placeholder="Last name"
                  {...register(`emergencyContact.${index}.lastName`)}
                  className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm"
                />
                {errors.emergencyContact?.[index]?.lastName && (
                  <p className="mt-1 text-xs text-danger">{errors.emergencyContact[index]?.lastName?.message}</p>
                )}
              </div>
              <div>
                <input
                  placeholder="Phone"
                  {...register(`emergencyContact.${index}.phone`)}
                  className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm"
                />
                {errors.emergencyContact?.[index]?.phone && (
                  <p className="mt-1 text-xs text-danger">{errors.emergencyContact[index]?.phone?.message}</p>
                )}
              </div>
              <div>
                <input
                  placeholder="Email"
                  {...register(`emergencyContact.${index}.email`)}
                  className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm"
                />
                {errors.emergencyContact?.[index]?.email && (
                  <p className="mt-1 text-xs text-danger">{errors.emergencyContact[index]?.email?.message}</p>
                )}
              </div>
              <div className="col-span-2">
                <input
                  placeholder="Relationship"
                  {...register(`emergencyContact.${index}.relationship`)}
                  className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm"
                />
                {errors.emergencyContact?.[index]?.relationship && (
                  <p className="mt-1 text-xs text-danger">{errors.emergencyContact[index]?.relationship?.message}</p>
                )}
              </div>
              {fields.length > 1 && (
                <button type="button" onClick={() => remove(index)} className="col-span-2 text-left text-sm text-danger">
                  Remove
                </button>
              )}
            </div>
          ))}
          {errors.emergencyContact?.root && (
            <p className="text-xs text-danger">{errors.emergencyContact.root.message}</p>
          )}
          <button
            type="button"
            onClick={() => append({ firstName: "", lastName: "", middleName: "", phone: "", email: "", relationship: "" })}
            className="text-sm font-medium text-primary"
          >
            + Add another
          </button>
        </>
      }
    />
  );
}
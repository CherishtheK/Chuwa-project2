import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@apollo/client/react";
import { useState } from "react";
import { UPDATE_NAME_SECTION } from "../graphql/PersonalInfoMutations";
import { nameSectionSchema, type NameSectionValues } from "../personalInfoSchemas";
import ProfilePictureField from "../../onboarding/components/ProfilePictureField";
import EditableSection from "../../../components/EditableSection";
import type {
  MyPersonalInfoData,
  UpdateNameResult,
  UpdateNameVariables,
} from "../../../types/personalInfo";

interface Props {
  info: MyPersonalInfoData;
  onSaved: () => void;
}

export default function NameSection({ info, onSaved }: Props) {
  const [editing, setEditing] = useState(false);

  const defaultValues: NameSectionValues = {
    firstName: info.firstName,
    lastName: info.lastName,
    middleName: info.middleName ?? "",
    preferredName: info.preferredName ?? "",
    profilePicture: info.profilePicture ?? undefined,
  };

  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<NameSectionValues>({
    resolver: zodResolver(nameSectionSchema),
    defaultValues,
  });

  const [updateName] = useMutation<UpdateNameResult, UpdateNameVariables>(
    UPDATE_NAME_SECTION,
  );

  const handleCancel = () => {
    if (confirm("Discard your changes?")) {
      reset(defaultValues);
      setEditing(false);
    }
  };

  const onSubmit = async (values: NameSectionValues) => {
    const result = await updateName({
      variables: {
        input: {
          firstName: values.firstName,
          lastName: values.lastName,
          middleName: values.middleName || undefined,
          preferredName: values.preferredName || undefined,
          profilePicture: values.profilePicture,
        },
      },
    });
    if (result.data?.updateNameSection.success) {
      setEditing(false);
      onSaved();
    } else {
      alert(result.data?.updateNameSection.message ?? "Update failed");
    }
  };

  return (
    <EditableSection
      title="Name"
      editing={editing}
      submitting={isSubmitting}
      onEdit={() => setEditing(true)}
      onCancel={handleCancel}
      onSubmit={handleSubmit(onSubmit)}
      viewContent={
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div><span className="text-gray-500">First name:</span> {info.firstName}</div>
          <div><span className="text-gray-500">Last name:</span> {info.lastName}</div>
          <div><span className="text-gray-500">Middle name:</span> {info.middleName ?? "-"}</div>
          <div><span className="text-gray-500">Preferred name:</span> {info.preferredName ?? "-"}</div>
        </div>
      }
      editContent={
        <>
          <Controller
            control={control}
            name="profilePicture"
            render={({ field }) => (
              <ProfilePictureField documentId={field.value} onChange={field.onChange} />
            )}
          />
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="mb-1 block text-sm font-medium">First name</label>
              <input {...register("firstName")} className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm" />
              {errors.firstName && <p className="mt-1 text-xs text-danger">{errors.firstName.message}</p>}
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium">Last name</label>
              <input {...register("lastName")} className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm" />
              {errors.lastName && <p className="mt-1 text-xs text-danger">{errors.lastName.message}</p>}
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium">Middle name</label>
              <input {...register("middleName")} className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm" />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium">Preferred name</label>
              <input {...register("preferredName")} className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm" />
            </div>
          </div>
        </>
      }
    />
  );
}

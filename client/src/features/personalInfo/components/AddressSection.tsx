import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@apollo/client/react";
import { useState } from "react";
import { UPDATE_ADDRESS_SECTION } from "../graphql/PersonalInfoMutations";
import { addressSectionSchema, type AddressSectionValues } from "../personalInfoSchemas";
import type {
  MyPersonalInfoData,
  UpdateAddressResult,
  UpdateAddressVariables,
} from "../../../types/personalInfo";

interface Props {
  info: MyPersonalInfoData;
  onSaved: () => void;
}

export default function AddressSection({ info, onSaved }: Props) {
  const [editing, setEditing] = useState(false);

  const defaultValues: AddressSectionValues = {
    apt: info.address.apt ?? "",
    street: info.address.street,
    city: info.address.city,
    state: info.address.state,
    zip: info.address.zip,
  };

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<AddressSectionValues>({
    resolver: zodResolver(addressSectionSchema),
    defaultValues,
  });

  const [updateAddress] = useMutation<UpdateAddressResult, UpdateAddressVariables>(
    UPDATE_ADDRESS_SECTION,
  );

  const handleCancel = () => {
    if (confirm("Discard your changes?")) {
      reset(defaultValues);
      setEditing(false);
    }
  };

  const onSubmit = async (values: AddressSectionValues) => {
    const result = await updateAddress({
      variables: { input: { ...values, apt: values.apt || undefined } },
    });
    if (result.data?.updateAddressSection.success) {
      setEditing(false);
      onSaved();
    } else {
      alert(result.data?.updateAddressSection.message ?? "Update failed");
    }
  };

  return (
    <section className="rounded-xl border border-gray-200 bg-white p-6">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-bold">Address</h2>
        {!editing && (
          <button onClick={() => setEditing(true)} className="text-sm font-medium text-primary">
            Edit
          </button>
        )}
      </div>

      {editing ? (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <label className="mb-1 block text-sm font-medium">Street</label>
              <input {...register("street")} className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm" />
              {errors.street && <p className="mt-1 text-xs text-danger">{errors.street.message}</p>}
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium">Apt/Building #</label>
              <input {...register("apt")} className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm" />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium">City</label>
              <input {...register("city")} className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm" />
              {errors.city && <p className="mt-1 text-xs text-danger">{errors.city.message}</p>}
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium">State</label>
              <input {...register("state")} className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm" />
              {errors.state && <p className="mt-1 text-xs text-danger">{errors.state.message}</p>}
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium">Zip</label>
              <input {...register("zip")} className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm" />
              {errors.zip && <p className="mt-1 text-xs text-danger">{errors.zip.message}</p>}
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
          {info.address.apt && <span>{info.address.apt}, </span>}
          {info.address.street}, {info.address.city}, {info.address.state} {info.address.zip}
        </div>
      )}
    </section>
  );
}
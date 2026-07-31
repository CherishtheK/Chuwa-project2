import { useForm, useFieldArray, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@apollo/client/react";
import { useNavigate } from "react-router-dom";
import { onboardingSchema, type OnboardingFormValues } from "./onboardingSchema";
import { SUBMIT_ONBOARDING_APPLICATION } from "./graphql/onboardingMutations";

import FileUploadField from "./components/FileUploadField";
import type { OnboardingApplicationData } from "../../types/onboarding";
import ProfilePictureField from "./components/ProfilePictureField";

interface Props {
  existingApplication?: OnboardingApplicationData | null;
}

interface SubmitResult {
  submitOnboardingApplication: {
    success: boolean;
    message: string | null;
    application: { status: string } | null;
  };
}

export default function OnboardingForm({ existingApplication }: Props) {
  const navigate = useNavigate();

  const {
  register,
  control,
  handleSubmit,
  watch,
  setValue,
  formState: { errors, isSubmitting },
    } = useForm<OnboardingFormValues>({
    resolver: zodResolver(onboardingSchema),
    defaultValues: existingApplication
      ? {
          firstName: existingApplication.firstName,
          lastName: existingApplication.lastName,
          middleName: existingApplication.middleName ?? "",
          preferredName: existingApplication.preferredName ?? "",
          street: existingApplication.address.street,
          apt: existingApplication.address.apt ?? "",
          city: existingApplication.address.city,
          state: existingApplication.address.state,
          zip: existingApplication.address.zip,
          cellPhone: existingApplication.cellPhone,
          workPhone: existingApplication.workPhone ?? "",
          ssn: existingApplication.ssn,
          dob: existingApplication.dob,
          gender: existingApplication.gender,
          isPermanent: existingApplication.isPermanent,
          citizenshipType: existingApplication.citizenshipType ?? undefined,
          workAuth: existingApplication.workAuth ?? undefined,
          otherVisaTitle: existingApplication.otherVisaTitle ?? "",
          visaStartDate: existingApplication.visaStartDate ?? "",
          visaEndDate: existingApplication.visaEndDate ?? "",
          reference: {
            firstName: existingApplication.reference.firstName,
            lastName: existingApplication.reference.lastName,
            middleName: existingApplication.reference.middleName ?? "",
            phone: existingApplication.reference.phone ?? "",
            email: existingApplication.reference.email ?? "",
            relationship: existingApplication.reference.relationship,
          },
          emergencyContact: existingApplication.emergencyContact.map((contact) => ({
            firstName: contact.firstName,
            lastName: contact.lastName,
            middleName: contact.middleName ?? "",
            phone: contact.phone ?? "",
            email: contact.email ?? "",
            relationship: contact.relationship,
          })),
        }
      : {
          isPermanent: true,
          emergencyContact: [
            { firstName: "", lastName: "", relationship: "" },
          ],
        },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "emergencyContact",
  });

  const isPermanent = watch("isPermanent");
  const workAuth = watch("workAuth");

  const [submitApplication, { loading }] = useMutation<SubmitResult>(
    SUBMIT_ONBOARDING_APPLICATION,
  );

  const onSubmit = async (values: OnboardingFormValues) => {
    const result = await submitApplication({
      variables: {
        input: {
          firstName: values.firstName,
          lastName: values.lastName,
          middleName: values.middleName || undefined,
          preferredName: values.preferredName || undefined,
          profilePicture: values.profilePicture || undefined,
          address: {
            apt: values.apt || undefined,
            street: values.street,
            city: values.city,
            state: values.state,
            zip: values.zip,
          },
          cellPhone: values.cellPhone,
          workPhone: values.workPhone || undefined,
          ssn: values.ssn,
          dob: values.dob,
          gender: values.gender,
          isPermanent: values.isPermanent,
          citizenshipType: values.citizenshipType,
          workAuth: values.workAuth,
          otherVisaTitle: values.otherVisaTitle || undefined,
          workAuthDoc: values.workAuthDoc || undefined,
          visaStartDate: values.visaStartDate || undefined,
          visaEndDate: values.visaEndDate || undefined,
          driversLicense: values.driversLicense || undefined,
          reference: values.reference,
          emergencyContact: values.emergencyContact,
        },
      },
    });




    if (result.data?.submitOnboardingApplication.success) {
      navigate("/onboarding");
      window.location.reload();
    } else {
      alert(result.data?.submitOnboardingApplication.message ?? "Submission failed");
    }
  };
    
    const onInvalid = (errs: typeof errors) => {
        console.log("Validation errors:", errs);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit, onInvalid)} className="space-y-6">
      {existingApplication?.feedback && (
        <div className="rounded-lg border border-danger/20 bg-danger/10 px-4 py-3 text-sm text-danger">
          HR feedback: {existingApplication.feedback}
        </div>
      )}

    <section className="rounded-xl border border-gray-200 bg-white p-6">
        <h2 className="mb-4 text-lg font-bold">Name & Identity</h2>
        <div className="grid grid-cols-2 gap-4">
          <div className="col-span-2">
            <Controller
              control={control}
              name="profilePicture"
              render={({ field }) => (
                <ProfilePictureField
                  documentId={field.value}
                  onChange={field.onChange}
                />
              )}
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium">
              First name <span className="text-danger">*</span>
            </label>
            <input {...register("firstName")} className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm" />
            {errors.firstName && <p className="mt-1 text-xs text-danger">{errors.firstName.message}</p>}
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium">
              Last name <span className="text-danger">*</span>
            </label>
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
      </section>

      <section className="rounded-xl border border-gray-200 bg-white p-6">
        <h2 className="mb-4 text-lg font-bold">Address</h2>
        <div className="grid grid-cols-2 gap-4">
          <div className="col-span-2">
            <label className="mb-1 block text-sm font-medium">
              Street <span className="text-danger">*</span>
            </label>
            <input {...register("street")} className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm" />
            {errors.street && <p className="mt-1 text-xs text-danger">{errors.street.message}</p>}
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium">Apt/Building #</label>
            <input {...register("apt")} className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm" />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium">
              City <span className="text-danger">*</span>
            </label>
            <input {...register("city")} className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm" />
            {errors.city && <p className="mt-1 text-xs text-danger">{errors.city.message}</p>}
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium">
              State <span className="text-danger">*</span>
            </label>
            <input {...register("state")} className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm" />
            {errors.state && <p className="mt-1 text-xs text-danger">{errors.state.message}</p>}
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium">
              Zip <span className="text-danger">*</span>
            </label>
            <input {...register("zip")} className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm" />
            {errors.zip && <p className="mt-1 text-xs text-danger">{errors.zip.message}</p>}
          </div>
        </div>
      </section>

      <section className="rounded-xl border border-gray-200 bg-white p-6">
        <h2 className="mb-4 text-lg font-bold">Contact & Identity</h2>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="mb-1 block text-sm font-medium">
              Cell phone <span className="text-danger">*</span>
            </label>
            <input {...register("cellPhone")} className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm" />
            {errors.cellPhone && <p className="mt-1 text-xs text-danger">{errors.cellPhone.message}</p>}
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium">Work phone</label>
            <input {...register("workPhone")} className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm" />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium">
              SSN <span className="text-danger">*</span>
            </label>
            <input {...register("ssn")} className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm" />
            {errors.ssn && <p className="mt-1 text-xs text-danger">{errors.ssn.message}</p>}
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium">
              Date of birth <span className="text-danger">*</span>
            </label>
            <input type="date" {...register("dob")} className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm" />
            {errors.dob && <p className="mt-1 text-xs text-danger">{errors.dob.message}</p>}
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium">
              Gender <span className="text-danger">*</span>
            </label>
            <select {...register("gender")} className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm">
              <option value="">Select</option>
              <option value="MALE">Male</option>
              <option value="FEMALE">Female</option>
              <option value="NO_ANSWER">I do not wish to answer</option>
            </select>
            {errors.gender && <p className="mt-1 text-xs text-danger">{errors.gender.message}</p>}
          </div>
        </div>
      </section>

      <section className="rounded-xl border border-gray-200 bg-white p-6">
        <h2 className="mb-4 text-lg font-bold">Documents</h2>
        <Controller
          control={control}
          name="driversLicense"
          render={({ field }) => (
            <FileUploadField
              label="Driver's License"
              docType="DRIVERS_LICENSE"
              value={field.value}
              onChange={field.onChange}
            />
          )}
        />
      </section>

      <section className="rounded-xl border border-gray-200 bg-white p-6">
        <h2 className="mb-4 text-lg font-bold">Work Authorization</h2>
        <p className="mb-2 text-sm font-medium">
          Are you a permanent resident or citizen of the U.S.? <span className="text-danger">*</span>
        </p>
        <Controller
          control={control}
          name="isPermanent"
          render={({ field }) => (
            <div className="mb-4 flex gap-3">
              <button
                type="button"
                onClick={() => {
                    field.onChange(true);
                    setValue("workAuth", undefined);
                    setValue("otherVisaTitle", "");
                    setValue("workAuthDoc", undefined);
                }}
                className={`rounded-lg border px-4 py-2 text-sm font-medium ${
                  field.value ? "border-primary text-primary" : "border-gray-200 text-gray-600"
                }`}
              >
                Yes
              </button>
              <button
                type="button"
                onClick={() => {
                    field.onChange(false);
                    setValue("citizenshipType", undefined);
                }}
                className={`rounded-lg border px-4 py-2 text-sm font-medium ${
                  !field.value ? "border-primary text-primary" : "border-gray-200 text-gray-600"
                }`}
              >
                No
              </button>
            </div>
          )}
        />

        {isPermanent && (
          <div>
            <label className="mb-1 block text-sm font-medium">
              Citizenship type <span className="text-danger">*</span>
            </label>
            <select {...register("citizenshipType")} className="w-full max-w-xs rounded-lg border border-gray-200 px-3 py-2 text-sm">
              <option value="">Select</option>
              <option value="GREEN_CARD">Green Card</option>
              <option value="CITIZEN">Citizen</option>
            </select>
            {errors.citizenshipType && <p className="mt-1 text-xs text-danger">{errors.citizenshipType.message}</p>}
          </div>
        )}

        {!isPermanent && (
          <div className="border-l-2 border-primary pl-4">
            <label className="mb-2 block text-sm font-medium">
              What is your work authorization? <span className="text-danger">*</span>
            </label>
            <div className="mb-4 flex flex-wrap gap-2">
              {(["H1B", "L2", "F1_CPT_OPT", "H4", "OTHER"] as const).map((option) => (
                <label
                  key={option}
                  className="cursor-pointer rounded-lg border border-gray-200 px-4 py-2 text-sm has-[:checked]:border-primary has-[:checked]:text-primary"
                >
                  <input type="radio" value={option} {...register("workAuth")} className="hidden" />
                  {option === "F1_CPT_OPT" ? "F1 (CPT/OPT)" : option}
                </label>
              ))}
            </div>
            {errors.workAuth && <p className="mb-2 text-xs text-danger">{errors.workAuth.message}</p>}

            {workAuth === "OTHER" && (
              <div className="mb-4">
                <label className="mb-1 block text-sm font-medium">
                  Please specify <span className="text-danger">*</span>
                </label>
                <input {...register("otherVisaTitle")} className="w-full max-w-xs rounded-lg border border-gray-200 px-3 py-2 text-sm" />
                {errors.otherVisaTitle && <p className="mt-1 text-xs text-danger">{errors.otherVisaTitle.message}</p>}
              </div>
            )}

            <div className="mb-4 grid grid-cols-2 gap-4">
              <div>
                <label className="mb-1 block text-sm font-medium">
                  Start date <span className="text-danger">*</span>
                </label>
                <input type="date" {...register("visaStartDate")} className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm" />
                {errors.visaStartDate && <p className="mt-1 text-xs text-danger">{errors.visaStartDate.message}</p>}
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium">
                  End date <span className="text-danger">*</span>
                </label>
                <input type="date" {...register("visaEndDate")} className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm" />
                {errors.visaEndDate && <p className="mt-1 text-xs text-danger">{errors.visaEndDate.message}</p>}
              </div>
            </div>

            {workAuth === "F1_CPT_OPT" && (
              <Controller
                control={control}
                name="workAuthDoc"
                render={({ field }) => (
                  <FileUploadField
                    label="OPT Receipt"
                    docType="OPT_RECEIPT"
                    value={field.value}
                    onChange={field.onChange}
                    error={errors.workAuthDoc?.message}
                  />
                )}
              />
            )}
          </div>
        )}
      </section>

      <section className="rounded-xl border border-gray-200 bg-white p-6">
        <h2 className="mb-4 text-lg font-bold">Reference</h2>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="mb-1 block text-sm font-medium">
              First name <span className="text-danger">*</span>
            </label>
            <input {...register("reference.firstName")} className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm" />
            {errors.reference?.firstName && <p className="mt-1 text-xs text-danger">{errors.reference.firstName.message}</p>}
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium">
              Last name <span className="text-danger">*</span>
            </label>
            <input {...register("reference.lastName")} className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm" />
            {errors.reference?.lastName && <p className="mt-1 text-xs text-danger">{errors.reference.lastName.message}</p>}
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium">Phone</label>
            <input {...register("reference.phone")} className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm" />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium">Email</label>
            <input {...register("reference.email")} className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm" />
          </div>
          <div className="col-span-2">
            <label className="mb-1 block text-sm font-medium">
              Relationship <span className="text-danger">*</span>
            </label>
            <input {...register("reference.relationship")} className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm" />
            {errors.reference?.relationship && <p className="mt-1 text-xs text-danger">{errors.reference.relationship.message}</p>}
          </div>
        </div>
      </section>

      <section className="rounded-xl border border-gray-200 bg-white p-6">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-bold">Emergency Contacts</h2>
          <button
            type="button"
            onClick={() => append({ firstName: "", lastName: "", relationship: "" })}
            className="text-sm font-medium text-primary"
          >
            + Add another
          </button>
        </div>

        {fields.map((field, index) => (
          <div key={field.id} className="mb-4 grid grid-cols-2 gap-4 border-b border-gray-100 pb-4 last:border-0">
            <div>
              <label className="mb-1 block text-sm font-medium">
                First name <span className="text-danger">*</span>
              </label>
              <input
                {...register(`emergencyContact.${index}.firstName`)}
                className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium">
                Last name <span className="text-danger">*</span>
              </label>
              <input
                {...register(`emergencyContact.${index}.lastName`)}
                className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium">Phone</label>
              <input
                {...register(`emergencyContact.${index}.phone`)}
                className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium">Email</label>
              <input
                {...register(`emergencyContact.${index}.email`)}
                className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm"
              />
            </div>
            <div className="col-span-2 flex items-end gap-4">
              <div className="flex-1">
                <label className="mb-1 block text-sm font-medium">
                  Relationship <span className="text-danger">*</span>
                </label>
                <input
                  {...register(`emergencyContact.${index}.relationship`)}
                  className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm"
                />
              </div>
              {fields.length > 1 && (
                <button type="button" onClick={() => remove(index)} className="text-sm text-danger">
                  Remove
                </button>
              )}
            </div>
          </div>
        ))}
        {errors.emergencyContact && !Array.isArray(errors.emergencyContact) && (
          <p className="text-xs text-danger">{errors.emergencyContact.message}</p>
        )}
      </section>

      <div className="flex justify-end gap-3">
        <button
          type="submit"
          disabled={isSubmitting || loading}
          className="rounded-lg bg-primary px-6 py-2.5 text-sm font-semibold text-white disabled:opacity-60"
        >
          {isSubmitting || loading ? "Submitting..." : "Submit application"}
        </button>
      </div>
    </form>
  );
}






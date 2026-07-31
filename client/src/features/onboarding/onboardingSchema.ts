import { z } from "zod";

const contactPersonSchema = z.object({
  firstName: z.string().min(1, "Required"),
  lastName: z.string().min(1, "Required"),
  middleName: z.string().optional(),
  phone: z.string().optional(),
  email: z.string().optional(),
  relationship: z.string().min(1, "Required"),
});

export const onboardingSchema = z
  .object({
    firstName: z.string().min(1, "Required"),
    lastName: z.string().min(1, "Required"),
    middleName: z.string().optional(),
    preferredName: z.string().optional(),
    profilePicture: z.string().optional(),

    apt: z.string().optional(),
    street: z.string().min(1, "Required"),
    city: z.string().min(1, "Required"),
    state: z.string().min(1, "Required"),
    zip: z.string().min(1, "Required"),

    cellPhone: z.string().min(1, "Required"),
    workPhone: z.string().optional(),

    ssn: z.string().regex(/^\d{3}-?\d{2}-?\d{4}$/, "SSN must be 9 digits, optionally formatted as XXX-XX-XXXX"),
    dob: z.string().min(1, "Required"),
    gender: z.enum(["MALE", "FEMALE", "NO_ANSWER"]),

    isPermanent: z.boolean(),
    citizenshipType: z.enum(["GREEN_CARD", "CITIZEN"]).optional(),
    workAuth: z.enum(["H1B", "L2", "F1_CPT_OPT", "H4", "OTHER"]).optional(),
    otherVisaTitle: z.string().optional(),
    workAuthDoc: z.string().optional(),
    visaStartDate: z.string().optional(),
    visaEndDate: z.string().optional(),
    driversLicense: z.string().optional(),

    reference: contactPersonSchema,
    emergencyContact: z.array(contactPersonSchema).min(1, "At least one emergency contact is required"),
  })
  .refine((data) => data.isPermanent || !!data.workAuth, {
    message: "Please choose your work authorization",
    path: ["workAuth"],
  })
  .refine((data) => !data.isPermanent || !!data.citizenshipType, {
    message: "Please choose your citizenship type",
    path: ["citizenshipType"],
  })
  .refine((data) => data.workAuth !== "F1_CPT_OPT" || !!data.workAuthDoc, {
    message: "Please upload your OPT Receipt",
    path: ["workAuthDoc"],
  })
  .refine((data) => data.workAuth !== "OTHER" || !!data.otherVisaTitle, {
    message: "Please specify your visa title",
    path: ["otherVisaTitle"],
  })
  .refine((data) => data.isPermanent || !!data.visaStartDate, {
    message: "Start date is required",
    path: ["visaStartDate"],
  })
  .refine((data) => data.isPermanent || !!data.visaEndDate, {
    message: "End date is required",
    path: ["visaEndDate"],
  })
  .refine(
  (data) => {
    if (!data.visaStartDate || !data.visaEndDate) return true;
    return new Date(data.visaStartDate) <= new Date(data.visaEndDate);
  },
  {
    message: "End date must be after start date",
    path: ["visaEndDate"],
  },
);

export type OnboardingFormValues = z.infer<typeof onboardingSchema>;
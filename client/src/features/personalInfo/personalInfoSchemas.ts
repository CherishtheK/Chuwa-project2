import { z } from "zod";

export const nameSectionSchema = z.object({
  firstName: z.string().min(1, "Required"),
  lastName: z.string().min(1, "Required"),
  middleName: z.string().optional(),
  preferredName: z.string().optional(),
  profilePicture: z.string().optional(),
});
export type NameSectionValues = z.infer<typeof nameSectionSchema>;

export const addressSectionSchema = z.object({
  apt: z.string().optional(),
  street: z.string().min(1, "Required"),
  city: z.string().min(1, "Required"),
  state: z.string().min(1, "Required"),
  zip: z.string().regex(/^\d{5}(-\d{4})?$/, "Zip must be 5 digits"),
});
export type AddressSectionValues = z.infer<typeof addressSectionSchema>;

export const contactSectionSchema = z.object({
  cellPhone: z.string().regex(/^\d{10}$/, "Cell phone must be 10 digits"),
  workPhone: z
    .string()
    .regex(/^\d{10}$/, "Work phone must be 10 digits")
    .optional()
    .or(z.literal("")),
});
export type ContactSectionValues = z.infer<typeof contactSectionSchema>;

const contactPersonSchema = z.object({
  firstName: z.string().min(1, "Required"),
  lastName: z.string().min(1, "Required"),
  middleName: z.string().optional(),
  phone: z
    .string()
    .regex(/^\d{10}$/, "Phone must be 10 digits")
    .optional()
    .or(z.literal("")),
  email: z.string().email("Invalid email").optional().or(z.literal("")),
  relationship: z.string().min(1, "Required"),
});

export const emergencyContactSectionSchema = z.object({
  emergencyContact: z.array(contactPersonSchema).min(1, "At least one emergency contact is required"),
});
export type EmergencyContactSectionValues = z.infer<typeof emergencyContactSectionSchema>;
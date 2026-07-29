import mongoose, { Schema, Document, Types } from 'mongoose';

export const GENDER_TYPES = [
  "MALE",
  "FEMALE",
  "NO_ANSWER",
] as const;

export const VISA_TYPES = [
  "H1B",
  "L2",
  "F1_CPT_OPT",
  "H4",
  "OTHER",
] as const;


export interface IContactPerson{
    firstName: string;
    lastName: string;
    middleName?: string;
    phone?: string;
    email?: string;
    relationship: string;
}

const ContactPersonSchema = new Schema<IContactPerson>({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  middleName: { type: String },
  phone: { type: String },
  email: { type: String },
  relationship: { type: String, required: true },
}, { _id: false });

export interface IOnboardingApplication extends Document{
    owner: Types.ObjectId; 
    status: "NEVER_SUBMITTED" | "PENDING" | "APPROVED" | "REJECTED";
    firstName: string;
    lastName: string;
    middleName?: string;
    preferredName?: string;
    profilePicture?: Types.ObjectId; 
    address:{
        apt?: string;
        street: string;
        city: string;
        state: string;
        zip: string;
    };
    cellPhone: string;
    workPhone?: string;
    onboardEmail: string;
    ssn: string;
    dob: Date;
    gender: (typeof GENDER_TYPES)[number];
    isPermanent: boolean;
    citizenshipType?: "GREEN_CARD" | "CITIZEN";
    workAuth?: (typeof VISA_TYPES)[number];
    otherVisaTitle?: string;
    workAuthDoc?: Types.ObjectId;
    visaStartDate?: Date;
    visaEndDate?: Date;
    driversLicense?: Types.ObjectId;
    reference: IContactPerson;
    emergencyContact: IContactPerson[];
    feedback?: string;
}

const OnboardingApplicationSchema = new Schema<IOnboardingApplication> ({
    owner: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        unique: true,
        required: true
    },
    status: {
        type: String,
        enum:["NEVER_SUBMITTED", "PENDING", "APPROVED", "REJECTED"],
        default: "NEVER_SUBMITTED",
        required: true
    },
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    middleName: {
        type: String,
    },
    preferredName: {
        type: String,
    },
    profilePicture: {
        type: Schema.Types.ObjectId,
        ref: 'Document'
    },
    address:{
        apt: { type: String},
        street: { type: String, required: true },
        city: { type: String, required: true },
        state: { type: String, required: true },
        zip: { type: String, required: true },
    },
    cellPhone: { type: String, required: true },
    workPhone: { type: String },
    onboardEmail: { type: String, required: true },
    ssn: { type: String, required: true },
    dob: { type: Date, required: true },
    gender: {
        type: String,
        enum: GENDER_TYPES,
        required: true
    },
    isPermanent: {
        type: Boolean,
        required: true
    },
    citizenshipType: {
        type: String,
        enum:["GREEN_CARD", "CITIZEN"],
    },
    workAuth: {
        type: String,
        enum: VISA_TYPES,     
    },
    otherVisaTitle: { type: String },
    workAuthDoc: {
        type: Schema.Types.ObjectId,
        ref: 'Document',
    },
    visaStartDate: { type: Date },
    visaEndDate: { type: Date },
    driversLicense: {
        type: Schema.Types.ObjectId,
        ref: 'Document',
    },
    reference: {
        type: ContactPersonSchema,
        required: true,
    },
    emergencyContact: {
        type:[ContactPersonSchema],
        required: true
    },
    feedback: {
      type: String,
    }

},
    {
        timestamps: true
    }
);

export const OnboardingApplication = mongoose.model<IOnboardingApplication>(
    'OnboardingApplication',
    OnboardingApplicationSchema
);
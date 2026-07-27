import mongoose, { Schema, Document, mongo } from "mongoose";

export interface IRegistration extends Document{
    name: string,
    invitedEmail: string,
    expireAt: Date,
    token: string,
    used:boolean
}

const RegistrationTokenSchema = new Schema<IRegistration>({
    name: {
        type: String,
        required: true,
    },
    invitedEmail: {
        type: String,
        required: true,
    },
    expireAt: {
        type: Date,
        required: true
    },
    token: {
        type: String,
        required: true,
        unique: true
    },
    used: {
        type: Boolean,
        default: false
    }
},
    {timestamps: true}
)

const RegistrationToken = mongoose.model<IRegistration>('RegistrationToken', RegistrationTokenSchema)

export {
    RegistrationToken
}
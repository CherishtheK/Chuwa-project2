import mongoose, { Schema, Document } from 'mongoose';


export interface IUser extends Document{
    userName: string;
    email: string;
    passwordHash: string;
    role: 'employee' | 'hr'
}

const userSchema = new Schema<IUser>({
    userName: {
        type: String,
        required: true,
        unique: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    passwordHash: {
        type: String,
        required: true
    },
    role: {
        type: String,
        enum: ['employee', 'hr'],
        default: 'employee'
    },
},
    {timestamps: true}
)

const User = mongoose.model<IUser>('User', userSchema);

export {
    User
}


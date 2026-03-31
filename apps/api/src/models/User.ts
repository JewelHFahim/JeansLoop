import mongoose, { Schema, Document } from 'mongoose';
import bcrypt from 'bcryptjs';
import { User as IUser, UserRoleSchema } from '@repo/shared';

export interface IUserDocument extends Omit<IUser, 'id'>, Document {
    address?: string;
    gender?: string;
    birthDate?: Date;
    comparePassword(password: string): Promise<boolean>;
}

const UserSchema = new Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phone: { type: String },
    password: { type: String, required: true, select: false },
    role: { type: String, enum: UserRoleSchema.options, default: 'CUSTOMER' },
    address: { type: String },
    gender: { type: String, enum: ['male', 'female', 'other'], default: 'male' },
    birthDate: { type: Date },
}, { timestamps: true });

UserSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

UserSchema.methods.comparePassword = async function (candidatePassword: string) {
    return bcrypt.compare(candidatePassword, this.password);
};

export const User = mongoose.model<IUserDocument>('User', UserSchema);

import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { User, IUser } from '../models/User';
import { Context } from '../context';
import { Types } from 'mongoose';

const JWT_SECRET = process.env.JWT_SECRET
if (!JWT_SECRET) {
  throw new Error('JWT_SECRET is not defined in environment variables');
}
const JWT_EXPIRES_IN = '7d';


export interface JWTPayload {
  userId: string;
  username: string;
  role: string;
}

/**
 * Hash a password using bcrypt
 */
export const hashPassword = async (password: string): Promise<string> => {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
};

/**
 * Compare a plain text password with a hashed password
 */
export const comparePassword = async (
  password: string,
  hashedPassword: string
): Promise<boolean> => {
  return bcrypt.compare(password, hashedPassword);
};

/**
 * Generate a JWT token for a user
 */
export const generateJwtToken = (user: IUser): string => {
  const payload: JWTPayload = {
    userId: user._id.toString(),
    username: user.userName,
    role: user.role,
  };

  return jwt.sign(payload, JWT_SECRET, {
    expiresIn: JWT_EXPIRES_IN,
  });
};

/**
 * Verify and decode a JWT token
 */
export const verifyToken = (token: string): JWTPayload => {
  try {
    return jwt.verify(token, JWT_SECRET) as JWTPayload;
  } catch (error) {
    throw new Error('Invalid or expired token');
  }
};

export const requireAuth = (context: Context) => {
    if(!context.currentUser) throw new Error("Not Authenticated!");
    return context.currentUser;
}

export const requireRole = (context: Context, role: 'employee' | 'hr') => {
    requireAuth(context);

    if (!context.currentUser) throw new Error("Not Authenticated!"); 

    if(context.currentUser.role !== role){
        throw new Error("No Authorization!");
    }
}

export const requireOwnership = (context: Context, owner: Types.ObjectId) => {
    requireAuth(context);

    if (!context.currentUser) throw new Error("Not Authenticated!"); 

    if(context.currentUser.role === 'hr'){
        return;
    }

    if(context.currentUser.userId !== owner.toString()){
        throw new Error("No Authorization!")
    }
}
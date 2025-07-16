import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret'; // Replace in production
const SALT_ROUNDS = 10;

// Hash password
export const hashPassword = async (password: string): Promise<string> => {
  return await bcrypt.hash(password, SALT_ROUNDS);
};

// Compare plain password with hashed password
export const comparePassword = async (plain: string, hash: string): Promise<boolean> => {
  return await bcrypt.compare(plain, hash);
};

// Generate JWT token
export const generateToken = (userId: number): string => {
    
  return jwt.sign({ userId }, JWT_SECRET, { expiresIn: '1h' });
};

// Verify JWT token
export const verifyToken = (token: string): { userId: number } => {
  return jwt.verify(token, JWT_SECRET) as { userId: number };
};

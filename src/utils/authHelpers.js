import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
export const hashPassword = async (password) => {
    try {
        const salt = await bcrypt.genSalt(10);
        return await bcrypt.hash(password, salt);
    } catch (error) {
        throw new Error('Error hashing password');
    }
};
export const comparePassword = async (plainPassword, hashedPassword) => {
    try {
        return await bcrypt.compare(plainPassword, hashedPassword);
    } catch (error) {
        throw new Error('Error comparing passwords');
    }
};
export const generateToken = (userId) => {
    try {
        return jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: '1m' });
    } catch (error) {
        
        throw new Error('Error generating token');
    }
};
export const verifyToken = (token) => {
    try {
        return jwt.verify(token, process.env.JWT_SECRET);
    } catch (error) {
        throw new Error('Error verifying token');
    }
};
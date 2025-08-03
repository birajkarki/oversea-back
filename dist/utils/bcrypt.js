"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyToken = exports.generateToken = exports.comparePassword = exports.hashPassword = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret';
const SALT_ROUNDS = 10;
const hashPassword = async (password) => {
    return await bcrypt_1.default.hash(password, SALT_ROUNDS);
};
exports.hashPassword = hashPassword;
const comparePassword = async (plain, hash) => {
    return await bcrypt_1.default.compare(plain, hash);
};
exports.comparePassword = comparePassword;
const generateToken = (userId) => {
    return jsonwebtoken_1.default.sign({ userId }, JWT_SECRET, { expiresIn: '1h' });
};
exports.generateToken = generateToken;
const verifyToken = (token) => {
    return jsonwebtoken_1.default.verify(token, JWT_SECRET);
};
exports.verifyToken = verifyToken;
//# sourceMappingURL=bcrypt.js.map
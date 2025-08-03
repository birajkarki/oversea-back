"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isValidUser = void 0;
const bcrypt_1 = require("../utils/bcrypt");
const isValidUser = async (req, res, next) => {
    try {
        const authHeader = req.headers["authorization"];
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res.status(401).json({ message: "Missing or malformed token" });
        }
        const token = authHeader.split(" ")[1];
        if (!token) {
            return res.status(401).json({ message: "Missing or malformed token" });
        }
        const isValid = (0, bcrypt_1.verifyToken)(token);
        if (!isValid) {
            return res.status(403).json({ message: "Invalid or expired token" });
        }
        return next();
    }
    catch (error) {
        console.error("Auth Middleware Error:", error.message);
        return res.status(500).json({ message: "Internal server error" });
    }
};
exports.isValidUser = isValidUser;
//# sourceMappingURL=auth.js.map
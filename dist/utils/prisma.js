"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.prisma = void 0;
const client_1 = require("@prisma/client");
exports.prisma = new client_1.PrismaClient({
    omit: { user: { password: true, token: true } }
});
//# sourceMappingURL=prisma.js.map
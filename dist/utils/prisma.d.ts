import { PrismaClient } from "@prisma/client";
export declare const prisma: PrismaClient<{
    omit: {
        user: {
            password: true;
            token: true;
        };
    };
}, never, import("@prisma/client/runtime/library").DefaultArgs>;
//# sourceMappingURL=prisma.d.ts.map
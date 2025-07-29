export declare const hashPassword: (password: string) => Promise<string>;
export declare const comparePassword: (plain: string, hash: string) => Promise<boolean>;
export declare const generateToken: (userId: number) => string;
export declare const verifyToken: (token: string) => {
    userId: number;
};
//# sourceMappingURL=bcrypt.d.ts.map
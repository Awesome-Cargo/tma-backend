export declare const generateRandomPassword: () => string;
export declare const encryptPassword: (password: string) => Promise<string>;
export declare const verifyPassword: ({ encrypedPassword, password, }: {
    encrypedPassword: string;
    password: string;
}) => Promise<boolean>;
//# sourceMappingURL=password-utils.d.ts.map
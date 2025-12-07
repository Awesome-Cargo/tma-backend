import jwt from "jsonwebtoken";
const private_sign_key = "tm4S3cretK3y";
export const createToken = (payload) => {
    return jwt.sign(payload, private_sign_key);
};
export const verifyToken = (token) => {
    try {
        const decoded = jwt.verify(token, private_sign_key);
        return {
            isValid: true,
            decoded,
        };
    }
    catch (error) {
        return {
            isValid: false,
        };
    }
};
//# sourceMappingURL=jwt-utils.js.map
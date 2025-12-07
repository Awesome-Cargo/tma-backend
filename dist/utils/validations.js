import { verifyToken } from "./jwt-utils.js";
export const validateToken = (req, response, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
        return response.status(401).json({ message: "No token provided" });
    }
    const token = authHeader.split(" ")[1];
    if (!token) {
        return response.status(401).json({ message: "No token provided" });
    }
    const validateToken = verifyToken(token);
    if (!validateToken.isValid) {
        return response.status(401).json({ message: "Invalid token" });
    }
    next();
};
//# sourceMappingURL=validations.js.map
import { JwtPayload } from "jsonwebtoken";

declare global {
    namespace Express {
        interface User extends JwtPayload { }
        interface Request {
            user?: User;
        }
    }
}

export { }
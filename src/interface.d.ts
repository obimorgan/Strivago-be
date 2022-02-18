
namespace Express {
    interface Request {
        user?: User
    }
}

interface User {
    email: string;
    password: string;
}
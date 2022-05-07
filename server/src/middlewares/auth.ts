import { Request, Response, NextFunction } from 'express';
import User from '../models/user';
import { FailureResult } from '../models/result';

export class Auth {
    public static async authenticate(request: Request, response: Response, next: NextFunction) {
        try {
            const userId = request.session.userId;

            if (userId) {

                const user = await User.findById(userId);

                if (!user) {
                    return response.status(404).send(new FailureResult('User not found'));
                }

                response.locals.user = user;
                return next();
            } else {
                return response.status(401).json(new FailureResult('Unauthenticated'));
            }

        } catch (error) {
            console.log(error);
        }
    }
}


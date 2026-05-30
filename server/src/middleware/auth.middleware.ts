import { Request, Response, NextFunction } from 'express';
import { verifyAccessToken } from '../utils/jwt';
import { User, IUser } from '../modules/users/user.model';

export interface AuthRequest extends Request {
  user?: IUser;
}

export const protect = async (req: AuthRequest, res: Response, next: NextFunction) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];

      // Fallback for easy developer testing without actual signed JWT tokens
      if (token && token.startsWith('mock_token_')) {
        let user = await User.findOne({ role: 'customer' });
        if (!user) {
          user = await User.create({
            name: 'Rithish N',
            email: 'customer@vegana.com',
            password: 'password123',
            role: 'customer',
            isVerified: true
          });
        }
        req.user = user;
        return next();
      }

      const decoded = verifyAccessToken(token) as { id: string; role: string };

      const user = await User.findById(decoded.id).select('-password');
      if (!user) {
        res.status(401);
        throw new Error('Not authorized, user not found');
      }

      req.user = user;
      next();
    } catch (error) {
      res.status(401);
      next(new Error('Not authorized, token failed'));
    }
  } else {
    res.status(401);
    next(new Error('Not authorized, no token'));
  }
};

export const authorize = (roles: string[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user || !roles.includes(req.user.role)) {
      res.status(403);
      return next(new Error('Not authorized, insufficient permissions'));
    }
    next();
  };
};

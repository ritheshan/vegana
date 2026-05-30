import { Request, Response, NextFunction } from 'express';
import { User, UserRole } from '../users/user.model';
import { generateAccessToken, generateRefreshToken, verifyRefreshToken } from '../../utils/jwt';
import { verifyGoogleToken } from '../../utils/googleAuth';

export const register = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { name, email, password, role } = req.body;

    const userExists = await User.findOne({ email });
    if (userExists) {
      res.status(400);
      throw new Error('User already exists');
    }

    const assignedRole = role === UserRole.ORGANIZER ? UserRole.ORGANIZER : UserRole.CUSTOMER;

    const user = await User.create({
      name,
      email,
      password,
      role: assignedRole,
    });

    res.status(201).json({
      message: 'User registered successfully',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const login = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user || !user.password) {
      res.status(401);
      throw new Error('Invalid email or password');
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      res.status(401);
      throw new Error('Invalid email or password');
    }

    const accessToken = generateAccessToken(user.id, user.role);
    const refreshToken = generateRefreshToken(user.id);

    res.status(200).json({
      accessToken,
      refreshToken,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const googleLogin = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { token } = req.body;
    const payload = await verifyGoogleToken(token);

    if (!payload || !payload.email) {
      res.status(401);
      throw new Error('Invalid Google token');
    }

    let user = await User.findOne({ email: payload.email });

    if (!user) {
      user = await User.create({
        name: payload.name,
        email: payload.email,
        googleId: payload.sub,
        profileImage: payload.picture,
        role: UserRole.CUSTOMER,
        isVerified: true,
      });
    } else if (!user.googleId) {
      user.googleId = payload.sub;
      await user.save();
    }

    const accessToken = generateAccessToken(user.id, user.role);
    const refreshToken = generateRefreshToken(user.id);

    res.status(200).json({
      accessToken,
      refreshToken,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const refreshToken = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { token } = req.body;
    if (!token) {
      res.status(401);
      throw new Error('Refresh token is required');
    }

    const decoded = verifyRefreshToken(token) as { id: string };
    const user = await User.findById(decoded.id);

    if (!user) {
      res.status(401);
      throw new Error('Invalid refresh token');
    }

    const newAccessToken = generateAccessToken(user.id, user.role);
    res.status(200).json({ accessToken: newAccessToken });
  } catch (error) {
    res.status(401);
    next(new Error('Invalid or expired refresh token'));
  }
};

export const logout = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // In a stateless JWT approach, logout is typically handled client-side by deleting tokens.
    // However, you could implement a token blacklist in a DB or Redis here.
    res.status(200).json({ message: 'Logged out successfully' });
  } catch (error) {
    next(error);
  }
};

// Mock versions for forgot/reset password
export const forgotPassword = async (req: Request, res: Response, next: NextFunction) => {
  res.status(200).json({ message: 'Forgot password link sent (mocked)' });
};

export const resetPassword = async (req: Request, res: Response, next: NextFunction) => {
  res.status(200).json({ message: 'Password reset successful (mocked)' });
};

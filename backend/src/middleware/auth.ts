
import type { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';

interface JwtPayload {
  id: string;
  iat?: number;
  exp?: number;
}

export const protect = async (req: Request & { user?: any }, res: Response, next: NextFunction) => {
  const auth = req.headers.authorization;
  if (!auth || !auth.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'No token provided' });
  }

  const token = auth.split(' ')[1];
 
   if(!token){
    return res.status(401).json({ message: 'No token provided' });
   }
  try {
    const secret = process.env.JWT_SECRET || 'keyboard_cat';
    const decoded = jwt.verify(token, secret);

 
    if (!decoded || typeof decoded !== 'object' || !('id' in decoded)) {
      return res.status(401).json({ message: 'Token invalid or expired' });
    }

  
    const payload = decoded as JwtPayload;

    const user = await User.findById(payload.id).select('-password');
    if (!user) return res.status(401).json({ message: 'User not found' });

    req.user = user;
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Token invalid or expired' });
  }
};

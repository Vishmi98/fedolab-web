import jwt from 'jsonwebtoken';

import { JWT_SECRET } from '@/constants/data';
import { UserStoreUserType } from '@/constants/types';


export const generateUserToken = (user: UserStoreUserType) => {
  return jwt.sign({ user }, JWT_SECRET as string, {
    expiresIn: '48h',
  });
};
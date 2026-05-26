import { verify } from 'jsonwebtoken';

export type AdminJwtPayload = {
  id: string;
  email: string;
  role: string;
  iat?: number;
  exp?: number;
};

export function verifyAdminToken(request: Request): AdminJwtPayload | null {
  const authHeader = request.headers.get('authorization');
  const token = authHeader?.replace('Bearer ', '');

  if (!token) {
    return null;
  }

  try {
    const decoded = verify(token, process.env.NEXTAUTH_SECRET || 'your-secret-key');
    if (!decoded || typeof decoded === 'string') {
      return null;
    }

    const payload = decoded as AdminJwtPayload;
    if (!payload.id || !payload.email || !payload.role) {
      return null;
    }

    return payload;
  } catch {
    return null;
  }
}
import { verify } from 'jsonwebtoken';

export function verifyAdminToken(request: Request) {
  const authHeader = request.headers.get('authorization');
  const token = authHeader?.replace('Bearer ', '');

  if (!token) {
    return null;
  }

  try {
    return verify(token, process.env.NEXTAUTH_SECRET || 'your-secret-key');
  } catch {
    return null;
  }
}
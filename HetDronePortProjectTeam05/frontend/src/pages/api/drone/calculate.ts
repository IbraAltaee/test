import { NextApiRequest, NextApiResponse } from 'next';

const verifiedIPs = new Map<string, number>();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const clientIP = getClientIP(req);
  const { recaptchaToken, ...droneData } = req.body;
  const now = Date.now();

  const lastVerified = verifiedIPs.get(clientIP);
  const isInGracePeriod = lastVerified && (now - lastVerified < 10 * 60 * 1000);

  if (!isInGracePeriod) {
    if (!recaptchaToken) {
      return res.status(400).json({
        error: 'Please complete the reCAPTCHA verification',
        requiresRecaptcha: true
      });
    }

    const recaptchaValid = await verifyRecaptcha(recaptchaToken);
    if (!recaptchaValid) {
      return res.status(400).json({
        error: 'reCAPTCHA failed or expired. Please verify again.',
        requiresRecaptcha: true,
        recaptchaExpired: true
      });
    }

    verifiedIPs.set(clientIP, now);
  }

  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/droneport/calculate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(droneData),
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: 'Calculation failed' }));
      return res.status(response.status).json(error);
    }

    const result = await response.json();
    return res.status(200).json(result);

  } catch (error) {
    console.error('API error:', error);
    return res.status(500).json({ error: 'Server error' });
  }
}

function getClientIP(req: NextApiRequest): string {
  const forwarded = req.headers['x-forwarded-for'];
  return forwarded ? forwarded.toString().split(',')[0] : req.socket.remoteAddress || 'unknown';
}

async function verifyRecaptcha(token: string): Promise<boolean> {
  try {
    const response = await fetch('https://www.google.com/recaptcha/api/siteverify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        secret: process.env.RECAPTCHA_SECRET_KEY!,
        response: token,
      }),
    });

    const data = await response.json();
    return data.success === true;
  } catch {
    return false;
  }
}
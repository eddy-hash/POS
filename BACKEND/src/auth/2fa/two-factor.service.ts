import { Injectable } from '@nestjs/common';
import * as speakeasy from 'speakeasy';
import * as QRCode from 'qrcode';

@Injectable()
export class TwoFactorService {
  generateSecret(email: string) {
    const secret = speakeasy.generateSecret({
      name: `POS System (${email})`,
      length: 20,
    });
    return secret;
  }

  async generateQRCode(secret: string, email: string) {
    const otpauthUrl = speakeasy.otpauthURL({
      secret,
      label: email,
      issuer: 'POS System',
      encoding: 'base32',
    });
    return QRCode.toDataURL(otpauthUrl);
  }

  verifyToken(secret: string, token: string): boolean {
    return speakeasy.totp.verify({
      secret,
      encoding: 'base32',
      token,
      window: 1,
    });
  }
}

import { Injectable } from '@nestjs/common';

@Injectable()
export class AuthService {
  private authValue: string | null = null;
  private auth2Value: string | null = null;

  get(): string | null {
    return this.authValue;
  }

  getAuth2(): string | null {
    return this.auth2Value;
  }

  set(value: string): void {
    this.authValue = value;
  }

  setAuth2(value: string): void {
    this.auth2Value = value;
  }
}

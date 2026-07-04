import { Injectable } from '@nestjs/common';

@Injectable()
export class AuthService {
  private authValue: string | null = null;

  get(): string | null {
    return this.authValue;
  }

  set(value: string): void {
    this.authValue = value;
  }
}

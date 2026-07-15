import {
  Controller,
  Get,
  Patch,
  Body,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { HmacGuard } from './hmac.guard';

interface AuthBody {
  auth?: string;
  auth2?: string;
}

interface AuthResponse {
  auth: string | null;
  auth2: string | null;
}

@Controller('auth')
@UseGuards(HmacGuard)
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get()
  getAuth(): AuthResponse {
    return { 
      auth: this.authService.get(),
      auth2: this.authService.getAuth2(),
    };
  }

  @Patch()
  @HttpCode(HttpStatus.OK)
  setAuth(@Body() body: AuthBody): AuthResponse {
    if (body.auth !== undefined) {
      this.authService.set(body.auth);
    }
    if (body.auth2 !== undefined) {
      this.authService.setAuth2(body.auth2);
    }
    return { 
      auth: this.authService.get(),
      auth2: this.authService.getAuth2(),
    };
  }
}

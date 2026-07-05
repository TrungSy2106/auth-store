import {
  Controller,
  Get,
  Put,
  Body,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { HmacGuard } from './hmac.guard';

interface AuthBody {
  auth: string;
}

interface AuthResponse {
  auth: string | null;
}

@Controller('auth')
@UseGuards(HmacGuard)
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get()
  getAuth(): AuthResponse {
    return { auth: this.authService.get() };
  }

  @Put()
  @HttpCode(HttpStatus.OK)
  setAuth(@Body() body: AuthBody): AuthResponse {
    this.authService.set(body.auth);
    return { auth: this.authService.get() };
  }
}

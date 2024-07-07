import { Body, Controller, Delete, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

import { CurrentUser } from './decorators/current-user.decorator';
import { SkipAuth } from './decorators/skip-auth.decorator';
import { SignInReqDto } from './dto/req/sign-in.req.dto';
import { SignUpReqDto } from './dto/req/sign-up.req.dto';
import { AuthResAdminDto, AuthResDto, AuthResManagerDto } from "./dto/res/auth.res.dto";
import { TokenPairResDto } from './dto/res/token-pair.res.dto';
import { JwtRefreshGuard } from './guards/jwt-refresh.guard';
import { IUserData } from './interfaces/user-data.interface';
import { AuthService } from './services/auth.service';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @SkipAuth()
  @Post('sign-up')
  public async singUp(@Body() dto: SignUpReqDto): Promise<AuthResDto> {
    return await this.authService.singUp(dto);
  }

  @SkipAuth()
  @Post('sign-in')
  public async signIn(@Body() dto: SignInReqDto): Promise<AuthResDto> {
    return await this.authService.singIn(dto);
  }

  @SkipAuth()
  @ApiBearerAuth()
  @UseGuards(JwtRefreshGuard)
  @Post('refresh')
  public async refresh(
    @CurrentUser() userData: IUserData,
  ): Promise<TokenPairResDto> {
    return await this.authService.refresh(userData);
  }

  @ApiBearerAuth()
  @Delete('sign-out')
  public async signOut(@CurrentUser() userData: IUserData): Promise<void> {
    return await this.authService.signOut(userData);
  }

  @SkipAuth()
  @Post('admin/sign-up')
  public async singUpAdmin(
    @Body() dto: SignUpReqDto,
  ): Promise<AuthResAdminDto> {
    return await this.authService.singUpAdmin(dto);
  }

  @SkipAuth()
  @Post('admin/sign-in')
  public async signInAdmin(
    @Body() dto: SignInReqDto,
  ): Promise<AuthResAdminDto> {
    return await this.authService.singInAdmin(dto);
  }

  @SkipAuth()
  @Post('manager/sign-up')
  public async singUpManager(
    @Body() dto: SignUpReqDto,
  ): Promise<AuthResManagerDto> {
    return await this.authService.singUpManager(dto);
  }

  @SkipAuth()
  @Post('manager/sign-in')
  public async signInManager(
    @Body() dto: SignInReqDto,
  ): Promise<AuthResManagerDto> {
    return await this.authService.singInManager(dto);
  }
}

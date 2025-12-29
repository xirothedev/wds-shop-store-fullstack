import { SessionStatus } from '@generated/prisma';
import {
  BadRequestException,
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import * as argon2 from 'argon2';
import { randomBytes } from 'crypto';
import type { Response } from 'express';
import type { StringValue } from 'ms';

import { MailService } from '../mail/mail.service';
import { PrismaService } from '../prisma/prisma.service';
import type { AuthenticatedUser } from '../types/express';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { RequestVerificationDto } from './dto/request-verification.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { VerifyEmailDto } from './dto/verify-email.dto';

interface TokenPayload {
  sub: string;
  email: string;
  role?: string;
}

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly mailService: MailService
  ) {}

  /**
   * Register a new user
   */
  async register(registerDto: RegisterDto): Promise<void> {
    const { email, password, fullName } = registerDto;

    // Check if user already exists
    const existingUser = await this.prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      throw new ConflictException('User with this email already exists');
    }

    // Hash password
    const hashedPassword = await argon2.hash(password);

    // Create user
    const user = await this.prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        fullName,
        emailVerified: false,
      },
    });

    // Generate verification token
    const verificationToken = this.generateToken();

    // Create verification token record (expires in 24 hours)
    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + 24);

    await this.prisma.emailVerificationToken.create({
      data: {
        token: verificationToken,
        userId: user.id,
        expiresAt,
      },
    });

    // Send verification email
    try {
      await this.mailService.sendVerificationEmail(email, verificationToken);
    } catch {
      throw new InternalServerErrorException(
        'Failed to send verification email'
      );
    }
  }

  /**
   * Login user and create session
   */
  async login(
    loginDto: LoginDto,
    response: Response,
    ipAddress?: string,
    userAgent?: string
  ): Promise<{ user: AuthenticatedUser }> {
    const { email, password } = loginDto;

    // Find user
    const user = await this.prisma.user.findUnique({
      where: { email },
    });

    if (!user || !user.password) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Verify password
    const isPasswordValid = await argon2.verify(user.password, password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Generate tokens
    const accessToken = await this.generateAccessToken(user);
    const refreshToken = await this.generateRefreshToken(user);

    // Calculate expiration times
    const accessTokenExpiresIn = this.configService.get<string>(
      'JWT_ACCESS_EXPIRES_IN',
      '15m'
    );
    const refreshTokenExpiresIn = this.configService.get<string>(
      'JWT_REFRESH_EXPIRES_IN',
      '7d'
    );

    const accessTokenExpires = this.parseExpiration(accessTokenExpiresIn);
    const refreshTokenExpires = this.parseExpiration(refreshTokenExpiresIn);

    // Create session
    await this.prisma.session.create({
      data: {
        token: accessToken,
        refreshToken,
        userId: user.id,
        ipAddress,
        userAgent,
        status: SessionStatus.ACTIVE,
        expiresAt: refreshTokenExpires,
      },
    });

    // Set cookies
    this.setAuthCookies(
      response,
      accessToken,
      refreshToken,
      accessTokenExpires,
      refreshTokenExpires
    );

    return {
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
      },
    };
  }

  /**
   * Verify email with token
   */
  async verifyEmail(
    verifyEmailDto: VerifyEmailDto
  ): Promise<{ message: string }> {
    const { token } = verifyEmailDto;

    // Find verification token
    const verificationToken =
      await this.prisma.emailVerificationToken.findUnique({
        where: { token },
        include: { user: true },
      });

    if (!verificationToken) {
      throw new NotFoundException('Invalid or expired verification token');
    }

    // Check if token is expired
    if (verificationToken.expiresAt < new Date()) {
      // Delete expired token
      await this.prisma.emailVerificationToken.delete({
        where: { id: verificationToken.id },
      });
      throw new BadRequestException('Verification token has expired');
    }

    // Check if email is already verified
    if (verificationToken.user.emailVerified) {
      // Delete token
      await this.prisma.emailVerificationToken.delete({
        where: { id: verificationToken.id },
      });
      throw new BadRequestException('Email is already verified');
    }

    // Update user emailVerified status
    await this.prisma.user.update({
      where: { id: verificationToken.userId },
      data: { emailVerified: true },
    });

    // Delete verification token
    await this.prisma.emailVerificationToken.delete({
      where: { id: verificationToken.id },
    });

    return { message: 'Email verified successfully' };
  }

  /**
   * Request new verification email
   */
  async requestVerification(
    requestVerificationDto: RequestVerificationDto
  ): Promise<{ message: string }> {
    const { email } = requestVerificationDto;

    // Find user
    const user = await this.prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      // Don't reveal if user exists or not for security
      return {
        message: 'If the email exists, a verification link has been sent',
      };
    }

    // Check if already verified
    if (user.emailVerified) {
      throw new BadRequestException('Email is already verified');
    }

    // Delete old verification tokens
    await this.prisma.emailVerificationToken.deleteMany({
      where: { userId: user.id },
    });

    // Generate new verification token
    const verificationToken = this.generateToken();

    // Create verification token record (expires in 24 hours)
    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + 24);

    await this.prisma.emailVerificationToken.create({
      data: {
        token: verificationToken,
        userId: user.id,
        expiresAt,
      },
    });

    // Send verification email
    try {
      await this.mailService.sendVerificationEmail(email, verificationToken);
    } catch (error) {
      console.error('Failed to send verification email:', error);
      throw new InternalServerErrorException(
        'Failed to send verification email'
      );
    }

    return { message: 'Verification email sent successfully' };
  }

  /**
   * Refresh access token
   */
  async refreshToken(
    refreshToken: string,
    response: Response,
    ipAddress?: string,
    userAgent?: string
  ): Promise<{ user: AuthenticatedUser }> {
    if (!refreshToken) {
      throw new UnauthorizedException('Refresh token is required');
    }

    // Find session by refresh token
    const session = await this.prisma.session.findUnique({
      where: { refreshToken },
      include: { user: true },
    });

    if (!session) {
      throw new UnauthorizedException('Invalid refresh token');
    }

    // Check if session is active
    if (session.status !== SessionStatus.ACTIVE) {
      throw new UnauthorizedException('Session is not active');
    }

    // Check if refresh token is expired
    if (session.expiresAt < new Date()) {
      // Revoke session
      await this.prisma.session.update({
        where: { id: session.id },
        data: {
          status: SessionStatus.REVOKED,
          revokedAt: new Date(),
        },
      });
      throw new UnauthorizedException('Refresh token has expired');
    }

    // Generate new tokens
    const newAccessToken = await this.generateAccessToken(session.user);
    const newRefreshToken = await this.generateRefreshToken(session.user);

    // Calculate expiration times
    const accessTokenExpiresIn = this.configService.get<string>(
      'JWT_ACCESS_EXPIRES_IN',
      '15m'
    );
    const refreshTokenExpiresIn = this.configService.get<string>(
      'JWT_REFRESH_EXPIRES_IN',
      '7d'
    );

    const accessTokenExpires = this.parseExpiration(accessTokenExpiresIn);
    const refreshTokenExpires = this.parseExpiration(refreshTokenExpiresIn);

    // Update session with new tokens (token rotation)
    await this.prisma.session.update({
      where: { id: session.id },
      data: {
        token: newAccessToken,
        refreshToken: newRefreshToken,
        expiresAt: refreshTokenExpires,
        ipAddress,
        userAgent,
      },
    });

    // Set cookies
    this.setAuthCookies(
      response,
      newAccessToken,
      newRefreshToken,
      accessTokenExpires,
      refreshTokenExpires
    );

    return {
      user: {
        id: session.user.id,
        email: session.user.email,
        role: session.user.role,
      },
    };
  }

  /**
   * Logout user (revoke session)
   */
  async logout(
    userId: string,
    sessionId?: string
  ): Promise<{ message: string }> {
    if (sessionId) {
      // Revoke specific session
      await this.prisma.session.updateMany({
        where: {
          id: sessionId,
          userId,
          status: SessionStatus.ACTIVE,
        },
        data: {
          status: SessionStatus.REVOKED,
          revokedAt: new Date(),
        },
      });
    } else {
      // Revoke all active sessions for user
      await this.prisma.session.updateMany({
        where: {
          userId,
          status: SessionStatus.ACTIVE,
        },
        data: {
          status: SessionStatus.REVOKED,
          revokedAt: new Date(),
        },
      });
    }

    return { message: 'Logged out successfully' };
  }

  /**
   * Request password reset
   */
  async forgotPassword(
    forgotPasswordDto: ForgotPasswordDto
  ): Promise<{ message: string }> {
    const { email } = forgotPasswordDto;

    // Find user
    const user = await this.prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      // Don't reveal if user exists or not for security
      return {
        message: 'If the email exists, a password reset link has been sent',
      };
    }

    // Delete old reset tokens
    await this.prisma.passwordResetToken.deleteMany({
      where: { userId: user.id },
    });

    // Generate reset token
    const resetToken = this.generateToken();

    // Create reset token record (expires in 1 hour)
    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + 1);

    await this.prisma.passwordResetToken.create({
      data: {
        token: resetToken,
        userId: user.id,
        expiresAt,
      },
    });

    // Send reset email
    try {
      await this.mailService.sendPasswordResetEmail(email, resetToken);
    } catch (error) {
      console.error('Failed to send password reset email:', error);
      throw new InternalServerErrorException(
        'Failed to send password reset email'
      );
    }

    return { message: 'Password reset email sent successfully' };
  }

  /**
   * Reset password with token
   */
  async resetPassword(
    resetPasswordDto: ResetPasswordDto
  ): Promise<{ message: string }> {
    const { token, password } = resetPasswordDto;

    // Find reset token
    const resetToken = await this.prisma.passwordResetToken.findUnique({
      where: { token },
      include: { user: true },
    });

    if (!resetToken) {
      throw new NotFoundException('Invalid or expired reset token');
    }

    // Check if token is expired
    if (resetToken.expiresAt < new Date()) {
      // Delete expired token
      await this.prisma.passwordResetToken.delete({
        where: { id: resetToken.id },
      });
      throw new BadRequestException('Reset token has expired');
    }

    // Hash new password
    const hashedPassword = await argon2.hash(password);

    // Update user password
    await this.prisma.user.update({
      where: { id: resetToken.userId },
      data: { password: hashedPassword },
    });

    // Revoke all active sessions for security
    await this.prisma.session.updateMany({
      where: {
        userId: resetToken.userId,
        status: SessionStatus.ACTIVE,
      },
      data: {
        status: SessionStatus.REVOKED,
        revokedAt: new Date(),
      },
    });

    // Delete reset token
    await this.prisma.passwordResetToken.delete({
      where: { id: resetToken.id },
    });

    return { message: 'Password reset successfully' };
  }

  /**
   * Validate user for JWT strategy
   */
  async validateUser(userId: string): Promise<AuthenticatedUser | null> {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        role: true,
      },
    });

    if (!user) {
      return null;
    }

    return {
      id: user.id,
      email: user.email,
      role: user.role,
    };
  }

  /**
   * Generate access token
   */
  private async generateAccessToken(user: {
    id: string;
    email: string;
    role: string;
  }): Promise<string> {
    const payload: TokenPayload = {
      sub: user.id,
      email: user.email,
      role: user.role,
    };

    const expiresIn = this.configService.get<StringValue>(
      'JWT_ACCESS_EXPIRES_IN',
      '15m'
    );

    return this.jwtService.signAsync(payload, {
      expiresIn,
    });
  }

  /**
   * Generate refresh token
   */
  private async generateRefreshToken(user: {
    id: string;
    email: string;
    role: string;
  }): Promise<string> {
    const payload: TokenPayload = {
      sub: user.id,
      email: user.email,
      role: user.role,
    };

    const expiresIn = this.configService.get<StringValue>(
      'JWT_REFRESH_EXPIRES_IN',
      '7d'
    );

    return this.jwtService.signAsync(payload, {
      expiresIn,
    });
  }

  /**
   * Generate random token for email verification and password reset
   */
  private generateToken(): string {
    return randomBytes(32).toString('hex');
  }

  /**
   * Set authentication cookies
   */
  private setAuthCookies(
    response: Response,
    accessToken: string,
    refreshToken: string,
    accessTokenExpires: Date,
    refreshTokenExpires: Date
  ): void {
    const isProduction =
      this.configService.get<string>('NODE_ENV') === 'production';

    // Set access token cookie
    response.cookie('access_token', accessToken, {
      httpOnly: true,
      secure: isProduction,
      sameSite: 'lax',
      expires: accessTokenExpires,
      path: '/',
    });

    // Set refresh token cookie
    response.cookie('refresh_token', refreshToken, {
      httpOnly: true,
      secure: isProduction,
      sameSite: 'lax',
      expires: refreshTokenExpires,
      path: '/',
    });
  }

  /**
   * Parse expiration string to Date
   */
  private parseExpiration(expiresIn: string): Date {
    const now = new Date();
    const match = expiresIn.match(/^(\d+)([smhd])$/);
    if (!match) {
      // Default to 15 minutes if invalid format
      now.setMinutes(now.getMinutes() + 15);
      return now;
    }

    const value = parseInt(match[1], 10);
    const unit = match[2];

    switch (unit) {
      case 's':
        now.setSeconds(now.getSeconds() + value);
        break;
      case 'm':
        now.setMinutes(now.getMinutes() + value);
        break;
      case 'h':
        now.setHours(now.getHours() + value);
        break;
      case 'd':
        now.setDate(now.getDate() + value);
        break;
      default:
        now.setMinutes(now.getMinutes() + 15);
    }

    return now;
  }
}

import { Injectable, UnauthorizedException } from '@nestjs/common';
import { CreateAuthDto } from './dto/create-auth.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Auth } from './entities/auth.entity';
import * as bcrypt from 'bcrypt';
import { LoginAuthDto } from './dto/login-auth.dto';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { Profile } from 'src/profile/entities/profile.entity';
import { Request, Response } from 'express';

const saltOrRounds = 10;
@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(Auth)
    private authRepository: Repository<Auth>,
    @InjectRepository(Profile)
    private profileRepository: Repository<Profile>,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async create(createAuthDto: CreateAuthDto) {
    const profile = await this.profileRepository.findOne({
      where: {
        id: createAuthDto.profileId,
      },
    });

    const hashPassword = await bcrypt.hash(
      createAuthDto.password,
      saltOrRounds,
    );
    const user = this.authRepository.create({
      email: createAuthDto.email,
      password: hashPassword,
      profile: profile,
    });

    await this.authRepository.save(user);

    return user;
  }

  async login(loginAuthDto: LoginAuthDto, response: Response) {
    const user = await this.authRepository.findOne({
      where: {
        email: loginAuthDto.email,
      },
    });
    if (!user) {
      throw new Error('Email not valid');
    }
    const isMatch = await bcrypt.compare(loginAuthDto.password, user.password);

    if (!isMatch) {
      throw new UnauthorizedException();
    }

    const payload = { email: user.email, role: user.role };

    const access_token = await this.jwtService.signAsync(payload, {
      secret: this.configService.get('ACCESS_KEY'),
      expiresIn: '15m',
    });

    const refresh_token = await this.jwtService.signAsync(payload, {
      secret: this.configService.get('REFRESH_KEY'),
      expiresIn: '7d',
    });

    await this.authRepository.update(
      {
        email: user.email,
      },
      {
        refreshToken: refresh_token,
      },
    );

    response.cookie('access_token', access_token, {
      httpOnly: true,
      sameSite: 'none',
      path: '/',
      expires: new Date(Date.now() + 15 * 60 * 1000),
    });

    return {
      access_token,
      refresh_token,
    };
  }

  async refreshToken(req: Request, res: Response) {
    const accessToken = await req.cookies['access_token'];

    if (!accessToken) {
      throw new UnauthorizedException('Access token not found in cookies');
    }

    const decoded = await this.jwtService.verifyAsync(accessToken, {
      secret: this.configService.get('ACCESS_KEY'),
    });

    const user = await this.authRepository.findOne({
      where: { email: decoded.email },
    });

    if (!user || !user.refreshToken) {
      throw new UnauthorizedException('User or refresh token not found');
    }

    const decodedRefresh = await this.jwtService.verifyAsync(
      user.refreshToken,
      {
        secret: this.configService.get('REFRESH_KEY'),
      },
    );

    const currentTimestamp = Math.floor(Date.now() / 1000);

    if (decodedRefresh.exp > currentTimestamp) {
      const payload = { email: user.email, roles: user.role };
      const newAccessToken = await this.jwtService.signAsync(payload, {
        secret: this.configService.get('ACCESS_KEY'),
        expiresIn: 60 * 15,
      });

      res.cookie('access_token', newAccessToken, {
        httpOnly: true,
        sameSite: 'lax',
        path: '/',
        expires: new Date(Date.now() + 15 * 60 * 1000),
      });

      return newAccessToken;
    } else {
      throw new UnauthorizedException(
        'Login session has expired, please log in again',
      );
    }
  }

  async logOut(res: Response, req: Request) {
    const accessToken = await req.cookies['access_token'];

    if (!accessToken) {
      throw new UnauthorizedException('Access token not found in cookies');
    }

    const decoded = await this.jwtService.verifyAsync(accessToken, {
      secret: this.configService.get('ACCESS_KEY'),
    });

    const user = await this.authRepository.findOne({
      where: { email: decoded.email },
    });

    if (!user) {
      throw new UnauthorizedException('User or refresh token not found');
    }

    await this.authRepository.update(
      {
        id: user.id,
      },
      {
        refreshToken: null,
      },
    );

    res.clearCookie('access_token');
    return 'LogOut';
  }

  async findAll() {
    return await this.authRepository.find();
  }

  async findOne(id: string) {
    const auth = await this.authRepository.findOne({
      where: {
        id,
      },
      relations: {
        profile: true,
      },
    });
    return auth;
  }

  update(id: number, updateAuthDto: UpdateAuthDto) {
    return `This action updates a #${id} auth`;
  }

  remove(id: number) {
    return `This action removes a #${id} auth`;
  }
}

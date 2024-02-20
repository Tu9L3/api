import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Res,
  Req,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateAuthDto } from './dto/create-auth.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';
import { LoginAuthDto } from './dto/login-auth.dto';
import { AuthenticationGuard } from 'src/guards/authentication/authentication.guard';
import { Roles } from 'src/guards/authorization/roles.decorator';
import { Role } from 'src/guards/authorization/role.enum';
import { AuthorizationGuard } from 'src/guards/authorization/authorization.guard';
import { Request, Response } from 'express';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post()
  create(@Body() createAuthDto: CreateAuthDto) {
    return this.authService.create(createAuthDto);
  }

  @Post('login')
  login(
    @Body() loginAuthDto: LoginAuthDto,
    @Res({ passthrough: true }) response: Response,
  ) {
    return this.authService.login(loginAuthDto, response);
  }

  @Roles(Role.Admin)
  @UseGuards(AuthenticationGuard, AuthorizationGuard)
  @Get()
  findAll() {
    return this.authService.findAll();
  }

  @Post('refreshtoken')
  @UseGuards(AuthenticationGuard)
  refreshToken(
    @Req() request: Request,
    @Res({ passthrough: true }) response: Response,
  ) {
    return this.authService.refreshToken(request, response);
  }

  @Post('logout')
  @UseGuards(AuthenticationGuard)
  logout(
    @Req() request: Request,
    @Res({ passthrough: true }) response: Response,
  ) {
    return this.authService.logOut(response, request);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.authService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateAuthDto: UpdateAuthDto) {
    return this.authService.update(+id, updateAuthDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.authService.remove(+id);
  }
}

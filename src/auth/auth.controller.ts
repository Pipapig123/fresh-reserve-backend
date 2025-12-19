import { Body, Controller, Get, Headers, Post, UseGuards } from '@nestjs/common'
import { AuthService } from './auth.service'
import { LoginDto } from './dto/login.dto'
import { RegisterDto } from './dto/register.dto'
import { AuthGuard } from './auth.guard' // import type { Response } from 'express'

/**
 * 认证控制器
 * 处理登录、注册、退出等 HTTP 请求
 */
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  /**
   * 登录接口
   * @param loginDto 登录参数
   * @returns 登录结果
   */
  @Post('login')
  async login(@Body() loginDto: LoginDto) {
    const result = await this.authService.login(loginDto)
    return {
      code: 200,
      msg: '登录成功',
      data: result
    }
  }
  /**
   * 注册接口
   * @param registerDto 注册参数
   * @param res
   * @returns 注册结果
   */
  @Post('register')
  async register(@Body() registerDto: RegisterDto) {
    const result = await this.authService.register(registerDto)
    return {
      code: 200,
      msg: result.message,
      data: result.user
    }
  }

  /**
   * 退出登录接口
   * @param authHeader 请求头中的 Token
   * @returns 退出结果
   */
  @Post('logout')
  async logout(@Headers('authorization') authHeader: string) {
    // 从请求头中获取 Token（格式：Bearer <token>）
    const token = authHeader?.split(' ')[1] || ''
    await this.authService.logout(token)
    return {
      code: 200,
      msg: '退出成功',
      data: null
    }
  }

  /**
   * 测试接口：需要登录才能访问
   * 用于验证鉴权守卫是否生效
   */
  @Get('userInfo')
  @UseGuards(AuthGuard) // 添加认证守卫
  async getUserInfo() {
    return {
      code: 200,
      msg: '获取用户信息成功',
      data: {
        nickname: '鲜到家用户',
        avatar: 'https://example.com/avatar.png',
        role: '商家'
      }
    }
  }
}

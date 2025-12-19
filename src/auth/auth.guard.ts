import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { Request } from 'express'

/**
 * JWT 认证守卫
 * 用于保护需要登录才能访问的接口
 */
@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly jwtService: JwtService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    // 获取请求对象
    const request = context.switchToHttp().getRequest<Request>()

    // 从请求头中获取 Token（格式：Bearer <token>）
    const authHeader = request.headers.authorization
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new UnauthorizedException('请先登录')
    }

    const token = authHeader.split(' ')[1]

    try {
      // 验证 Token 的签名和过期时间
      const decoded = this.jwtService.verify(token)
      // 将用户信息挂载到请求对象上，方便后续接口使用
      request.user = decoded
      return true
    } catch (error) {
      throw new UnauthorizedException('Token无效或已过期，请重新登录')
    }
  }
}

import { Module } from '@nestjs/common'
import { AuthService } from './auth.service'
import { AuthController } from './auth.controller'
import { JwtModule } from '@nestjs/jwt'
import { AuthGuard } from './auth.guard'

/**
 * 认证模块
 * 注册认证相关的控制器、服务、守卫
 */
@Module({
  controllers: [AuthController],
  providers: [AuthService, AuthGuard],
  imports: [
    // 配置 JWT 模块
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'fresh-home-2025-secret-key', // 密钥（生产环境建议存环境变量）
      signOptions: { expiresIn: '2h' } // Token 过期时间：2小时
    })
  ],
  exports: [AuthGuard] // 导出守卫，供其他模块使用
})
export class AuthModule {}

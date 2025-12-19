import { BadRequestException, ConflictException, Injectable, NotFoundException } from '@nestjs/common'
import { PrismaService } from '../prisma/prisma.service'
import { LoginDto } from './dto/login.dto'
import { RegisterDto } from './dto/register.dto'
import { JwtService } from '@nestjs/jwt'
import * as bcrypt from 'bcrypt'

/**
 * 认证服务
 * 处理登录、注册、退出、测试用户初始化等核心业务逻辑
 * 无 Redis 依赖，基于 JWT 实现登录状态管理
 */
@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService, // 注入 Prisma 数据库服务
    private readonly jwtService: JwtService // 注入 JWT 令牌服务
  ) {}

  /**
   * 用户登录
   * @param loginDto 登录参数
   * @returns 用户信息 + JWT Token
   */
  async login(loginDto: LoginDto) {
    const { account, password, role } = loginDto

    // 1. 查询用户（按账号+角色筛选，且状态为可用）
    const user = await this.prisma.user.findFirst({
      where: { account, role, isActive: true }
    })

    // 2. 验证用户是否存在
    if (!user) {
      throw new NotFoundException('账号不存在或角色不匹配')
    }

    // 3. 验证密码（对比明文密码与数据库中的加密密码）
    const isPasswordValid = await bcrypt.compare(password, user.password)
    if (!isPasswordValid) {
      throw new BadRequestException('密码错误')
    }

    // 4. 生成 JWT Token（包含用户核心信息，过期时间2小时）
    const token = this.jwtService.sign({
      sub: user.id, // JWT 标准字段：主题（用户ID）
      account: user.account,
      role: user.role
    })

    // 5. 返回登录结果（隐藏敏感信息）
    return {
      user: {
        id: user.id,
        account: user.account,
        role: user.role
      },
      token
    }
  }

  /**
   * 用户注册
   * @param registerDto 注册参数
   * @returns 注册成功提示 + 用户基本信息
   */
  async register(registerDto: RegisterDto) {
    const { account, password, role } = registerDto

    // 1. 检查账号是否已存在（利用 account 唯一索引快速查询）
    const existingUser = await this.prisma.user.findUnique({
      where: { account }
    })

    // 2. 若账号已存在，抛出冲突异常
    if (existingUser) {
      throw new ConflictException('该账号已注册，请直接登录')
    }

    // 3. 密码加密（盐值轮数 10，平衡安全性与性能）
    const hashedPassword = await bcrypt.hash(password, 10)

    // 4. 创建新用户（仅存储必要信息，避免冗余）
    const newUser = await this.prisma.user.create({
      data: {
        account,
        password: hashedPassword,
        role,
        isActive: true // 默认启用用户
      },
      select: {
        id: true,
        account: true,
        role: true,
        createdAt: true
      }
    })

    // 5. 返回注册结果
    return {
      message: '注册成功',
      user: newUser
    }
  }

  /**
   * 用户退出登录
   * @param token 用户当前的 JWT Token（仅接收，开发环境无需处理）
   * @returns 退出成功提示
   * 核心逻辑：前端删除 Token 即可，后端仅返回提示
   */
  async logout(token: string) {
    // 开发环境无需处理 Token，直接返回成功
    return { message: '退出成功' }
  }
}

// src/auth/dto/register.dto.ts
import {
  IsIn,
  IsNotEmpty,
  IsNumber,
  IsString,
  Matches,
  MinLength
} from 'class-validator'

export class RegisterDto {
  /**
   * 登录账号（手机号）
   * @example 13800138000
   */
  @IsString({ message: '账号必须是字符串' })
  @IsNotEmpty({ message: '账号不能为空' })
  @Matches(/^1[3-9]\d{9}$/, { message: '请输入正确的手机号格式' }) // 手机号正则校验
  account: string

  /**
   * 登录密码
   * @example 123456
   */
  @IsString({ message: '密码必须是字符串' })
  @IsNotEmpty({ message: '密码不能为空' })
  @MinLength(6, { message: '密码长度不能少于6位' }) // 密码最小长度校验
  password: string

  /**
   * 用户角色（0-商家，1-管理员, 2-用户）
   * @example 0
   */
  @IsIn([0, 1, 2], { message: '角色必须为0（商家）或1（管理员）和2（用户）' })
  @IsNumber({}, { message: '角色必须是数字' })
  role: number
}

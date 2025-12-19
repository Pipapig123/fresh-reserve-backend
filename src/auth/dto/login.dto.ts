// src/auth/dto/login.dto.ts
import { IsIn, IsNotEmpty, IsNumber, IsString } from 'class-validator'

export class LoginDto {
  @IsString({ message: '账号必须是字符串' })
  @IsNotEmpty({ message: '账号不能为空' })
  account: string

  @IsString({ message: '密码必须是字符串' })
  @IsNotEmpty({ message: '密码不能为空' })
  password: string

  @IsIn([0, 1, 2], { message: '角色必须为0（商家）或1（管理员）和2（用户）' })
  @IsNumber({}, { message: '角色必须是数字' })
  role: number
}

import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common'
import { PrismaClient } from '@prisma/client'

@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  // 模块初始化时连接数据库
  async onModuleInit() {
    await (this.$connect as () => Promise<void>)()
    console.log('Prisma 6.19.0 连接 MySQL 8 成功！')
  }

  // 模块销毁时断开连接
  async onModuleDestroy() {
    await (this.$disconnect as () => Promise<void>)()
  }
}

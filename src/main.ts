import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import { ValidationPipe } from '@nestjs/common'

async function bootstrap() {
  const app = await NestFactory.create(AppModule)
  // 1. 跨域配置（适配前端3000端口）
  app.enableCors({
    origin: 'http://localhost:5173',
    credentials: true
  })
  // 2. 全局参数校验
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true
    })
  )
  await app.listen(process.env.PORT ?? 3000)
}
bootstrap()

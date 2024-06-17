import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from './database/database.module';
import { UploadModule } from './upload/upload.module';

@Module({
  imports: [ConfigModule.forRoot(), DatabaseModule, UploadModule],
})
export class AppModule {}

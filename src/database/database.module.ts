import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';


@Module({
  imports: [
    MongooseModule.forRootAsync({
  imports: [ConfigModule],
  inject: [ConfigService],
  useFactory: (config: ConfigService) => ({
    uri: config.get<string>('MONGO_URI'),
  }),
    })
],
})
export class DatabaseModule {
    constructor(private readonly config: ConfigService) {
        console.log('DatabaseModule imported');
        console.log('MONGO_URI', this.config.get<string>('MONGO_URI'));
    }
}

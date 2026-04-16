import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CustomersModule } from './modules/customers/customers.module';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { db, rootPath } from './config/envs';
import { OrdersModule } from './modules/orders/orders.module';
import { FoldersModule } from './modules/folders/folders.module';
import { DocumentsModule } from './modules/documents/documents.module';
import { FilesModule } from './modules/files/files.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      database: db.database,
      host: db.host,
      port: db.port,
      username: db.username,
      password: db.password,
      autoLoadEntities: true,
      // dropSchema: true,
      // logging: true,
      synchronize: true,
      entities: [],
      subscribers: [],
    }),
    ServeStaticModule.forRoot({
      rootPath: join(rootPath, '/.tmp'),
      serveRoot: '/files',
      serveStaticOptions: {
        extensions: ['pdf'],
      },
    }),
    FilesModule,
    CustomersModule,
    OrdersModule,
    FoldersModule,
    DocumentsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

import { Module } from "@nestjs/common";
import { CustomersController } from "@modules/customers/customers.controller";
import { CustomersService } from "@modules/customers/customers.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Customer } from "@modules/customers/entities/customer.entity";
import { AuthModule } from "@modules/auth/auth.module";

@Module({
    imports: [
        TypeOrmModule.forFeature([
            Customer,
        ]),
        AuthModule,
    ],
    controllers: [CustomersController],
    providers: [CustomersService],
    exports: [CustomersService],
})
export class CustomersModule {}
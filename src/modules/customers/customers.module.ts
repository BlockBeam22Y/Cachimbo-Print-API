import { Module } from "@nestjs/common";
import { CustomersController } from "@modules/customers/controllers/customers.controller";
import { CustomersService } from "@modules/customers/services/customers.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Customer } from "@modules/customers/entities/customer.entity";
import { AuthModule } from "@modules/auth/auth.module";
import { CustomerAddress } from "@modules/customers/entities/customerAddress.entity";
import { CustomerAddressesService } from "@modules/customers/services/customerAddresses.service";

@Module({
    imports: [
        TypeOrmModule.forFeature([
            Customer,
            CustomerAddress,
        ]),
        AuthModule,
    ],
    controllers: [CustomersController],
    providers: [
        CustomersService,
        CustomerAddressesService,
    ],
    exports: [CustomersService],
})
export class CustomersModule {}
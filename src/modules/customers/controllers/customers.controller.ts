import { Body, Controller, Get, Param, Post, Req, UseGuards } from "@nestjs/common";
import { CustomersService } from "@modules/customers/services/customers.service";
import { CreateCustomerDto } from "@modules/customers/dtos/createCustomer.dto";
import { LoginCustomerDto } from "@modules/customers/dtos/loginCustomer.dto";
import { AuthGuard } from "@modules/auth/guards/auth.guard";
import { CreateCustomerAddressDto } from "./dtos/createCustomerAddress.dto";
import { Request } from "express";
import { CustomerAddressesService } from "./services/customerAdresses.service";
import { CustomerGuard } from "@modules/auth/guards/customer.guard";
import { UserGuard } from "@modules/auth/guards/user.guard";
import { SetPermissions } from "@modules/auth/decorators/setPermissions.decorator";
import { PermissionFlagsBits } from "@modules/auth/helpers/permissionFlagsBits.helper";

@Controller('customers')
export class CustomersController {
    constructor(
        private readonly customersService: CustomersService,
        private readonly customerAddressesService: CustomerAddressesService,
    ) {}

    @SetPermissions(PermissionFlagsBits.ViewCustomers)
    @UseGuards(AuthGuard, UserGuard)
    @Get()
    async getCustomers() {
        return this.customersService.getCustomers();
    }

    @UseGuards(AuthGuard, CustomerGuard)
    @Get('/info')
    async getCustomerInfo(@Req() req: Request) {
        const data = req['data'];

        return data.customer;
    }

    @SetPermissions(PermissionFlagsBits.ViewCustomers)
    @UseGuards(AuthGuard, UserGuard)
    @Get('/info/:id')
    async getCustomerById(@Param('id') id: string) {
        return this.customersService.getCustomerById(id);
    }

    @Post('/signup')
    async signup(@Body() customerData: CreateCustomerDto) {
        await this.customersService.createCustomer(customerData);
        
        const { email, password } = customerData;
        const token = await this.customersService.loginCustomer(email, password);

        return { token };
    }

    @Post('/login')
    async login(@Body() loginData: LoginCustomerDto) {
        const { email, password } = loginData;

        const token = await this.customersService.loginCustomer(email, password);

        return { token };
    }

    @UseGuards(AuthGuard, CustomerGuard)
    @Post('/addresses')
    async createCustomerAddress(
        @Req() req: Request,
        @Body() addressData: CreateCustomerAddressDto,
    ) {
        const data = req['data'];

        const address = await this.customerAddressesService.createCustomerAddress(addressData, data.customer);
        
        return {
            created: true,
            address,
        };
    }
}
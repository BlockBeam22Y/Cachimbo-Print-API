import { Body, Controller, Get, Param, Post } from "@nestjs/common";
import { CustomersService } from "./customers.service";
import { CreateCustomerDto } from "./dtos/createCustomer.dto";
import { LoginCustomerDto } from "./dtos/loginCustomer.dto";

@Controller('customers')
export class CustomersController {
    constructor(
        private readonly customersService: CustomersService,
    ) {}

    @Get()
    async getCustomers() {
        return this.customersService.getCustomers();
    }

    @Get('/:id')
    async getCustomerById(@Param('id') id: string) {
        return this.customersService.getCustomerById(id);
    }

    @Post('/signup')
    async signup(@Body() customerData: CreateCustomerDto) {
        return this.customersService.createCustomer(customerData);
    }

    @Post('/login')
    async login(@Body() loginData: LoginCustomerDto) {
        const { email, password } = loginData;

        const customer = await this.customersService.loginCustomer(email, password);

        return {
            login: customer !== null,
            customer,
        };
    }
}
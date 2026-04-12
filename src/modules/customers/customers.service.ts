import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Customer } from "./entities/customer.entity";
import { Repository } from "typeorm";
import { CreateCustomerDto } from "./dtos/createCustomer.dto";

@Injectable()
export class CustomersService {
    constructor(
        @InjectRepository(Customer)
        private readonly customersRepository: Repository<Customer>,
    ) {}

    async getCustomers() {
        return this.customersRepository.find();
    }

    async createCustomer(customerData: CreateCustomerDto) {
        const customer = this.customersRepository.create({
            name: customerData.name,
            email: customerData.email,
            phone: customerData.phone,
            password: customerData.password,
        });
        
        return this.customersRepository.save(customer);
    }

    async loginCustomer(email: string, password: string) {
        const customer = await this.customersRepository.findOneBy({ email });

        if (customer && customer.password === password)
            return customer;
        else
            return null;
    }
}
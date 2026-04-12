import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Customer } from "./entities/customer.entity";
import { Repository } from "typeorm";
import { CreateCustomerDto } from "./dtos/createCustomer.dto";
import { hash, compare } from "bcrypt";

@Injectable()
export class CustomersService {
    constructor(
        @InjectRepository(Customer)
        private readonly customersRepository: Repository<Customer>,
    ) {}

    async getCustomers() {
        return this.customersRepository.find();
    }

    async getCustomerById(id: string) {
        const customer = await this.customersRepository.findOneBy({ id });

        if (!customer)
            throw new NotFoundException('Customer not found');

        return customer;
    }

    async createCustomer(customerData: CreateCustomerDto) {
        const hashedPassword = await hash(customerData.password, 10);

        const customer = this.customersRepository.create({
            name: customerData.name,
            email: customerData.email,
            phone: customerData.phone,
            password: hashedPassword,
        });
        
        return this.customersRepository.save(customer);
    }

    async loginCustomer(email: string, password: string) {
        const customer = await this.customersRepository.findOneBy({ email });

        if (customer && await compare(password, customer.password))
            return customer;
        
        return null;
    }
}
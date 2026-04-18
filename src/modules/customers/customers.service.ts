import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Customer } from "@modules/customers/entities/customer.entity";
import { Repository } from "typeorm";
import { CreateCustomerDto } from "@modules/customers/dtos/createCustomer.dto";
import { hash, compare } from "bcrypt";
import { JwtService } from "@nestjs/jwt";

@Injectable()
export class CustomersService {
    constructor(
        @InjectRepository(Customer)
        private readonly customersRepository: Repository<Customer>,
        private readonly jwtService: JwtService,
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
        
        await this.customersRepository.save(customer);
    }

    async loginCustomer(email: string, password: string) {
        const customer = await this.customersRepository.findOne({
            where: { email },
            select: {
                id: true,
                email: true,
                password: true,
            },
        });

        if (customer && await compare(password, customer.password)) {
            const token = await this.jwtService.signAsync({
                sub: customer.id,
                id: customer.id,
                email: customer.email,
            });

            return token;
        }
        
        throw new BadRequestException('Invalid login');
    }
}
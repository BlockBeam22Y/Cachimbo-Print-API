import { Customer } from "@modules/customers/entities/customer.entity";
import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

@Injectable()
export class CustomerGuard implements CanActivate {
    constructor(
        @InjectRepository(Customer)
        private readonly customersRepository: Repository<Customer>,
    ) {}

    async canActivate(context: ExecutionContext) {
        const request = context.switchToHttp().getRequest();
        const data = request['data'];

        if (data) {
            const customer = data && await this.customersRepository.findOne({
                where: {
                    id: data.id,
                },
                relations: {
                    orders: true,
                    addresses: true,
                },
            });

            if (!customer)
                throw new UnauthorizedException('Invalid customer token');

            request['data']['customer'] = customer;
        }

        return true;
    }
}
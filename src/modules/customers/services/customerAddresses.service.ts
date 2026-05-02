import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { CustomerAddress } from "@modules/customers/entities/customerAddress.entity";
import { Repository } from "typeorm";
import { CreateCustomerAddressDto } from "@modules/customers/dtos/createCustomerAddress.dto";
import { Customer } from "@modules/customers/entities/customer.entity";

@Injectable()
export class CustomerAddressesService {
    constructor(
        @InjectRepository(CustomerAddress)
        private readonly customerAddressesRepository: Repository<CustomerAddress>,
    ) {}

    async createCustomerAddress(addressData: CreateCustomerAddressDto, customer: Customer) {
        const address = this.customerAddressesRepository.create({
            lat: addressData.lat,
            lng: addressData.lng,
            postalCode: addressData.postalCode,
            customer,
        });

        return this.customerAddressesRepository.save(address);
    }
}
import Address from "../../domain/customer/value-object/address";
import Customer from "../../domain/customer/entity/customer";
import CustomerRepositoryInterface from "../../domain/customer/repository/customer-repository-interface";
import CustomerModel from "../db/sequelize/model/customer.model";

export default class CustomerRepository implements CustomerRepositoryInterface {
  async create(entity: Customer): Promise<void> {
    await CustomerModel.create({
      id: entity.id,
      name: entity.name,
      street: entity.address.street,
      number: entity.address.number,
      zip: entity.address.zip,
      city: entity.address.city,
      active: entity.isActive(),
      rewardPoints: entity.rewardPoints,
    });
  }

  async update(entity: Customer): Promise<void> {
    await CustomerModel.update(
      {
        name: entity.name,
        street: entity.address.street,
        number: entity.address.number,
        zip: entity.address.zip,
        city: entity.address.city,
        active: entity.isActive(),
        rewardPoints: entity.rewardPoints,
      },
      {
        where: {
          id: entity.id,
        },
      }
    );
  }

  async find(id: string): Promise<Customer> {
    let customerModel;

    try {
      customerModel = await CustomerModel.findOne({
        where: { id },
        rejectOnEmpty: true,
      });
    } catch (error) {
      throw new Error("Customer not found");
    }

    return this.mapCustomer(customerModel);
  }

  async findAll(): Promise<Customer[]> {
    const customerModels = await CustomerModel.findAll();
    return customerModels.map((customerModel) =>
      this.mapCustomer(customerModel)
    );
  }

  private mapCustomer(customerModel: CustomerModel): Customer {
    const customer = new Customer(customerModel.id, customerModel.name);

    customer.address = new Address(
      customerModel.street,
      customerModel.number,
      customerModel.zip,
      customerModel.city
    );

    customer.addRewardPoints(customerModel.rewardPoints);

    if (customerModel.active) {
      customer.activate();
    }

    return customer;
  }
}

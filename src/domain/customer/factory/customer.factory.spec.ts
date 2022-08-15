import Address from "../value-object/address";
import CustomerFactory from "./customer.factory";

describe("Customer factory unit test", () => {
  it("Should create a new customer", () => {
    const customer = CustomerFactory.create("John");

    expect(customer).toBeDefined();
    expect(customer.name).toBe("John");
    expect(customer.address).toBeUndefined();
  });

  it("Should create a new customer with address", () => {
    const address = new Address("Street 1", 1, "Zip1", "São Paulo");

    const customer = CustomerFactory.createWithAddress("John", address);

    expect(customer).toBeDefined();
    expect(customer.name).toBe("John");
    expect(customer.address).toBeDefined();
  });
});

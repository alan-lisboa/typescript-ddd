import { Sequelize } from "sequelize-typescript";
import Address from "../../../domain/customer/value-object/address";
import Customer from "../../../domain/customer/entity/customer";
import Order from "../../../domain/checkout/entity/order";
import OrderItem from "../../../domain/checkout/entity/order_item";
import Product from "../../../domain/product/entity/product";
import CustomerModel from "../../customer/sequelize/model/customer.model";
import OrderItemModel from "../../checkout/sequelize/model/order-item.model";
import OrderModel from "../../checkout/sequelize/model/order.model";
import ProductModel from "../../product/sequelize/model/product.model";
import CustomerRepository from "../../customer/repository/customer.repository";
import OrderRepository from "./order.repository";
import ProductRepository from "../../product/repository/product.repository";

describe("Order repository test", () => {
  let sequileze: Sequelize;

  beforeEach(async () => {
    sequileze = new Sequelize({
      dialect: "sqlite",
      storage: ":memory:",
      logging: false,
      sync: { force: true },
    });
    sequileze.addModels([
      OrderModel,
      OrderItemModel,
      CustomerModel,
      ProductModel,
    ]);
    await sequileze.sync();
  });

  afterEach(async () => {
    await sequileze.close();
  });

  it("Should create a new order", async () => {
    const customerRepository = new CustomerRepository();
    const customer = new Customer("1", "Customer 1");
    customer.address = new Address("Street 1", 1, "Zip 1", "City 1");

    await customerRepository.create(customer);

    const productRepository = new ProductRepository();
    const product = new Product("123", "Product 1", 10);

    await productRepository.create(product);

    const orderItem = new OrderItem(
      "1",
      product.name,
      product.price,
      product.id,
      2
    );

    const order = new Order("1", "1", [orderItem]);

    const orderRepository = new OrderRepository();
    await orderRepository.create(order);

    const orderModel = await OrderModel.findOne({
      where: { id: order.id },
      include: ["items"],
    });

    expect(orderModel.toJSON()).toStrictEqual({
      id: "1",
      customer_id: "1",
      total: order.total(),
      items: [
        {
          id: orderItem.id,
          name: orderItem.name,
          order_id: "1",
          price: orderItem.price,
          product_id: "123",
          quantity: orderItem.quantity,
        },
      ],
    });
  });

  it("Should find a order", async () => {
    const customerRepository = new CustomerRepository();
    const customer = new Customer("1", "Customer 1");
    customer.address = new Address("Street 1", 1, "Zip 1", "City 1");

    await customerRepository.create(customer);

    const productRepository = new ProductRepository();
    const product = new Product("123", "Product 1", 10);

    await productRepository.create(product);

    const orderItem = new OrderItem(
      "1",
      product.name,
      product.price,
      product.id,
      2
    );

    const order = new Order("1", "1", [orderItem]);

    const orderRepository = new OrderRepository();
    await orderRepository.create(order);

    const orderFound = await orderRepository.find(order.id);

    expect(order).toStrictEqual(orderFound);
  });

  it("should throw an error when order is not found", async () => {
    const orderRepository = new OrderRepository();

    expect(async () => {
      await orderRepository.find("456ABC");
    }).rejects.toThrow("Order not found");
  });

  it("Should insert a new item in a existing order", async () => {
    const customerRepository = new CustomerRepository();
    const customer = new Customer("1", "Customer 1");
    customer.address = new Address("Street 1", 1, "Zip 1", "City 1");

    await customerRepository.create(customer);

    const productRepository = new ProductRepository();
    const product1 = new Product("1", "Product 1", 10);

    await productRepository.create(product1);

    const orderItem1 = new OrderItem(
      "1",
      product1.name,
      product1.price,
      product1.id,
      2
    );

    const order = new Order("1", "1", [orderItem1]);

    const orderRepository = new OrderRepository();
    await orderRepository.create(order);

    const product2 = new Product("2", "Product 2", 10);

    await productRepository.create(product2);

    const orderItem2 = new OrderItem(
      "2",
      product2.name,
      product2.price,
      product2.id,
      2
    );

    order.addItem(orderItem2);

    await orderRepository.update(order);

    const orderModel = await OrderModel.findOne({
      where: { id: order.id },
      include: ["items"],
    });

    expect(orderModel.toJSON()).toStrictEqual({
      id: "1",
      customer_id: "1",
      total: order.total(),
      items: [
        {
          id: orderItem1.id,
          name: orderItem1.name,
          order_id: "1",
          price: orderItem1.price,
          product_id: "1",
          quantity: orderItem1.quantity,
        },
        {
          id: orderItem2.id,
          name: orderItem2.name,
          order_id: "1",
          price: orderItem2.price,
          product_id: "2",
          quantity: orderItem2.quantity,
        },
      ],
    });
  });

  it("Should exclude a item in a existing order", async () => {
    const customer = new Customer("1", "Customer 1");
    customer.address = new Address("Street 1", 1, "Zip 1", "City 1");

    const customerRepository = new CustomerRepository();
    await customerRepository.create(customer);

    const productRepository = new ProductRepository();
    const product1 = new Product("1", "Product 1", 10);
    await productRepository.create(product1);

    const product2 = new Product("2", "Product 2", 10);
    await productRepository.create(product2);

    const orderItem1 = new OrderItem(
      "1",
      product1.name,
      product1.price,
      product1.id,
      2
    );

    const orderItem2 = new OrderItem(
      "2",
      product2.name,
      product2.price,
      product2.id,
      2
    );

    const order = new Order("1", "1", [orderItem1, orderItem2]);

    const orderRepository = new OrderRepository();

    await orderRepository.create(order);
    const createdOrderFound = await orderRepository.find(order.id);
    expect(order).toStrictEqual(createdOrderFound);

    order.removeItem("2");
    await orderRepository.update(order);
    const updatedOrderFound = await orderRepository.find(order.id);
    expect(order).toStrictEqual(updatedOrderFound);
  });
});

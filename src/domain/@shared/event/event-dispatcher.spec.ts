import SendEmailWhenProductIsCreatedHandler from "../../product/event/handler/send-email-when-product-is-created.handler";
import ProductCreatedEvent from "../../product/event/product-created.event";
import EventDispatcher from "./event-dispatcher";

describe("Domain events tests", () => {
  it("Should register an event handler", () => {
    const eventDispacher = new EventDispatcher();
    const eventHandler = new SendEmailWhenProductIsCreatedHandler();

    eventDispacher.register("ProductCreatedEvent", eventHandler);

    expect(
      eventDispacher.getEventHandlers["ProductCreatedEvent"]
    ).toBeDefined();

    expect(eventDispacher.getEventHandlers["ProductCreatedEvent"].length).toBe(
      1
    );

    expect(
      eventDispacher.getEventHandlers["ProductCreatedEvent"][0]
    ).toMatchObject(eventHandler);
  });

  it("Should unregister an event handler", () => {
    const eventDispacher = new EventDispatcher();
    const eventHandler = new SendEmailWhenProductIsCreatedHandler();

    eventDispacher.register("ProductCreatedEvent", eventHandler);

    expect(
      eventDispacher.getEventHandlers["ProductCreatedEvent"][0]
    ).toMatchObject(eventHandler);

    eventDispacher.unregister("ProductCreatedEvent", eventHandler);

    expect(
      eventDispacher.getEventHandlers["ProductCreatedEvent"]
    ).toBeDefined();

    expect(eventDispacher.getEventHandlers["ProductCreatedEvent"].length).toBe(
      0
    );
  });

  it("Should unregister all event handlers", () => {
    const eventDispacher = new EventDispatcher();
    const eventHandler = new SendEmailWhenProductIsCreatedHandler();

    eventDispacher.register("ProductCreatedEvent", eventHandler);

    expect(
      eventDispacher.getEventHandlers["ProductCreatedEvent"][0]
    ).toMatchObject(eventHandler);

    eventDispacher.unregisterAll();

    expect(
      eventDispacher.getEventHandlers["ProductCreatedEvent"]
    ).toBeUndefined();
  });

  it("Should notify all event handlers", () => {
    const eventDispacher = new EventDispatcher();
    const eventHandler = new SendEmailWhenProductIsCreatedHandler();
    const spyEventHandler = jest.spyOn(eventHandler, "handle");

    eventDispacher.register("ProductCreatedEvent", eventHandler);

    expect(
      eventDispacher.getEventHandlers["ProductCreatedEvent"][0]
    ).toMatchObject(eventHandler);

    const productCreatedEvent = new ProductCreatedEvent({
      name: "Product 1",
      description: "Product 1 description",
      price: 10.0,
    });

    eventDispacher.notify(productCreatedEvent);

    expect(spyEventHandler).toHaveBeenCalled();
  });
});

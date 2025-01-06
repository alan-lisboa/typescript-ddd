import EventDispatcher from "../../@shared/event/event-dispatcher";
import CustomerCreatedEvent from "./customer-created.event";
import EnviarConsoleLog1Handler from "./handler/customer-send-console-log1.handler";
import EnviarConsoleLog2Handler from "./handler/customer-send-console.log2.handler";


describe("customer creation event notification", () => {

    it("should notify all events when create customer", () => {
        const eventDispatcher = new EventDispatcher();
        const eventHandler1 = new EnviarConsoleLog1Handler();
        const eventHandler2 = new EnviarConsoleLog2Handler();
        const spyEventHandler1 = jest.spyOn(eventHandler1, "handle");
        const spyEventHandler2 = jest.spyOn(eventHandler2, "handle");

        eventDispatcher.register("CustomerCreatedEvent", eventHandler1);
        eventDispatcher.register("CustomerCreatedEvent", eventHandler2);

        expect(eventDispatcher.getEventHandlers["CustomerCreatedEvent"][0]).toMatchObject(eventHandler1);
        expect(eventDispatcher.getEventHandlers["CustomerCreatedEvent"][1]).toMatchObject(eventHandler2);
        expect(eventDispatcher.getEventHandlers["CustomerCreatedEvent"].length).toBe(2);

        const customerCreatedEvent = new CustomerCreatedEvent({
            id: "1",
            name: "John Doe",
        });

        eventDispatcher.notify(customerCreatedEvent);
        expect(spyEventHandler1).toHaveBeenCalled();
        expect(spyEventHandler2).toHaveBeenCalled();
    });
});
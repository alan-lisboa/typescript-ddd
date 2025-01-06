import EventDispatcher from "../../@shared/event/event-dispatcher";
import EnviarConsoleLogHandler from "./handler/customer-send-console-log.handler";
import CustomerAddressChangedEvent from "./customer-address-changed.event";

describe("change address event notification", () => {
    it("should notify all events when change address", () => {
        const eventDispatcher = new EventDispatcher();
        const eventHandler = new EnviarConsoleLogHandler();
        const spyEventHandler = jest.spyOn(eventHandler, "handle");

        eventDispatcher.register("CustomerAddressChangedEvent", eventHandler);

        expect(eventDispatcher.getEventHandlers["CustomerAddressChangedEvent"][0]).toMatchObject(eventHandler);
        expect(eventDispatcher.getEventHandlers["CustomerAddressChangedEvent"].length).toBe(1);

        const customerAddressChangedEvent = new CustomerAddressChangedEvent({
            id: "1",
            name: "John Doe",
            address: "New Customer Address"
        });

        eventDispatcher.notify(customerAddressChangedEvent);
        expect(spyEventHandler).toHaveBeenCalled();
    })
});
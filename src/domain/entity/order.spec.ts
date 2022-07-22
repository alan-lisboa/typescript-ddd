import Order from "./order";
import OrderItem from "./order_item";

describe("Order unit tests", () =>{

    it("Should throw error when id is empty", () => {
        expect(() => {
            let order = new Order("", "123", []);
        }).toThrowError("Id is required");
    });

    it("Should throw error when customerId is empty", () => {
        expect(() => {
            let order = new Order("1", "", []);
        }).toThrowError("customerId is required");
    });

    it("Should throw error when items is empty", () => {
        expect(() => {
            let order = new Order("1", "1", []);
        }).toThrowError("Items are required");
    });

    
    it("Should calculate total", () => {
        const item = new OrderItem("i1", "Item 1", 100, "1", 2);
        const order = new Order("o1", "c1", [item]);
        const total = order.total();

        expect(total).toBe(200);

        const item2 = new OrderItem("i2", "Item 2", 200, "1", 2);
        const order2 = new Order("o2", "c1", [item, item2]);

        const total2 = order2.total();

        expect(total2).toBe(600);

    });

    it("Should throw error if item qtd is less or equals 0", () => {
        expect(() => {
            const item = new OrderItem("i1", "Item 1", 100, "1", 0);
            const order = new Order("o1", "c1", [item]);    
        }).toThrowError("Quantity must be greater than 0");
    });
});
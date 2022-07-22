import OrderItem from "./order_item";

export default class Order {
  private _id: string;
  private _customerId: string;
  private _items: OrderItem[];

  constructor(id: string, customerId: string, items: OrderItem[]) {
    this._id = id;
    this._customerId = customerId;
    this._items = items;

    this.validate();
  }

  get id(): string {
    return this._id;
  }

  get customerId(): string {
    return this._customerId;
  }

  get items(): OrderItem[] {
    return this._items;
  }

  validate(): boolean {
    if (this._id.length === 0) {
      throw new Error("Id is required");
    }

    if (this._customerId.length === 0) {
      throw new Error("customerId is required");
    }

    if (this._items.length === 0) {
      throw new Error("Items are required");
    }

    if (this._items.some((item) => item.quantity <= 0)) {
      throw new Error("Quantity must be greater than 0");
    }
    return true;
  }
  total(): number {
    return this._items.reduce(
      (acc, item) => acc + item.price * item.quantity,
      0
    );
  }
  addItem(item: OrderItem) {
    if (item === null) {
      throw new Error("Item is required");
    }
    if (item.quantity <= 0) {
      throw new Error("Quantity must be greater than 0");
    }
    if (item.productId.length === 0) {
      throw new Error("Product Id is required");
    }
    this._items.push(item);
  }

  removeItem(id: string) {
    if (id.length === 0) {
      throw new Error("id is required");
    }

    this._items = this._items.filter((item) => item.id != id);
  }
}

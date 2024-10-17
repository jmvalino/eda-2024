export class InventoryInitializationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "InventoryInitializationError";
  }
}

export class InventoryRetrievalError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "InventoryRetrievalError";
  }
}

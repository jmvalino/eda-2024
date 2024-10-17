import { InventoryItem } from "../domain/InventoryItem";
import { InventoryRetrievalError } from "../errors/inventoryErrors";

export class InventoryQueryService {
  private inventory: Map<string, InventoryItem>;

  constructor(inventory: Map<string, InventoryItem>) {
    if (!inventory || inventory.size === 0) {
      throw new InventoryRetrievalError(
        "Inventory is empty or not initialized."
      );
    }
    this.inventory = inventory;
  }

  getInventory(): InventoryItem[] {
    if (this.inventory.size === 0) {
      throw new InventoryRetrievalError("No items found in the inventory.");
    }

    return Array.from(this.inventory.values()).map((item) => {
      if (!item.id || !item.name) {
        throw new InventoryRetrievalError(
          `Invalid item in inventory: ${JSON.stringify(item)}`
        );
      }
      if (item.quantity < 0) {
        throw new InventoryRetrievalError(
          `Item with negative quantity found: ${item.id}`
        );
      }
      return item;
    });
  }
}

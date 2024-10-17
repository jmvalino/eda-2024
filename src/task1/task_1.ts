import { InventoryItem } from "../domain/InventoryItem";
import { InventoryUpdateEvent } from "../event/InventoryUpdateEvent";

export class InventoryEventHandler {
  private inventory: Map<string, InventoryItem> = new Map();
  private processedEvents: Set<InventoryUpdateEvent> = new Set();

  constructor(initialInventory: InventoryItem[]) {
    initialInventory.forEach((item) => this.inventory.set(item.id, item));
  }

  handleInventoryUpdate(event: InventoryUpdateEvent): void {
    if (this.processedEvents.has(event)) {
      console.log(
        `Event ${event.eventInfo.eventId} has already been processed. Skipping.`
      );
      return;
    }

    const item = this.inventory.get(event.itemId);
    if (item) {
      item.quantity += event.quantityChange;
      item.quantity = Math.max(0, item.quantity);
      this.processedEvents.add(event);
      this.inventory.set(event.itemId, item);
    } else {
      console.warn(`Item with ID ${event.itemId} not found.`);
    }
  }

  getInventory(): InventoryItem[] {
    return Array.from(this.inventory.values());
  }
}

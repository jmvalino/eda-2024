import { test } from "node:test";
import assert from "node:assert";
import { InventoryEventHandler } from "./task_1";
import { InventoryItem } from "../domain/InventoryItem";
import { InventoryUpdateEvent } from "../event/InventoryUpdateEvent";

test("should update inventory on receiving valid event", () => {
  const initialInventory: InventoryItem[] = [
    { id: "item1", name: "Widget A", quantity: 10 },
    { id: "item2", name: "Widget B", quantity: 5 },
  ];
  const eventHandler = new InventoryEventHandler(initialInventory);
  const event: InventoryUpdateEvent = {
    eventInfo: {
      eventId: "1",
    },
    itemId: "item1",
    quantityChange: 5,
  };

  eventHandler.handleInventoryUpdate(event);
  const updatedInventory = eventHandler.getInventory();

  assert.strictEqual(
    updatedInventory.find((item) => item.id === "item1")?.quantity,
    15,
    "Inventory should be updated."
  );
});

test("should not process the same event twice (idempotency)", () => {
  const initialInventory: InventoryItem[] = [
    { id: "item1", name: "Widget A", quantity: 10 },
    { id: "item2", name: "Widget B", quantity: 5 },
  ];
  const eventHandler = new InventoryEventHandler(initialInventory);
  const event: InventoryUpdateEvent = {
    eventInfo: {
      eventId: "1",
    },
    itemId: "item1",
    quantityChange: 5,
  };

  eventHandler.handleInventoryUpdate(event);
  eventHandler.handleInventoryUpdate(event); // Second time (should be ignored)
  const updatedInventory = eventHandler.getInventory();

  assert.strictEqual(
    updatedInventory.find((item) => item.id === "item1")?.quantity,
    15,
    "Event should not be processed twice."
  );
});

test("should prevent negative inventory quantities", () => {
  const initialInventory: InventoryItem[] = [
    { id: "item1", name: "Widget A", quantity: 10 },
    { id: "item2", name: "Widget B", quantity: 5 },
  ];
  const eventHandler = new InventoryEventHandler(initialInventory);
  const event: InventoryUpdateEvent = {
    eventInfo: {
      eventId: "2",
    },
    itemId: "item2",
    quantityChange: -10,
  };

  eventHandler.handleInventoryUpdate(event);
  const updatedInventory = eventHandler.getInventory();

  assert.strictEqual(
    updatedInventory.find((item) => item.id === "item2")?.quantity,
    0,
    "Quantity should not go below zero."
  );
});

test("should skip events for non-existent items", () => {
  const initialInventory: InventoryItem[] = [
    { id: "item1", name: "Widget A", quantity: 10 },
    { id: "item2", name: "Widget B", quantity: 5 },
  ];
  const eventHandler = new InventoryEventHandler(initialInventory);
  const event: InventoryUpdateEvent = {
    eventInfo: {
      eventId: "3",
    },
    itemId: "nonExistentItem",
    quantityChange: 10,
  };

  eventHandler.handleInventoryUpdate(event);
  const updatedInventory = eventHandler.getInventory();

  assert.strictEqual(
    updatedInventory.length,
    2,
    "Non-existent items should be ignored."
  );
});

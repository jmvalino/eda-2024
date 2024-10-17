import { handler } from "./task_3";
import { APIGatewayEvent } from "aws-lambda";
import { InventoryQueryService } from "../application/inventoryQueryService";
import {
  InventoryRetrievalError,
  InventoryInitializationError,
} from "../errors/inventoryErrors";
import { describe, it } from "node:test";
import assert from "node:assert";

// Mock APIGatewayEvent
const mockEvent = {} as APIGatewayEvent;

// Sample inventory data
const inventoryMap = new Map([
  ["SKU12345", { id: "SKU12345", name: "Product A", quantity: 50 }],
  ["SKU67890", { id: "SKU67890", name: "Product B", quantity: 20 }],
  ["SKU54321", { id: "SKU54321", name: "Product C", quantity: 75 }],
]);

describe("Inventory Lambda Handler Tests", () => {
  it("should return 200 and the inventory data", async () => {
    const inventoryQueryService = new InventoryQueryService(inventoryMap);

    const response = await handler(mockEvent, inventoryQueryService);

    assert.strictEqual(response.statusCode, 200);
    const inventory = JSON.parse(response.body);
    assert.deepStrictEqual(inventory, [
      { id: "SKU12345", name: "Product A", quantity: 50 },
      { id: "SKU67890", name: "Product B", quantity: 20 },
      { id: "SKU54321", name: "Product C", quantity: 75 },
    ]);
  });

  it("should handle InventoryRetrievalError and return 400", async () => {
    const inventoryQueryService = new InventoryQueryService(inventoryMap);
    inventoryQueryService.getInventory = function () {
      throw new InventoryRetrievalError("Failed to retrieve inventory");
    };

    const response = await handler(mockEvent, inventoryQueryService);
    assert.strictEqual(response.statusCode, 400);
    const errorResponse = JSON.parse(response.body);
    assert.strictEqual(
      errorResponse.message,
      "Inventory retrieval error: Failed to retrieve inventory"
    );
  });

  it("should handle InventoryInitializationError and return 500", async () => {
    const inventoryQueryService = new InventoryQueryService(inventoryMap);
    inventoryQueryService.getInventory = function () {
      throw new InventoryInitializationError("Failed to initialize inventory");
    };

    const response = await handler(mockEvent, inventoryQueryService);
    assert.strictEqual(response.statusCode, 500);
    const errorResponse = JSON.parse(response.body);
    assert.strictEqual(
      errorResponse.message,
      "Inventory initialization error: Failed to initialize inventory"
    );
  });

  it("should handle an unexpected error and return 500", async () => {
    const inventoryQueryService = new InventoryQueryService(inventoryMap);
    inventoryQueryService.getInventory = function () {
      throw new Error("Unexpected error");
    };

    const response = await handler(mockEvent, inventoryQueryService);
    assert.strictEqual(response.statusCode, 500);
    const errorResponse = JSON.parse(response.body);
    assert.strictEqual(errorResponse.message, "Internal server error");
  });
});

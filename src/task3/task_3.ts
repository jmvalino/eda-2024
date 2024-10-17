import { APIGatewayEvent } from "aws-lambda";
import {
  InventoryRetrievalError,
  InventoryInitializationError,
} from "../errors/inventoryErrors";
import { InventoryQueryService } from "../application/inventoryQueryService";

export const handler = async (
  _event: APIGatewayEvent,
  inventoryQueryService: InventoryQueryService
) => {
  try {
    const inventory = inventoryQueryService.getInventory();

    return {
      statusCode: 200,
      body: JSON.stringify(
        Array.from(inventory.entries()).map(([key, value]) => value)
      ),
    };
  } catch (error) {
    if (error instanceof InventoryRetrievalError) {
      return {
        statusCode: 400,
        body: JSON.stringify({
          message: `Inventory retrieval error: ${error.message}`,
        }),
      };
    }

    if (error instanceof InventoryInitializationError) {
      return {
        statusCode: 500,
        body: JSON.stringify({
          message: `Inventory initialization error: ${error.message}`,
        }),
      };
    }

    return {
      statusCode: 500,
      body: JSON.stringify({ message: "Internal server error" }),
    };
  }
};

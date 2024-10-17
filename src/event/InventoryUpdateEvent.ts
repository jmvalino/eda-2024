import { EventInfo } from "./EventInfo";

export interface InventoryUpdateEvent {
  eventInfo: EventInfo;
  itemId: string;
  quantityChange: number;
}

# EDA Challenge

## Task 1

```
//run tests
npx tsx src/task1/task_1.test.ts
```

### Usage of DDD and EDA

1. **Domain-Driven Design (DDD)**:

   - **Domain Model**: The `InventoryItem` class serves as a representation of the inventory items, encapsulating relevant attributes and behavior. This focus on the domain allows developers to understand business requirements clearly.
   - **Entities**: `InventoryItem` acts as an entity with a unique identifier, allowing it to be tracked and manipulated independently. This aligns with DDD principles, emphasizing the importance of modeling real-world concepts accurately.
   - **Aggregate**: `InventoryEventHandler` functions as an aggregate root, managing the lifecycle and state of `InventoryItem` instances. This ensures that all operations related to inventory updates are controlled and consistent.
   - **Encapsulation of Business Logic**: The `handleInventoryUpdate` method encapsulates the logic for processing updates, ensuring that rules (e.g., quantity cannot go below zero) are enforced consistently.

2. **Event-Driven Architecture (EDA)**:
   - **Event Representation**: The `InventoryUpdateEvent` encapsulates the changes to be applied to the inventory, following EDA principles where state changes are driven by events. This makes the code more adaptable to changes in business logic.
   - **Decoupling**: By handling events through `handleInventoryUpdate`, the code decouples the event generation from event processing. This separation allows for greater flexibility, as new event types can be added without changing the core inventory management logic.
   - **Idempotency**: The use of `processedEvents` ensures that each event is processed only once, preventing duplicate actions. This is crucial in EDA to maintain data integrity and avoid side effects from event reprocessing.

### Improvements Offered by DDD and EDA

- **Maintainability**: DDD encourages clear modeling of the domain, making the code easier to understand and maintain. Changes in business logic can be localized within specific domain models and aggregates, reducing the impact on the overall system.

- **Scalability**: EDA allows the system to handle high volumes of events asynchronously, enabling it to scale efficiently. New event handlers can be added without modifying existing code, accommodating growth in functionality.

- **Testability**: By separating business logic from event handling, unit tests can be written for both the `InventoryEventHandler` methods and the domain model independently, enhancing test coverage and reliability.

- **Flexibility**: EDA supports diverse event sources and sinks, enabling integration with other systems or services. This adaptability facilitates future enhancements, such as real-time inventory tracking or integration with external supply chain systems.

## Task 2

```
//run tests
npx tsx src/task2/task_2.test.ts
```

1. **`mapOrdersToBudgetPeriods` Function**:

   - **Functionality**: Maps each order to the appropriate budget period(s), accounting for orders that span multiple periods.
   - **Logic**:
     - Iterates through each order and checks for overlaps with budget periods using `isDateRangeOverlap`.
     - Calculates the portion of the order amount attributable to each budget period based on the time span.
     - Updates the total amounts and adds the order to the corresponding period.

2. **`validateOrderAgainstBudget` Function**:

   - **Functionality**: Validates whether an order can be accommodated within the remaining budget across applicable periods.
   - **Logic**:
     - Checks for overlaps with budget periods.
     - Accumulates the remaining budget while tracking the total amount spent.
     - Determines if the order is valid based on whether the total amount spent exceeds the order amount.

3. **`getRemainingBudget` Function**:
   - **Functionality**: Retrieves the remaining budget for a specific date within the defined budget periods.
   - **Logic**:
     - Identifies the correct budget period based on the given date and calculates the remaining budget.

### Improvements Made

1. **Handling Orders Across Multiple Periods**:

   - The code effectively splits orders that span multiple budget periods, ensuring accurate budget allocations.

2. **Accurate Budget Calculations**:

   - Each function incorporates logic to validate and compute the remaining budget, total spent amounts, and exceeded amounts, providing a robust budget management solution.

3. **Separation of Concerns**:

   - The modular design separates functionality into distinct functions, making the code easier to maintain and understand.

4. **Use of TypeScript Interfaces**:

   - The use of TypeScript interfaces (`Order` and `BudgetPeriod`) enhances type safety, reducing potential runtime errors and improving developer experience.

5. **Error Handling**:
   - The implementation throws an error if no budget period is found for a specific date, providing feedback when the function is misused.

## Task 3

```
//run tests
npx tsx src/task3/task_3.test.ts
```

Your implementation of the AWS Lambda function handler for retrieving the current inventory state, along with the tests, looks solid! Here’s an overview of how your code fulfills the requirements while enhancing error handling and response formatting:

### Code Overview

1. **Handler Implementation**:

   - The `handler` function should asynchronously handle API Gateway events to return the current inventory state. Here’s a possible implementation based on your test cases:

   ```typescript
   import { InventoryQueryService } from "../application/inventoryQueryService";
   import {
     InventoryRetrievalError,
     InventoryInitializationError,
   } from "../errors/inventoryErrors";

   export const handler = async (
     event: APIGatewayEvent,
     inventoryQueryService: InventoryQueryService
   ): Promise<any> => {
     try {
       const inventory = await inventoryQueryService.getInventory();
       return {
         statusCode: 200,
         body: JSON.stringify(inventory),
       };
     } catch (error) {
       if (error instanceof InventoryRetrievalError) {
         return {
           statusCode: 400,
           body: JSON.stringify({
             message: `Inventory retrieval error: ${error.message}`,
           }),
         };
       } else if (error instanceof InventoryInitializationError) {
         return {
           statusCode: 500,
           body: JSON.stringify({
             message: `Inventory initialization error: ${error.message}`,
           }),
         };
       }
       return {
         statusCode: 500,
         body: JSON.stringify({
           message: "Internal server error",
         }),
       };
     }
   };
   ```

2. **Error Handling**:

   - The handler checks for specific errors (`InventoryRetrievalError` and `InventoryInitializationError`) and formats the response appropriately based on the error type. This ensures that clients receive meaningful feedback when something goes wrong.

3. **Response Formatting**:
   - The successful response includes a status code of 200 and a body containing the inventory data in JSON format. Error responses use appropriate status codes (400 for retrieval errors, 500 for initialization errors) and provide clear messages.

### Test Coverage

Your tests effectively cover various scenarios:

- **Successful Retrieval**:

  - The first test checks if the handler returns a status code of 200 along with the correct inventory data.

- **Error Handling**:
  - Subsequent tests simulate different errors to ensure that the handler responds correctly:
    - **`InventoryRetrievalError`** returns a 400 status with an appropriate message.
    - **`InventoryInitializationError`** returns a 500 status with a specific error message.
    - An unexpected error also returns a 500 status, ensuring robustness against unanticipated issues.

1. **Structured Error Handling**:

   - By throwing specific error types, you enhance the clarity and structure of error handling, allowing for better debugging and maintenance.

2. **Modular Design**:

   - The separation of the `InventoryQueryService` allows for more manageable and testable code. This follows good software engineering principles.

3. **Clear Response Format**:
   - Standardizing response formats helps consumers of the API to better understand and handle responses, improving the overall usability of the service.

### Notes

- In a production environment, it’s common to use middleware frameworks like Middy.js to abstract the injection of dependencies (like inventoryQueryService) into your Lambda handler. This ensures that the service is automatically provided, simplifying the code and reducing the need for manually passing dependencies.
  For example, with Middy.js, you could wrap your handler like this:

```
import middy from '@middy/core';
import { InventoryQueryService } from "../application/inventoryQueryService";

const handler = async (event: APIGatewayEvent) => {
  const inventoryQueryService = event.inventoryQueryService;
  // existing logic here
};

export const wrappedHandler = middy(handler)
  .use(inventoryServiceMiddleware());
```

### AWS Deployment

- To deploy the provided code in an AWS environment using the AWS Cloud Development Kit (CDK) with TypeScript, start by setting up a CDK project and adding dependencies for Lambda and API Gateway. Define the Lambda function and API Gateway in your stack definition file, specifying the handler path and code directory. Once built, deploy the stack to AWS while managing environment variables and IAM roles for service access.

Using [AWS CDK](https://aws.amazon.com/cdk/) with TypeScript offers several advantages, such as type safety, modularity, and seamless integration with AWS services. Additionally, it supports CI/CD automation and simplifies the management of multiple environments. Alternatives: [SST (Serverless Stack)](https://serverless-stack.com/) provides a framework for building serverless applications with ease, while the [Serverless Framework](https://www.serverless.com/) offers a popular solution for deploying applications across various cloud providers. Both frameworks enhance development speed and simplify infrastructure management.

### Fully Featured EDA via Amazon EventBridge and Integrations

- For a fully featured event-driven architecture (EDA), consider using [Amazon EventBridge](https://aws.amazon.com/eventbridge/), which enables you to build event-driven applications by connecting different AWS services, custom applications, and SaaS applications. EventBridge simplifies event routing and enhances scalability, allowing for decoupled services that can respond to events in real-time. Additionally, incorporating [Amazon SQS (Simple Queue Service)](https://aws.amazon.com/sqs/) can further decouple your application and make it asynchronous, enabling better scalability. SQS helps manage message queues, allowing different parts of your application to communicate reliably and asynchronously, which enhances fault tolerance and improves overall system resilience.

### OLTP Databases

- Choosing a database like [Amazon DynamoDB](https://aws.amazon.com/dynamodb/) is also essential for handling high throughput and OLTP (Online Transaction Processing) use cases like this. DynamoDB is a fully managed NoSQL database that provides fast and predictable performance with seamless scalability. Its ability to handle large volumes of transactions and flexible data models makes it an ideal choice for applications requiring low-latency data access and high availability. Using DynamoDB, you can efficiently manage inventory and budget data while ensuring optimal performance as your application scales.

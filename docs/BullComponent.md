# BullComponent

The `BullComponent` is a message queue manager built using Bull.js. It provides functionality for sending, processing, and monitoring messages in a queue.

## Features

- **Message Sending**: Add messages to the queue for asynchronous processing.
- **Message Processing**: Define processors to handle messages with configurable concurrency.
- **Queue Monitoring**: Retrieve metrics such as active, completed, and failed jobs.
- **Dynamic Configuration**: Update queue options dynamically.

## Usage

### Initialization

```typescript
import { BullComponent } from "./component/BullComponent";

const bullComponent = new BullComponent("my-queue", {
  redis: { host: "127.0.0.1", port: 6379 },
});
```

### Sending Messages

```typescript
await bullComponent.sendMessage({ task: "example-task" });
```

### Monitoring Queue

```typescript
const metrics = await bullComponent.getQueueMetrics();
console.log(metrics);
```

### Updating Configuration

```typescript
bullComponent.setQueueOptions({ redis: { host: "new-host", port: 6380 } });
```

## Dependencies

- [Bull.js](https://github.com/OptimalBits/bull)

## Notes

- Ensure Redis is running and accessible for the queue to function properly.
- Use appropriate error handling for production environments.

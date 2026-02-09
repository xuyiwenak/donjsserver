import { strict as assert } from "assert";
import sinon from "sinon";

import { BullComponent } from "../src/component/BullComponent";

describe("BullComponent", () => {
  let bullComponent: BullComponent;
  let queueMock: any;

  beforeEach(() => {
    queueMock = {
      add: sinon.stub(),
      process: sinon.stub(),
      getActiveCount: sinon.stub(),
      getCompletedCount: sinon.stub(),
      getFailedCount: sinon.stub(),
      close: sinon.stub(), // Add close method to the mock
    };
    bullComponent = new BullComponent("test-queue");
    bullComponent.setMockqueue; // Inject mock queue
  });

  it("should add a message to the queue", async () => {
    const message = { task: "test" };
    queueMock.add.resolves({ id: "job-id" });

    const job = await bullComponent.sendMessage(message);

    assert(queueMock.add.calledWith(message));
    assert.equal(job.id, "job-id");
  });

  //   it("should process messages with the given concurrency", () => {
  //     const processor = sinon.stub();

  //     bullComponent.processMessages(5, processor);

  //     assert(queueMock.process.calledWith(5, processor));
  //   });

  it("should return queue metrics", async () => {
    queueMock.getActiveCount.resolves(2);
    queueMock.getCompletedCount.resolves(5);
    queueMock.getFailedCount.resolves(1);

    const metrics = await bullComponent.getQueueMetrics();

    assert.deepEqual(metrics, { active: 2, completed: 5, failed: 1 });
  });

  it("should stop and release resources", async () => {
    queueMock.close.resolves();

    await bullComponent.stop();

    assert(queueMock.close.calledOnce);
    console.log("Stop function tested successfully.");
  });
});

import { Kafka, ITopicConfig, Consumer, Producer, ConsumerConfig } from 'kafkajs';

import { STEP_PHASE } from '../enums/step-phase';
import { createBunyanLogger } from '../loaders/logger';
import { SagaDefinition, SagaMessage } from './saga-types';

const kafka = new Kafka({ brokers: ['localhost:9092'] });
const admin = kafka.admin();
const log = createBunyanLogger('SagaProcessor');

export class SagaProcessor {
  producer: Producer = kafka.producer();
  consumer: Consumer = kafka.consumer({ groupId: 'temp-group', } as ConsumerConfig);

  constructor(private sagaDefinitions: SagaDefinition[]) { }

  async init(): Promise<void> {
    await admin.connect();
    await this.producer.connect();
    await this.consumer.connect();

    const stepTopics = this.sagaDefinitions.map(definition => definition.channelName);

    // Create all channels (topics) for all saga steps
    const kafkaTopics = stepTopics.map((topic): ITopicConfig => ({ topic }));
    await admin.createTopics({ topics: kafkaTopics });

    // Subscribe to all created channels of all saga steps
    for (const topic of stepTopics) {
      await this.consumer.subscribe({ topic });
    }

    await this.consumer.run({
      autoCommit: true,
      // autoCommitInterval: 1,
      eachMessage: async ({ message }) => {
        const sagaMessage = JSON.parse(message.value?.toString()) as SagaMessage;

        const { saga, payload } = sagaMessage;
        const { index, phase } = saga;

        switch (phase) {
          case STEP_PHASE.STEP_FORWARD: {
            const stepForward = this.sagaDefinitions[index].phases[STEP_PHASE.STEP_FORWARD]?.command;
            try {
              await stepForward(payload);
              await this.makeStepForward(index + 1, payload);
            } catch (error) {
              await this.makeStepBackward(index - 1, payload);
            }
            // await this.consumer.commitOffsets([{ topic, partition, offset: (Number(message.offset) + 1).toString() }])
            return;
          }
          case STEP_PHASE.STEP_BACKWARD: {
            const stepBackward = this.sagaDefinitions[index].phases[STEP_PHASE.STEP_BACKWARD]?.command;
            await stepBackward();
            await this.makeStepBackward(index - 1, payload);
            return;
          }
          default:
            log.info('UNAVAILABLE SAGA PHASE');
        }
      }
    })
  }

  async makeStepForward(index: number, payload): Promise<void> {
    if (index >= this.sagaDefinitions.length) {
      log.info('Saga finished and transaction successful');
      return;
    }
    const message = { payload, saga: { index, phase: STEP_PHASE.STEP_FORWARD } };
    await this.producer.send({
      topic: this.sagaDefinitions[index].channelName,
      messages: [{ value: JSON.stringify(message) }]
    });
  }

  async makeStepBackward(index: number, payload): Promise<void> {
    if (index < 0) {
      log.info('Saga finished and transaction rolled back');
      return;
    }
    await this.producer.send({
      topic: this.sagaDefinitions[index].channelName,
      messages: [{ value: JSON.stringify({ payload, saga: { index, phase: STEP_PHASE.STEP_BACKWARD } }) }]
    });
  }

  async start(payload): Promise<void> {
    await this.makeStepForward(0, payload);
    log.info('Saga started');
  }
}
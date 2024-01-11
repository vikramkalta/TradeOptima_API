import { STEP_PHASE } from '../enums/index';
import { SagaProcessor } from './saga-processor';
import { Command, SagaDefinition } from './saga-types';

export class SagaDefinitionBuilder {
  index: number | null = null;
  sagaDefinitions: SagaDefinition[] = [];

  step(channelName: string): SagaDefinitionBuilder {
    this.index = this.index === null ? 0 : this.index + 1;
    this.sagaDefinitions = [...this.sagaDefinitions, { channelName, phases: {} }];
    return this;
  }

  onReply(command: Command, data?): SagaDefinitionBuilder {
    this.checkIndex();
    this.sagaDefinitions[this.index].phases[STEP_PHASE.STEP_FORWARD] = { command, data };
    return this;
  }

  withCompensation(command: Command): SagaDefinitionBuilder {
    this.checkIndex();
    this.sagaDefinitions[this.index].phases[STEP_PHASE.STEP_BACKWARD] = { command };
    return this;
  }

  private checkIndex(): void {
    if (this.index === null) {
      throw new Error('Before build saga definition, you need to invoke step function before')
    }
  }

  async build(): Promise<SagaProcessor> {
    const sagaProcessor = new SagaProcessor(this.sagaDefinitions);
    await sagaProcessor.init();
    return sagaProcessor;
  }
}
import { STEP_PHASE } from '../enums/index';

export type SagaMessage<P = unknown> = {
  payload: P,
  saga: {
    index: number,
    phase: STEP_PHASE,
  }
}

export type Command<P = unknown, RES = void> = (payload?: P) => Promise<RES>;

export type SagaDefinition = {
  channelName: string,
  phases: { [key in STEP_PHASE]?: { command: Command, data?: any } }
}
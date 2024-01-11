import { AppConfig, Client } from '../../src/models';

export const cleanupDb = async (): Promise<void> => {
  try {
    await AppConfig.model.deleteMany();
    await Client.model.deleteMany();
  } catch (error) {
    console.log('Something went wrong while cleaning up db');
  }
};
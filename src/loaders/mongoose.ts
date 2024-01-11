import mongoose, { connect, ConnectOptions, mongo } from 'mongoose';
import { createBunyanLogger } from './logger';

const log = createBunyanLogger('MongooseLoader');

let clientConnection: mongo.Db;

export default async (): Promise<void> => {
  try {
    // Connect to MongoDB
    await connect(process.env.MONGO_URL, ({
      useNewUrlParser: true,
      useUnifiedTopology: true,
      dbName: process.env.MONGO_DB_NAME,
    } as ConnectOptions));
    
    const client: mongo.MongoClient = mongoose.connections[0].getClient();

    clientConnection = client.db(process.env.MONGO_DB_NAME);
    log.info('connection established');
  } catch (error) {
    log.error(error);
    process.exit(1);
  }
};

const getDbInstance = (): mongo.Db => clientConnection;
export { getDbInstance };
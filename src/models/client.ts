import { model as _model, Schema } from 'mongoose';

import { IClient } from '../interfaces';
import { addressSchema, auditSchema, exchangeDetailsSchema } from './common-schema';
import { COLLECTIONS } from '../utility';

const schema = new Schema<IClient>({
  exchangeDetails: [exchangeDetailsSchema],
  taxId: { type: String, },
  addresses: [addressSchema],
  auditInfo: auditSchema,
});

schema.pre('save', function (next) {
  this.auditInfo = {
    active: true,
    createdTime: new Date(),
    updatedTime: new Date(),
    archived: false,
  };
  next();
});

schema.pre('updateOne', function () {
  this.set({ 'auditInfo.updatedTime': new Date() });
});

const name = COLLECTIONS.CLIENT;
const model = _model(name, schema);

export {
  name,
  schema,
  model
}
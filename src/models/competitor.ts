import { model as _model, Schema } from 'mongoose';

import { ICompetitor } from '../interfaces/competitor';
import { COLLECTIONS } from '../utility/constants';
import { addressSchema, auditSchema, documentSchema, exchangeDetailsSchema } from './common-schema';

const schema = new Schema<ICompetitor>({
  exchangeDetails: [exchangeDetailsSchema],
  taxId: { type: String, },
  addresses: [addressSchema],
  documents: [documentSchema],
  score: { type: Number },
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

const name = COLLECTIONS.COMPETITOR;
const model = _model(name, schema);

export {
  name,
  schema,
  model
}
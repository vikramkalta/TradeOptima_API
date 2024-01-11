import { model as _model, Schema } from 'mongoose';

import { IInvestor } from '../interfaces';
import { addressSchema, auditSchema, documentSchema, exchangeDetailsSchema } from './common-schema';
import { COLLECTIONS } from '../utility/index';
import { InvestorTypes } from '../enums';

const schema = new Schema<IInvestor>({
  exchangeDetails: [exchangeDetailsSchema],
  taxId: { type: String, },
  addresses: [addressSchema],
  documents: [documentSchema],
  reputation: { type: Number, },
  clients: [{ type: Schema.Types.ObjectId, ref: COLLECTIONS.CLIENT, }],
  investorType: { type: Number, enum: InvestorTypes, },
  companyName: { type: String, },
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

const name = COLLECTIONS.INVESTOR;
const model = _model(name, schema);

export {
  name,
  schema,
  model
}
import { Schema } from 'mongoose';

import { IAuditInfo, IDocument, IExchangeDetails, } from '../interfaces';
import { IAddress } from '../interfaces';

const auditSchema = new Schema<IAuditInfo>({
  createdBy: { type: Number },
  createdTime: { type: Date, default: Date.now },
  updatedTime: { type: Date, default: Date.now },
  active: { type: Boolean, default: true },
  archived: { type: Boolean, default: false }
}, {
  _id: false
});

const exchangeDetailsSchema = new Schema<IExchangeDetails>({
  exchangeId: { type: String },
  apiKey: { type: String },
  secretKey: { type: String },
  active: { type: Boolean },
});

const addressSchema = new Schema<IAddress>({
  address1: { type: String },
  address2: { type: String },
  city: { type: String },
  postcode: { type: String },
  country: { type: String },
});

const documentSchema = new Schema<IDocument>({
  documentId: { type: String },
  name: { type: String },
});

export { auditSchema, exchangeDetailsSchema, addressSchema, documentSchema };
import { model as _model, Schema } from 'mongoose';

import { IAppConfig } from '../interfaces';
import { COLLECTIONS } from '../utility';
import { auditSchema } from './common-schema';

const schema = new Schema<IAppConfig>({
  attributeName: { type: String, required: true },
  attributeValue: { type: String, required: true },
  auditInfo: auditSchema,
});

const name = COLLECTIONS.APP_CONFIG;
const model = _model(name, schema);

export {
  name,
  schema,
  model,
};
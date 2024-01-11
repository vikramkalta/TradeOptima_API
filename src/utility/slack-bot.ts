import { createBunyanLogger } from '../loaders/logger';

import { https } from './request';

const log = createBunyanLogger('Slackbot');

async function slackBot(data): Promise<void> {
  try {
    const options = {
      headers: {
        'Content-Type': 'application/json',
        accept: 'application/json'
      },
      hostname: 'hooks.slack.com',
      path: `/services/${process.env.CONTACT_US_PATH}`, // The channel path should be dynamic.
      method: 'POST'
    };
    if (['staging', 'production'].includes(process.env.NODE_ENV)) {
      const response = await https(options, data, false);
      log.info('Slack bot post response', response);
    }
  } catch (error) {
    log.error('Something went wrong posting message on slack', error);
  }
}
export { slackBot };
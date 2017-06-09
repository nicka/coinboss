import AWS from 'aws-sdk-mock';
import Sms from './sms';

describe('Sms', () => {
  describe('sendMessage()', () => {
    beforeEach(() => AWS.mock('SNS', 'publish', { status: 'mocked' }));
    afterEach(() => AWS.restore('SNS'));

    test('sends sms message', () =>
      new Sms().sendMessage('Hello World!')
        .then(data => expect(data.status).toBe('mocked')),
    );
  });
});

import AWS from 'aws-sdk-mock';
import CloudWatch from './cloudWatch';

describe('CloudWatch', () => {
  describe('setupBuySellDimensions()', () => {
    test('returns an array of dimensions', () => {
      expect(CloudWatch.setupBuySellDimensions('ETH', 'EUR')).toMatchSnapshot();
    });
  });

  describe('putPriceMetric()', () => {
    beforeEach(() => AWS.mock('CloudWatch', 'putMetricData', { status: 'mocked' }));
    afterEach(() => AWS.restore('CloudWatch'));

    test('stores metrics within CloudWatch', () =>
      new CloudWatch().putPriceMetric({
        metricName: 'foo',
        currency: 'ETH',
        localCurrency: 'EUR',
        price: '0.19',
      })
        .then(data => expect(data.status).toBe('mocked')),
    );
  });
});

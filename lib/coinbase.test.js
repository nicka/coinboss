import nock from 'nock';
import Coinbase from './coinbase';

beforeAll(() => nock.disableNetConnect());
afterAll(() => nock.enableNetConnect());

describe('Coinbase', () => {
  describe('getExchangeRates()', () => {
    beforeEach(() => {
      nock('https://api.coinbase.com:443').get('/v2/prices/BTC-EUR/buy').reply(200, {
        data: { amount: '10000.00', currency: 'EUR' },
      });
      nock('https://api.coinbase.com:443').get('/v2/prices/LTC-EUR/buy').reply(200, {
        data: { amount: '10000.00', currency: 'EUR' },
      });
      nock('https://api.coinbase.com:443').get('/v2/prices/ETH-EUR/buy').reply(200, {
        data: { amount: '10000.00', currency: 'EUR' },
      });
    });

    test('stores exchange rates within CloudWatch', () => {
      const coinbase = new Coinbase();
      coinbase.cloudwatch = {
        putPriceMetric: jest.fn().mockReturnValue(Promise.resolve({ status: 'mocked' })),
      };

      return coinbase.getExchangeRates('Buy')
        .then(data => expect(data).toMatchSnapshot());
    });
  });

  describe('buy or sell cryptocurrency', () => {
    beforeEach(() => {
      nock('https://api.coinbase.com:443').get('/v2/accounts').reply(200, {
        pagination: {},
        data: [{
          id: 'f7f266de-c2b1-4588-847c-aef66f8f2b8c', name: 'EUR Wallet', resource: 'account',
        }, {
          id: '4d264c58-6e3a-470a-93f9-5e1b6f3fafb0', name: 'ETH Wallet', resource: 'account',
        }],
      });
      nock('https://api.coinbase.com:443').get('/v2/payment-methods').reply(200, {
        pagination: {},
        data: [{
          id: 'c231a748-e3e9-4aa5-8a8e-ac1d823ec93a', type: 'secure3d_card', resource: 'payment_method',
        }, {
          id: '256a4697-62de-4f85-abee-256b67b621b8', type: 'fiat_account', resource: 'payment_method',
        }],
      });
    });
    afterEach(() => nock.cleanAll());

    describe('buy()', () => {
      beforeEach(() => {
        nock('https://api.coinbase.com:443')
          .post('/v2/accounts/4d264c58-6e3a-470a-93f9-5e1b6f3fafb0/buys', {
            total: 1, currency: 'EUR', payment_method: '256a4697-62de-4f85-abee-256b67b621b8', commit: true,
          })
          .reply(200, {
            data: {
              id: null,
              status: 'commit',
              payment_method: { id: '256a4697-62de-4f85-abee-256b67b621b8', resource: 'payment_method' },
              transaction: null,
              resource: 'buy',
              amount: { amount: '1.00000000', currency: 'ETH' },
              total: { amount: '1.00', currency: 'EUR' },
              subtotal: { amount: '0.01', currency: 'EUR' },
            },
          });
      });

      test('buys cryptocurrency', () => {
        const coinbase = new Coinbase();
        return coinbase.buy()
          .then(data => expect(data.amount).toMatchSnapshot());
      });
    });

    describe('sell()', () => {
      beforeEach(() => {
        nock('https://api.coinbase.com:443')
          .post('/v2/accounts/4d264c58-6e3a-470a-93f9-5e1b6f3fafb0/sells', {
            total: 1, currency: 'EUR', payment_method: '256a4697-62de-4f85-abee-256b67b621b8', commit: true,
          })
          .reply(200, {
            data: {
              id: null,
              status: 'commit',
              payment_method: { id: '256a4697-62de-4f85-abee-256b67b621b8', resource: 'payment_method' },
              transaction: null,
              resource: 'buy',
              amount: { amount: '1.00000000', currency: 'ETH' },
              total: { amount: '1.00', currency: 'EUR' },
              subtotal: { amount: '0.01', currency: 'EUR' },
            },
          });
      });

      test('sells cryptocurrency', () => {
        const coinbase = new Coinbase();
        return coinbase.sell()
          .then(data => expect(data.amount).toMatchSnapshot());
      });
    });
  });
});

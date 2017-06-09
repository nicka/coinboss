import { Client } from 'coinbase';
import CloudWatch from './cloudWatch';

export default class Coinbase {
  constructor() {
    this.coinbase = new Client({
      apiKey: process.env.COINBASE_API_KEY || 'REPLACEME',
      apiSecret: process.env.COINBASE_API_SECRET || 'REPLACEME',
    });
    this.cloudwatch = new CloudWatch();
    this.currentAccount = null;
    this.currentPaymentMethod = null;
    this.cryptoCurrency = process.env.PREFERRED_CRYPTO_CURRENCY || 'ETH';
    this.cryptoCurrencies = ['BTC', 'ETH', 'LTC'];
    this.localCurrency = process.env.PREFERRED_LOCAL_CURRENCY || 'EUR';
    this.preferredWallet = process.env.PREFERRED_WALLET || 'fiat_account';
    this.buyAmount = process.env.BUY_AMOUNT || 1;
    this.sellAmount = process.env.SELL_AMOUNT || 1;
  }

  getExchangeRates(action) {
    return Promise.all(
      this.cryptoCurrencies.map(cryptoCurrency =>
        this.getPrice({ action, currencyPair: `${cryptoCurrency}-${this.localCurrency}` })
          .then((price) => {
            const body = {
              amount: 1,
              currency: cryptoCurrency,
              localCurrency: this.localCurrency,
              price,
              metricName: `${action}Price`,
            };

            return this.cloudwatch.putPriceMetric(body);
          }),
      ),
    );
  }

  getPrice(args) {
    const action = `get${args.action}Price`;
    const currencyPair = args.currencyPair;

    return new Promise((resolve, reject) =>
      this.coinbase[action]({ currencyPair }, (err, response) => {
        if (err) { reject(err); }

        return resolve(response.data.amount);
      }),
    );
  }

  getAccount() {
    return new Promise((resolve, reject) =>
      this.coinbase.getAccounts({}, (err, accounts) => {
        if (err) { return reject(err); }

        const account = accounts.find(a => a.name === `${this.cryptoCurrency} Wallet`);
        if (account) {
          this.currentAccount = account;
          return resolve(account);
        }

        return reject(new Error(`No ${this.cryptoCurrency} Wallet found`));
      }),
    );
  }

  getPaymentMethod() {
    return new Promise((resolve, reject) =>
      this.coinbase.getPaymentMethods({}, (err, methods) => {
        if (err) { return reject(err); }

        const method = methods.find(m => m.type === this.preferredWallet);
        if (method) {
          this.currentPaymentMethod = method;
          return resolve(method);
        }

        return resolve(methods);
      }),
    );
  }

  buy() {
    return this.getAccount()
      .then(() => this.getPaymentMethod())
      .then(() =>
        new Promise((resolve, reject) =>
          this.currentAccount.buy({
            // amount: this.buyAmount, // Without fees
            total: this.buyAmount, // Including fees
            currency: this.localCurrency,
            payment_method: this.currentPaymentMethod.id,
            commit: true, // Performs an actual buy
            // quote: true, // Returns a quote for the transaction
          }, (err, transaction) => {
            if (err) { return reject(err); }

            return resolve(transaction);
          }),
        ),
      );
  }

  sell() {
    return this.getAccount()
      .then(() => this.getPaymentMethod())
      .then(() =>
        new Promise((resolve, reject) =>
          this.currentAccount.sell({
            // amount: this.sellAmount, // Without fees
            total: this.sellAmount, // Including fees
            currency: this.localCurrency,
            payment_method: this.currentPaymentMethod.id,
            commit: true, // Performs the actual buy
            // quote: true, // Returns a quote for the transaction
          }, (err, transaction) => {
            if (err) { return reject(err); }

            return resolve(transaction);
          }),
        ),
      );
  }
}

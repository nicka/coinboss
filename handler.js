import { Coinbase, Sms } from './lib';

const coinbase = new Coinbase();
const sms = new Sms();

export const getExchangeRates = (event, context, callback) =>
  Promise.all([
    coinbase.getExchangeRates('Buy'),
    coinbase.getExchangeRates('Sell'),
  ])
    .then(() =>
      callback(null, { statusCode: 200, body: { message: 'Collected exchange rates.' } }),
    )
    .catch((err) => {
      console.error(err);
      callback({ statusCode: 500, body: { message: 'Something went wrong' } });
    });

export const exchangeRateAlarm = (event, context, callback) => {
  const alarm = JSON.parse(event.Records[0].Sns.Message);
  console.log(alarm);

  const message = `${alarm.AlarmDescription} - ${alarm.NewStateReason}.`;
  console.log(message);

  return sms.sendMessage(message)
    .then(() => callback(null, { statusCode: 200, body: alarm }));
};

export const buy = (event, context, callback) =>
  coinbase.buy()
    .then((tx) => {
      const message = `Bought ${tx.amount.amount} ${tx.amount.currency} for a total of ${tx.total.amount} ${tx.total.currency}.`;
      console.log(message);

      return sms.sendMessage(message)
        .then(() => callback(null, { statusCode: 200, body: { message } }));
    })
    .catch((err) => {
      console.error(err);
      callback({ statusCode: 500, body: { message: 'Something went wrong' } });
    });

export const sell = (event, context, callback) =>
  coinbase.sell()
    .then((tx) => {
      const message = `Sold ${tx.amount.amount} ${tx.amount.currency} for a total of ${tx.total.amount} ${tx.total.currency}.`;
      console.log(message);

      return sms.sendMessage(message)
        .then(() => callback(null, { statusCode: 200, body: { message } }));
    })
    .catch((err) => {
      console.error(err);
      callback({ statusCode: 500, body: { message: 'Something went wrong' } });
    });

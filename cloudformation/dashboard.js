/* eslint-disable no-template-curly-in-string */

'use strict';

const label = (title, props) => ['.', title, '.', '.', '.', '.', '.', '.', props];
const alarmArn = cfAlarmResource => [
  'arn:aws:cloudwatch:${self:provider.region}',
  '-SPLIT-Ref:AWS::AccountId-SPLIT-',
  'alarm',
  `-SPLIT-Ref:${cfAlarmResource}-SPLIT-`,
].join(':');

module.exports.dashboard = () => {
  const json = JSON.stringify({
    widgets: [
      {
        type: 'metric',
        x: 0,
        y: 1,
        width: 6,
        height: 3,
        properties: {
          view: 'singleValue',
          metrics: [
            [
              '${self:custom.cloudWatchNamespace}',
              'BuyPrice',
              'CryptoCurrency',
              '${self:provider.environment.PREFERRED_CRYPTO_CURRENCY}',
              'Stage',
              '${self:custom.stage}',
              'LocalCurrency',
              '${self:provider.environment.PREFERRED_LOCAL_CURRENCY}',
              {
                label: 'Buy',
              },
            ],
            label('SellPrice', {
              label: 'Sell',
            }),
          ],
          region: '${self:provider.region}',
          title: 'Current price in ${self:provider.environment.PREFERRED_LOCAL_CURRENCY}',
        },
      },
      {
        type: 'metric',
        x: 0,
        y: 4,
        width: 24,
        height: 9,
        properties: {
          view: 'timeSeries',
          stacked: false,
          metrics: [
            [
              '${self:custom.cloudWatchNamespace}',
              'BuyPrice',
              'CryptoCurrency',
              '${self:provider.environment.PREFERRED_CRYPTO_CURRENCY}',
              'Stage',
              '${self:custom.stage}',
              'LocalCurrency',
              '${self:provider.environment.PREFERRED_LOCAL_CURRENCY}',
              {
                color: '#aec7e8',
                label: 'Buy actual',
              },
            ],
            label('SellPrice', {
              color: '#ffbb78',
              label: 'Sell actual',
            }),
            label('BuyPrice', {
              period: 3600,
              color: '#1f77b4',
              label: 'Buy hourly average',
            }),
            label('SellPrice', {
              period: 3600,
              color: '#ff7f0e',
              label: 'Sell hourly average',
            }),
            label('BuyPrice', {
              period: 86400,
              label: 'Buy daily average',
              color: '#ff9896',
            }),
            label('SellPrice', {
              period: 86400,
              label: 'Sell daily average',
              color: '#98df8a',
            }),
          ],
          region: '${self:provider.region}',
          title: 'Buy / Sell ${self:provider.environment.PREFERRED_CRYPTO_CURRENCY}-${self:provider.environment.PREFERRED_LOCAL_CURRENCY}',
        },
      },
      {
        type: 'metric',
        x: 0,
        y: 13,
        width: 6,
        height: 6,
        properties: {
          title: 'Low Buy Price',
          annotations: {
            alarms: [alarmArn('LowBuyPriceAlarm')],
          },
          view: 'timeSeries',
          stacked: false,
        },
      },
      {
        type: 'metric',
        x: 6,
        y: 13,
        width: 6,
        height: 6,
        properties: {
          title: 'Low Sell Price',
          annotations: {
            alarms: [alarmArn('LowSellPriceAlarm')],
          },
          view: 'timeSeries',
          stacked: false,
        },
      },
      {
        type: 'metric',
        x: 12,
        y: 13,
        width: 6,
        height: 6,
        properties: {
          title: 'High Buy Price',
          annotations: {
            alarms: [alarmArn('HighBuyPriceAlarm')],
          },
          view: 'timeSeries',
          stacked: false,
        },
      },
      {
        type: 'metric',
        x: 18,
        y: 13,
        width: 6,
        height: 6,
        properties: {
          title: 'High Sell Price',
          annotations: {
            alarms: [alarmArn('HighSellPriceAlarm')],
          },
          view: 'timeSeries',
          stacked: false,
        },
      },
    ],
  });

  return {
    'Fn::Join': [
      '',
      /*
        Because of variable collisions with serverless, we can't use Fn::Sub so we need to split the
        template to use Fn::Join to Ref the alarms.
      */
      json.split('-SPLIT-').map((line) => {
        if (line.includes('Ref:')) {
          return { Ref: line.replace('Ref:', '') };
        }
        return line;
      }) // eslint-disable-line
    ],
  };
};

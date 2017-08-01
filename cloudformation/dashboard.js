'use strict';

module.exports.dashboard = () => {
  var dashboard_template = JSON.stringify({
    widgets: [
      {
        type: 'text',
        x: 0,
        y: 0,
        width: 24,
        height: 1,
        properties: {
          markdown: '## ${self:service}',
        }
      },
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
              '${self:service}',
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
            [
              '.',
              'SellPrice',
              '.',
              '.',
              '.',
              '.',
              '.',
              '.',
              {
                label: 'Sell',
              },
            ],
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
              '${self:service}',
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
            [
              '.',
              'SellPrice',
              '.',
              '.',
              '.',
              '.',
              '.',
              '.',
              {
                color: '#ffbb78',
                label: 'Sell actual',
              },
            ],
            [
              '.',
              'BuyPrice',
              '.',
              '.',
              '.',
              '.',
              '.',
              '.',
              {
                period: 3600,
                color: '#1f77b4',
                label: 'Buy hourly average',
              },
            ],
            [
              '.',
              'SellPrice',
              '.',
              '.',
              '.',
              '.',
              '.',
              '.',
              {
                period: 3600,
                color: '#ff7f0e',
                label: 'Sell hourly average',
              },
            ],
            [
              '.',
              'BuyPrice',
              '.',
              '.',
              '.',
              '.',
              '.',
              '.',
              {
                period: 86400,
                label: 'Buy daily average',
                color: '#ff9896',
              },
            ],
            [
              '.',
              'SellPrice',
              '.',
              '.',
              '.',
              '.',
              '.',
              '.',
              {
                period: 86400,
                label: 'Sell daily average',
                color: '#98df8a',
              },
            ],
          ],
          region: '${self:provider.region}',
          title: 'Buy / Sell ${self:provider.environment.PREFERRED_CRYPTO_CURRENCY}-${self:provider.environment.PREFERRED_LOCAL_CURRENCY}',
        }
      },
      {
        type: "metric",
        x: 0,
        y: 13,
        width: 6,
        height: 6,
        properties: {
          title: "Low Buy Price",
          annotations: {
              alarms: [
                "arn:aws:cloudwatch:${self:provider.region}:JOINREF:AWS::AccountIdJOIN:alarm:JOINREF:LowBuyPriceAlarmJOIN"
              ]
          },
          view: "timeSeries",
          stacked: false
        }
      },
      {
        type: "metric",
        x: 6,
        y: 13,
        width: 6,
        height: 6,
        properties: {
          title: "Low Sell Price",
          annotations: {
              alarms: [
                "arn:aws:cloudwatch:${self:provider.region}:JOINREF:AWS::AccountIdJOIN:alarm:JOINREF:LowSellPriceAlarmJOIN"
              ]
          },
          view: "timeSeries",
          stacked: false
        }
      },
      {
        type: "metric",
        x: 12,
        y: 13,
        width: 6,
        height: 6,
        properties: {
          title: "High Buy Price",
          annotations: {
              alarms: [
                "arn:aws:cloudwatch:${self:provider.region}:JOINREF:AWS::AccountIdJOIN:alarm:JOINREF:HighBuyPriceAlarmJOIN"
              ]
          },
          view: "timeSeries",
          stacked: false
        }
      },
      {
        type: "metric",
        x: 18,
        y: 13,
        width: 6,
        height: 6,
        properties: {
          title: "High Sell Price",
          annotations: {
              alarms: [
                "arn:aws:cloudwatch:${self:provider.region}:JOINREF:AWS::AccountIdJOIN:alarm:JOINREF:HighSellPriceAlarmJOIN"
              ]
          },
          view: "timeSeries",
          stacked: false
        }
      }
    ]
  });

  // because of variable collisions with serverless, we can't use fn:sub
  // so we need to split the template to use fn:join to ref the alarms
  dashboard_template = dashboard_template.split('JOIN');
  var lines = dashboard_template.map(function(line) {
    if(line.indexOf('REF:') > -1) {
      return { Ref: line.replace('REF:', '') }
    }
    return line;
  });
  return {
    "Fn::Join":
    [
      "",
      lines
    ]
  }
}

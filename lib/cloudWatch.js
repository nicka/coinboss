import AWS from 'aws-sdk';

export default class CloudWatch {
  static setupBuySellDimensions(currency, localCurrency) {
    return [
      {
        Name: 'CryptoCurrency',
        Value: currency,
      },
      {
        Name: 'LocalCurrency',
        Value: localCurrency,
      },
      {
        Name: 'Stage',
        Value: process.env.STAGE || 'dev',
      },
    ];
  }

  constructor() {
    this.cloudwatch = new AWS.CloudWatch({ region: process.env.REGION || 'eu-central-1' });
    this.namespace = process.env.SERVICE_NAME;
  }

  putPriceMetric(args) {
    return this.cloudwatch.putMetricData({
      MetricData: [
        {
          MetricName: args.metricName,
          Dimensions: CloudWatch.setupBuySellDimensions(args.currency, args.localCurrency),
          Timestamp: new Date(),
          Unit: 'Count',
          Value: Number(args.price),
        },
      ],
      Namespace: this.namespace,
    }).promise();
  }
}

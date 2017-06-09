import AWS from 'aws-sdk';

export default class Sms {
  constructor() {
    this.sns = new AWS.SNS({ region: process.env.AWS_SMS_REGION });
    this.to = process.env.AWS_SMS_TO;
  }

  sendMessage(message) {
    return this.sns.publish({
      Message: message,
      MessageStructure: 'string',
      PhoneNumber: this.to,
    }).promise();
  }
}

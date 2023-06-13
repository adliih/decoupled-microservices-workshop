const { SQS } = require("aws-sdk");
import "./typedef";

const sqs = new SQS();

/** @param {{ Records: SnsEvent[] }} records */
exports.handler = async (records) => {
  console.log(records);

  for (const event of records) {
    await handleSnsRecord(event);
  }
};

/** @param {SnsEvent} event */
async function handleSnsRecord(event) {
  console.log(event);

  const {
    FARE_MULTIPLIER,
    QUEUE_URL: QueueUrl,
    PROVIDER_ID: providerId,
  } = process.env;

  /** @type {RfqSnsMessage} */
  const message = JSON.parse(event.Sns.Message);

  /** @type { RfqResponseQueueMessage } */
  const messageBody = {
    id: message.id,
    providerId,
    fare: 100 * FARE_MULTIPLIER,
  };

  await sqs
    .sendMessage({
      QueueUrl,
      MessageBody: JSON.stringify(messageBody),
    })
    .promise();
}

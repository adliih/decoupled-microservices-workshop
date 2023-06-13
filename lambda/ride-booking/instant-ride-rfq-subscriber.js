const { SQS } = require("aws-sdk");

const sqs = new SQS();

/** @param {{ Records: import("./typedef").SnsRecord[] }} records */
exports.handler = async (records) => {
  console.log(records);

  for (const event of records.Records) {
    await handleSnsRecord(event);
  }
};

/** @param {import("./typedef").SnsRecord} event */
async function handleSnsRecord(event) {
  console.log(event);

  const {
    FARE_MULTIPLIER,
    QUEUE_URL: QueueUrl,
    PROVIDER_ID: providerId,
  } = process.env;

  /** @type {import("./typedef").RfqSnsMessage} */
  const message = JSON.parse(event.Sns.Message);

  /** @type { import("./typedef").RfqResponseQueueMessage } */
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

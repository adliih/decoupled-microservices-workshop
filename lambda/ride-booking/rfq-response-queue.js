const { DynamoDB } = require("aws-sdk");

const dynamodb = new DynamoDB();

/** @param { import("./typedef").SqsEvent } event */
exports.handler = async (event) => {
  console.log(event);

  for (const record of event.Records) {
    await handleRecord(record);
  }
};

/** @param { import("./typedef").SqsRecord } record */
const handleRecord = async (record) => {
  /** @type {import("./typedef").RfqResponseQueueMessage} */
  const message = JSON.parse(record.body);

  const { TABLE_NAME: TableName } = process.env;

  // submit to dynamodb
  await dynamodb
    .updateItem({
      TableName,
      Key: {
        id: { S: message.id },
      },
      // append the new quote into quotes field
      UpdateExpression: `SET quotes = list_append(quotes, :quote)`,
      // constructing quote data
      ExpressionAttributeValues: {
        ":quote": {
          M: {
            providerId: {
              S: message.providerId,
            },
            fare: {
              N: String(message.fare),
            },
          },
        },
      },
    })
    .promise();
};

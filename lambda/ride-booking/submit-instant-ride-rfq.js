const { SNS, DynamoDB } = require("aws-sdk");
const { randomUUID } = require("crypto");

const sns = new SNS();
const dynamodb = new DynamoDB();

/**
 * @typedef {object} RequestBody
 * @property {string} from
 * @property {string} to
 * @property {string} customer
 */

exports.handler = async (event) => {
  console.log(event);

  const { TABLE_NAME: TableName, TOPIC_ARN: TopicArn } = process.env;

  /** @type RequestBody */
  const body = JSON.parse(event.body);

  const id = randomUUID();

  // submit to dynamodb
  await dynamodb
    .putItem({
      TableName,
      Item: {
        id: { S: id },
        from: { S: body.from },
        to: { S: body.to },
        customer: { S: body.customer },
        // array for quotes
        qoutes: { L: [] },
      },
    })
    .promise();

  // let the provider knows
  await sns
    .publish({
      TopicArn,
      Message: JSON.stringify({
        ...body,
        id,
      }),
    })
    .promise();

  const response = { id };

  return {
    statusCode: 201,
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(response),
  };
};

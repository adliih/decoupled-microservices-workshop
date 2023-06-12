const { SNS, DynamoDB } = require("aws-sdk");
const { randomUUID } = require("crypto");

const sns = new SNS();
const dynamodb = new DynamoDB();

exports.handler = async (event) => {
  console.log(event);

  const { TABLE_NAME, TOPIC_ARN } = process.env;

  const body = JSON.parse(event.body);

  const id = randomUUID();

  await dynamodb
    .putItem({
      TableName: TABLE_NAME,
      Item: {
        id: { S: id },
        from: { S: String(body["from"]) },
        to: { S: String(body["to"]) },
        duration: { N: String(body["duration"]) },
        distance: { N: String(body["distance"]) },
        customer: { S: String(body["customer"]) },
        fare: { N: String(body["fare"]) },
      },
    })
    .promise();

  // attaching id before publishing so topic
  body.id = id;

  await sns
    .publish({
      TopicArn: TOPIC_ARN,
      Message: JSON.stringify(body),
    })
    .promise();

  return {
    statusCode: 201,
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ id }),
  };
};

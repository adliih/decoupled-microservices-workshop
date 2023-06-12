const { SNS, DynamoDB } = require("aws-sdk");
const { randomUUID } = require("crypto");

const sns = new SNS();
const dynamodb = new DynamoDB();

exports.handler = async (event) => {
  const { TABLE_NAME, TOPIC_ARN } = process.env;

  const body = JSON.parse(event.body);

  const id = randomUUID();

  const response = await dynamodb
    .putItem({
      TableName: TABLE_NAME,
      Item: {
        id: { S: id },
        from: { S: body["from"] },
        to: { S: body["to"] },
        duration: { N: body["duration"] },
        distance: { N: body["distance"] },
        customer: { S: body["customer"] },
        fare: { N: body["fare"] },
      },
    })
    .promise();

  // attaching id before publishing so topic
  body.id = id;

  await sns
    .publish({
      TopicArn: TOPIC_ARN,
      Message: body,
    })
    .promise();

  return JSON.stringify(response.$response.data);
};

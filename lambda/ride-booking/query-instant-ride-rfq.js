const { DynamoDB } = require("aws-sdk");
const { randomUUID } = require("crypto");

const dynamodb = new DynamoDB();

/**
 * @typedef {Object} PathParam
 * @property {string} id
 */

/**
 * @param {Object} event
 * @param {PathParam} event.pathParameters
 */
exports.handler = async (event) => {
  const { TABLE_NAME: TableName } = process.env;

  const { id } = event.pathParameters;

  const data = await dynamodb
    .getItem({
      TableName,
      Key: { id: { S: id } },
    })
    .promise();

  console.log(data);

  const response = { ...data.Item };

  return {
    statusCode: 200,
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(response),
  };
};

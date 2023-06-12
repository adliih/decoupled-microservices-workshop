const { SNS } = require("aws-sdk");

exports.handler = async (event) => {
  const sns = new SNS();

  sns.publish({
    TopicArn: process.env.TOPIC_ARN,
    Message: event,
  });

  return {
    statusCode: 200,
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      message: "Done",
      event,
    }),
  };
};

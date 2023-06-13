/** @typedef {{ Sns: { Message: string; } }} SnsEvent */
/** @typedef {{ id: string; }} RfqSnsMessage */
/** @typedef {{ id: string; providerId: string; fare: number; }} RfqResponseQueueMessage */

/** @typedef {{ Records: SqsRecord[] }} SqsEvent */
/** @typedef {{ messageId: string; body: string; }} SqsRecord */

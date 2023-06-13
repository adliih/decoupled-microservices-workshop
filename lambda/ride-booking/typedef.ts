export type SnsEvent = { Records: SnsRecord[] };
export type SnsRecord = { Sns: { Message: string } };

export type RfqSnsMessage = { id: string };
export type RfqResponseQueueMessage = {
  id: string;
  providerId: string;
  fare: number;
};

export type SqsEvent = { Records: SqsRecord[] };
export type SqsRecord = { messageId: string; body: string };

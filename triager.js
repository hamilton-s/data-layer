import { getObjectFromS3, invokeLambda } from "./utils/utils.js";

const CONSUMER_TYPES = ["ENERGY", "TECHNOLOGY", "HEALTHCARE"];

const handler = async (e) => {
  const [event] = e.Records;

  const s3Key = event.s3.object.key;
  const s3Bucket = event.s3.bucket.name;

  const events = await getObjectFromS3({ Bucket: s3Bucket, Key: s3Key });

  let objectData = events.Body.toString("utf-8");
  try {
    objectData = JSON.parse(objectData);
  } catch (e) {
    // Format data to parse
    objectData = `[${objectData}]`;
    objectData = objectData.replace(/}{/g, "},{");

    try {
      objectData = JSON.parse(objectData);
    } catch (err) {
      console.log(`S3 object is not an array of events! ${err.message}`);
    }
  }

  const consumers = {};
  for (const consumerType of CONSUMER_TYPES) {
    consumers[consumerType] = [];
  }
  for (const event of objectData) {
    if (CONSUMER_TYPES.includes(event.SECTOR)) {
      consumers[event.SECTOR].push(event);
    }
  }

  await Promise.all(
    Object.keys(consumers).map((consumer) =>
      invokeLambda({
        FunctionName: `data-layer-dev-${consumer.toLowerCase()}`,
        Payload: JSON.stringify(consumers[consumer]),
        InvocationType: "RequestResponse",
      })
    )
  );
};

export default handler;

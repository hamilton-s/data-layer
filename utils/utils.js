import AWS from "aws-sdk";

const lambda = new AWS.Lambda({ region: "eu-west-2" });
const s3 = new AWS.S3({ region: "eu-west-2" });

export const getObjectFromS3 = ({ Bucket, Key }) =>
  new Promise((resolve) => {
    s3.getObject(
      {
        Bucket,
        Key,
      },
      (err, data) => {
        if (err) {
          console.log("Error fetching from bucket", err);
        }

        return resolve(data);
      }
    );
  });

export const invokeLambda = (params) => lambda.invoke(params).promise();

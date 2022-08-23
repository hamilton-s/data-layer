# Data Layer

This is an example service to show how we can stream data through Kinesis Firehose into S3. The S3 file creation triggers the triager Lambda function.
The triager Lambda function sorts through the events and sends them onto the relevant services.

## Deploy

- Run `yarn` in the root
- Run `serverless deploy --aws-profile <profile>` in the root

## Testing

- Go to AWS Console
- Go to the `data-layer-dev-KinesisFirehose`
- Click 'Test with demo data'
- After 60s a file will have arrived in S3 `my-s3-bucket-data-layer`
- This will trigger the Triager Lambda Function
- See logs in cloudwatch for healthcare, technology and energy events

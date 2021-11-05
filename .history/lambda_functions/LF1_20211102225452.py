import json
import boto3


def lambda_handler(event, context):
    print(event)
    # TODO implement
    return {
        'statusCode': 200,
        'body': json.dumps('Hello from Lambda!')
    }



event = {'Records': [{'eventVersion': '2.1', 'eventSource': 'aws:s3', 'awsRegion': 'us-east-1', 'eventTime': '2021-11-03T02:42:09.434Z', 'eventName': 'ObjectCreated:Put', 'userIdentity': {'principalId': 'A3V0GIJMHU5OV7'}, 'requestParameters': {'sourceIPAddress': '74.101.203.2'}, 'responseElements': {'x-amz-request-id': 'YN143VAR4F29CNC4', 'x-amz-id-2': 'lQr+v5B3UfMiYPTT+oAMkWhTW4/XT5gNnalHl7/uLBeblse3hzk0aePl0xqzZPTSiFxaa++pxsyqIz6W2dl2bku9hTS1zEYY'}, 's3': {'s3SchemaVersion': '1.0', 'configurationId': 'dd48b1cb-89c5-48bb-9a9f-993ff876a514', 'bucket': {'name': 'ccbd-photo-album', 'ownerIdentity': {'principalId': 'A3V0GIJMHU5OV7'}, 'arn': 'arn:aws:s3:::ccbd-photo-album'}, 'object': {'key': 'images/', 'size': 0, 'eTag': 'd41d8cd98f00b204e9800998ecf8427e', 'sequencer': '006181F70167A896A4'}}}]}

lambda_handler(event, None)
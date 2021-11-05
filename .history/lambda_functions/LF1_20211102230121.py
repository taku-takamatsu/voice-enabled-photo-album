import json
import boto3


def lambda_handler(event, context):
    print(event)
    # TODO implement
    return {
        'statusCode': 200,
        'body': json.dumps('Hello from Lambda!')
    }



event = {'Records': [{'eventVersion': '2.1', 'eventSource': 'aws:s3', 'awsRegion': 'us-east-1', 'eventTime': '2021-11-03T02:42:56.782Z', 'eventName': 'ObjectCreated:Put', 'userIdentity': {'principalId': 'A3V0GIJMHU5OV7'}, 'requestParameters': {'sourceIPAddress': '74.101.203.2'}, 'responseElements': {'x-amz-request-id': 'XCXYP02NQNNXZ4Q9', 'x-amz-id-2': 'XqDbDJ2ApxCDBeZtia0gxDrk7MhvdjCpS86/o/5jQFAZi98xkOM8PBGU6ffgH65pGcR5H2RmuAtGdyt22HQmw200/0WX/88T'}, 's3': {'s3SchemaVersion': '1.0', 'configurationId': 'dd48b1cb-89c5-48bb-9a9f-993ff876a514', 'bucket': {'name': 'ccbd-photo-album', 'ownerIdentity': {'principalId': 'A3V0GIJMHU5OV7'}, 'arn': 'arn:aws:s3:::ccbd-photo-album'}, 'object': {'key': 'images/Screen+Shot+2021-11-01+at+12.57.26+PM.png', 'size': 160667, 'eTag': '1d48941df3b8091bf53298990fc26e80', 'sequencer': '006181F730AE0A3B95'}}}]}


lambda_handler(event, None)
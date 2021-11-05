import json
import boto3

session = boto3.Session()

def detect_labels(photo, bucket):
    # https://docs.aws.amazon.com/rekognition/latest/dg/images-s3.html
    client=session.client('rekognition')

    response = client.detect_labels(Image={'S3Object':{'Bucket':bucket,'Name':photo}},
        MaxLabels=10)

    print('Detected labels for ' + photo) 
    print()   
    for label in response['Labels']:
        print ("Label: " + label['Name'])
        print ("Confidence: " + str(label['Confidence']))
        print ("Instances:")
        for instance in label['Instances']:
            print ("  Bounding box")
            print ("    Top: " + str(instance['BoundingBox']['Top']))
            print ("    Left: " + str(instance['BoundingBox']['Left']))
            print ("    Width: " +  str(instance['BoundingBox']['Width']))
            print ("    Height: " +  str(instance['BoundingBox']['Height']))
            print ("  Confidence: " + str(instance['Confidence']))
            print()

        print ("Parents:")
        for parent in label['Parents']:
            print ("   " + parent['Name'])
        print ("----------")
        print ()
    return len(response['Labels'])


def get_head_object(bucket, key, etag):
    client = session.client('s3')
    response = client.head_object(
        Bucket=bucket,
        IfMatch=etag,
        Key=key.replace('+', ' ')
    )
    print(response)


def lambda_handler(event, context):
    #get key
    
    bucket = event['Records'][0]['s3']['bucket']['name']
    key = event['Records'][0]['s3']['object']['key']
    etag = event['Records'][0]['s3']['object']['eTag']
    #print(bucket, key, etag)
    #get_head_object(bucket, key, etag)
    detect_labels(bucket=bucket, photo=key)
    return {
        'statusCode': 200,
        'body': json.dumps('Hello from Lambda!')
    }


event = {'Records': [{'eventVersion': '2.1', 'eventSource': 'aws:s3', 'awsRegion': 'us-east-1', 'eventTime': '2021-11-03T02:42:56.782Z', 'eventName': 'ObjectCreated:Put', 'userIdentity': {'principalId': 'A3V0GIJMHU5OV7'}, 'requestParameters': {'sourceIPAddress': '74.101.203.2'}, 'responseElements': {'x-amz-request-id': 'XCXYP02NQNNXZ4Q9', 'x-amz-id-2': 'XqDbDJ2ApxCDBeZtia0gxDrk7MhvdjCpS86/o/5jQFAZi98xkOM8PBGU6ffgH65pGcR5H2RmuAtGdyt22HQmw200/0WX/88T'}, 's3': {'s3SchemaVersion': '1.0', 'configurationId': 'dd48b1cb-89c5-48bb-9a9f-993ff876a514', 'bucket': {'name': 'ccbd-photo-album', 'ownerIdentity': {'principalId': 'A3V0GIJMHU5OV7'}, 'arn': 'arn:aws:s3:::ccbd-photo-album'}, 'object': {'key': 'images/Screen+Shot+2021-11-01+at+12.57.26+PM.png', 'size': 160667, 'eTag': '1d48941df3b8091bf53298990fc26e80', 'sequencer': '006181F730AE0A3B95'}}}]}


lambda_handler(event, None)
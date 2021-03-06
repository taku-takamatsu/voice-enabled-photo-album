import json
import boto3
from time import time
from datetime import datetime
from opensearchpy import OpenSearch, RequestsHttpConnection
from requests_aws4auth import AWS4Auth
#from dotenv import load_dotenv #not needed for deployment
import os
import uuid

session = boto3.Session()

def detect_labels(photo, bucket):
    # https://docs.aws.amazon.com/rekognition/latest/dg/images-s3.html
    client=session.client('rekognition', region_name='us-east-1')
    response = client.detect_labels(Image={'S3Object':{'Bucket':bucket,'Name':photo}},
        MaxLabels=10)
    result = []
    for label in response['Labels']:
        result.append({
            'label': label['Name'],
            'confidence': label['Confidence'],
            'parents': [x['Name'] for x in label['Parents']]
        })
    return result


def get_custom_labels(bucket, key, etag):
    client = session.client('s3')
    try:
        response = client.head_object(
            Bucket=bucket,
            IfMatch=etag,
            Key=key
        )
        return response['Metadata']['customlabels']
    except Exception as e:
        print(e)
        return None


def os_insert_object(document, id, index_name):
    host = os.environ['OS_URL'] # For example, my-test-domain.us-east-1.es.amazonaws.com
    region = 'us-east-1' # e.g. us-west-1
    service = 'es'
    credentials = session.get_credentials()
    awsauth = AWS4Auth(credentials.access_key, credentials.secret_key, region, service, session_token=credentials.token)

    search = OpenSearch(
        hosts = [{'host': host, 'port': 443}],
        http_auth = awsauth,
        use_ssl = True,
        verify_certs = True,
        connection_class = RequestsHttpConnection
    )

    search.index(index=index_name, doc_type="_doc", id=id, body=document)
    print("Successfully inserted to Opensearch!")

def lambda_handler(event, context):
    #get key
    print('test')
    bucket = event['Records'][0]['s3']['bucket']['name']
    key = event['Records'][0]['s3']['object']['key'].replace('+', ' ')
    etag = event['Records'][0]['s3']['object']['eTag']
    print(bucket, key, etag)
    detected_labels = detect_labels(bucket=bucket, photo=key)
    os_object = {
        'objectKey' : key,
        'bucket': bucket,
        'createdTimestamp': str(datetime.utcfromtimestamp(time()).strftime('%Y-%m-%d %H:%M:%S')),
        'etag': etag,
        'x-amz-meta-customLabels' : get_custom_labels(bucket, key, etag),
        'labels': [x['label'] for x in detected_labels]
    }
    os_insert_object(document=os_object, id=uuid.uuid4(), index_name='ccbd_a2')
    return {
        'statusCode': 200,
        'body': json.dumps('Successfully uploaded image to Opensearch')
    }


import json
import boto3
import requests
from requests_aws4auth import AWS4Auth
import logging

logger = logging.getLogger()
logger.setLevel(logging.DEBUG)

region = 'us-east-1'
service='es'
os_host = 'https://search-coms6998-photos-z62jro5murwxnbveb5wiaksa4a.us-east-1.es.amazonaws.com'
session = boto3.Session()

def search_es(label):
    '''
    Source: https://docs.aws.amazon.com/opensearch-service/latest/developerguide/search-example.html
    '''
    
    credentials = session.get_credentials()
    
    awsauth = AWS4Auth(credentials.access_key, credentials.secret_key, region, service, session_token=credentials.token)
   
    # Put the user query into the query DSL for more accurate search results.
    query = {
        "query": {
            "multi_match": {
              "query": label,
              "fields" : ["labels", "x-amz-meta-customLabels"] 
            }
        }
    }

    # Elasticsearch 6.x requires an explicit Content-Type header
    headers = { "Content-Type": "application/json" }
    
    index = 'ccbd_a2'
    # Make the signed HTTP request
    try:
        r = requests.get(os_host + '/' + index + '/_search', auth=awsauth, headers=headers, data=json.dumps(query))
        # Create the response and add some extra content to support CORS
        response = {
            "statusCode": 200,
            "headers": {
                "Access-Control-Allow-Origin": '*'
            },
            "isBase64Encoded": False
        }
        logger.debug(r)
        #print("response", r.text)
        
        # Add the search results to the response
        response['body'] = r.text
        hits = json.loads(response['body'])['hits'].get('hits', [])

        #format response body
        results = []
        for each in hits:
            results.append(each['_source'])
        return results
    except Exception as e:
        print(e)
        return {
            "statusCode": 403,
            "headers": {
                "Access-Control-Allow-Origin": '*'
            },
            "isBase64Encoded": False,
            "body": []
        }
    
    
    
def lambda_handler(event, context):
    # logger.debug('event={}'.format(event))
    #print(event)
    try:
        client = boto3.client('lex-runtime', region_name='us-east-1')
        q = event['queryStringParameters']['q']
        lex_response = client.post_text(
            botName='SearchPhotosBot',
            botAlias='Test',
            userId='abc',
            inputText= q
        )
        # contains the two labels labelOne, labelTwo
        labels = lex_response['slots']
        l1, l2 = labels['labelOne'], labels['labelTwo']
        response = []
        new_resp = []
        # perform search
        if l1 or l2:
            if l1:
                print(l1)
                search_response1 = search_es(l1)
                logger.debug(search_response1)
                if search_response1:
                    response.extend(search_response1)
            if l2:
                search_response2 = search_es(l2)
                if search_response2:
                    response.extend(search_response2)
    
            for x in response:
                if x['objectKey'] not in [j['objectKey'] for j in new_resp]:
                    new_resp.append(x)
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Headers': 'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token,Accept',
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'OPTIONS,PUT,GET'
            },
            'body': json.dumps(new_resp)
        }
    except Exception as e:
        return {
            'statusCode': 500,
            'headers': {
                'Access-Control-Allow-Headers': 'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token,Accept',
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'OPTIONS,PUT,GET'
            },
            'body': json.dumps(str(e))
        }


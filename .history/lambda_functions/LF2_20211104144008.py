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
              "fields" : ["labels"] 
            }
        }
    }

    # Elasticsearch 6.x requires an explicit Content-Type header
    headers = { "Content-Type": "application/json" }
    
    index = 'coms6998-photos'
    # Make the signed HTTP request
    r = requests.get(os_host + '/' + index + '/_search', auth=awsauth, headers=headers, data=json.dumps(query))
    # Create the response and add some extra content to support CORS
    response = {
        "statusCode": 200,
        "headers": {
            "Access-Control-Allow-Origin": '*'
        },
        "isBase64Encoded": False
    }

    # Add the search results to the response
    response['body'] = r.text
    hits = json.loads(response['body'])['hits'].get('hits', [])
    #format response body
    results = []
    for each in [hits[i] for i in selected_idx]:
        results.append({each['_source']})
    
    return results
    
    
def lambda_handler(event, context):
    logger.debug('event={}'.format(event))
    print(event)
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
    # perform search
    if l1 or l2:
        if l1:
            search_response1 = search_es(l1)
            logger.debug(search_response1)
            if search_response1:
                response.append(search_response1)
        if l2:
            search_response2 = search_es(l2)
            if search_response2:
                response.append(search_response2)
    return {
        'statusCode': 200,
        'headers': {
            'Access-Control-Allow-Headers': 'Content-Type',
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'OPTIONS,PUT,GET'
        },
        'body': json.dumps(response)
    }
    


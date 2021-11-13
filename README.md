# Cloud Computing & Big Data: Assignment 2: Voice Enabled Photo Album#
### I Hun Chan & Taku Takamatsu ###

## About ##

Project repository for COMS6998: Cloud Computing & Big Data course, Assignment #2. We implemented a serverless, microservice-driven web app which allows for photo uploads and can be searched using natural language through both text and voice.

Core features of this project include:
1. User accesses front-end website hosted on AWS S3, with Amazon Transcribe used to transcribe audio into text 
2. API gateway with GET and PUT methods
2. OpenSearch instance which creates indexes on uploaded photos with appended labels
3. Lambda function LF1 which is triggered when users upload photos from the front-end, this then uses Amazon Rekognition to detect labels in the image and store then in the elastic search index
4. Lex bot which parses text in the searches
5. Lambda function LF2, which given a query "q", disambiguates the query through the Lex bot, and search OpenSearch index for results.
6. AWS CodePipeline for continuous CI/CD
7. AWS CloudFormation stack to represent project infrastructure.

## Website Link ##

Sample Architecture (From Assignment): 
<img src="voice-enabled-photo-search-architecture.jpg" />

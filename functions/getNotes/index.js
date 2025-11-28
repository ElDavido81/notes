const AWS = require('aws-sdk')
const { sendResponse } = require('../../responses/index')
const db = new AWS.DynamoDB.DocumentClient();
const middy = require('@middy/core');
const { validateToken } = require('../middleware/auth');

const getNotes = async (event, context) => {

const userId = event.userId; 

if (event?.error && event?.error == '401')
  return sendResponse(401, {success: false, message: 'Invalid token!'});

try {
  const {Items} = await db.query({
    TableName: 'notes-db',
    KeyConditionExpression: "userId = :userIdValue",
    ExpressionAttributeValues: {":userIdValue": userId}
  }).promise();

  return sendResponse(200, {Items});

}
  catch (error) {
    return sendResponse(404, {message: 'could not fetch notes'});
  }

}

const handler = middy(getNotes).use(validateToken);

module.exports = {handler}
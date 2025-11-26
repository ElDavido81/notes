const AWS = require('aws-sdk')
const { sendResponse } = require('../../responses/index')
const db = new AWS.DynamoDB.DocumentClient();
const middy = require('@middy/core');
const { validateToken } = require('../middleware/auth');

const getNotes = async (event, context) => {

console.log(event.id);
const userId = event.userId; 

if (event?.error && event?.error == '401')
  return sendResponse(401, {success: false, message: 'Invalid token!'});

try {
  console.log(userId);
  const {Items} = await db.query({
    TableName: 'notes-db',
    KeyConditionExpression: "userId = :userIdValue",

    // FilterExpression: "attribute_exists(#userId) AND #userId = :userIdValue",
    // ExpressionAttributeNames: {"#userId" : "userId"},
    ExpressionAttributeValues: {":userIdValue": userId}
  }).promise();

  console.log('getNotes running');

  return sendResponse(200, {Items});

}
  catch (error) {
    console.log(error);
    return sendResponse(404, {message: 'could not fetch notes'});
  }

}

const handler = middy(getNotes).use(validateToken);

module.exports = {handler}
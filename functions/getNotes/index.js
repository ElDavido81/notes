const AWS = require('aws-sdk')
const { sendResponse } = require('../../responses/index')
const db = new AWS.DynamoDB.DocumentClient();

exports.handler = async (event, context) => {

try {
  const {Items} = await db.scan({
    TableName: 'notes-db'
  }).promise();

  return sendResponse(200, {Items});

}
  catch (error) {
    console.log(error);
    return sendResponse(404, {message: 'could not fetch notes'});
  }

}
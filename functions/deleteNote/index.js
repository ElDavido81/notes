const AWS = require('aws-sdk');
const { sendResponse } = require('../../responses');
const db = new AWS.DynamoDB.DocumentClient();

exports.handler = async (event, context) => {

  const {userId, createdAt} = JSON.parse(event.body);

  try { 
    console.log(userId)
    console.log(createdAt)
  await db.delete({
    TableName: 'notes-db',
    Key: {
      userId: userId,
      createdAt: createdAt
    }
  }).promise();

  return sendResponse(200, {success: true});

  }
  catch (error) {
    console.error(error);
    return sendResponse(404, {message: 'Note not found.'})
  }
}
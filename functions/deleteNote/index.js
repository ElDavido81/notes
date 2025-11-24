const AWS = require('aws-sdk');
const { sendResponse } = require('../../responses');
const db = new AWS.DynamoDB.DocumentClient();

exports.handler = async (event, context) => {

  const {userId, id} = JSON.parse(event.body);

  try { 
    console.log(userId)
    console.log(id)
  await db.delete({
    TableName: 'notes-db',
    Key: {
      userId: userId,
      id: id
    }
  }).promise();

  return sendResponse(200, {success: true});

  }
  catch (error) {
    console.error(error);
    return sendResponse(404, {message: 'Note not found.'})
  }
}
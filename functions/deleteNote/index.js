const AWS = require('aws-sdk');
const { sendResponse } = require('../../responses');
const db = new AWS.DynamoDB.DocumentClient();
const middy = require('@middy/core');
const { validateToken } = require('../middleware/auth');

const deleteNote = async (event, context) => {

  const {userId, id} = JSON.parse(event.body);

  if (event?.error && event?.error == '401')
  return sendResponse(401, {success: false, message: 'Invalid token!'});

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
const handler = middy(deleteNote).use(validateToken);

module.exports = {handler}
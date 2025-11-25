const AWS = require('aws-sdk');
const {sendResponse} = require('../../responses/index');
const db = new AWS.DynamoDB.DocumentClient();
const middy = require('@middy/core');
const { validateToken } = require('../middleware/auth');

const addNotes = async (event, context) => {

  if (event?.error && event?.error == '401')
  return sendResponse(401, {success: false, message: 'Invalid token!'});

  const note = JSON.parse(event.body);
  const random = Math.random().toString(36).substring(2, 8);
  // const userId = "test" // lägg till login

  note.id = `${random}`;
  // note.userId = `${userId}`;
  note.createdAt =  new Date().toISOString();
  // note.modifiedAt = new Date().toISOString();

  try {
    await db.put({
      TableName: 'notes-db',
      Item: note
    }).promise()

    return sendResponse(200, {success: true, note});
  }
  catch (error) {
    console.log(error);
    return sendResponse(400, {message: 'could not add note'})
  }
    

}

const handler = middy(addNotes).use(validateToken);

module.exports = {handler}
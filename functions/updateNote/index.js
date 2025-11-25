const AWS = require('aws-sdk');
const db = new AWS.DynamoDB.DocumentClient();
const { sendResponse } = require('../../responses/index');
const middy = require('@middy/core');
const { validateToken } = require('../middleware/auth');

const updateNote = async (event, context) => {

  if (event?.error && event?.error == '401')
  return sendResponse(401, {success: false, message: 'Invalid token!'});

  const {userId, id, ...filteredAttributes} = JSON.parse(event.body);

  filteredAttributes.modifiedAt = new Date().toISOString();

  // const updateAttributes = JSON.parse(event.body);

  const updateExpression = 'set ' + Object.keys(filteredAttributes).map(attributeName => `${attributeName} = :${attributeName}`).join(', '); 
  const expressionAttributeValues = Object.keys(filteredAttributes).reduce((values , attributeName ) => {
      values[`:${attributeName}`] =  filteredAttributes[attributeName];
      return values;
  }, {});

  // expressionAttributeValues[':modifiedAt'] = new Date().toISOString();

  try{
  await db.update({
    TableName: 'notes-db',
    Key: {
      userId: userId,
      id: id
    },
    ReturnValue: 'ALL_NEW',
    UpdateExpression: updateExpression,
    ExpressionAttributeValues: expressionAttributeValues

  }).promise();

  return sendResponse(200, {success: true})

  }
  catch(error) {
    console.error(error)
    return sendResponse(404, {message: 'note not found'})
  }
}

const handler = middy(updateNote).use(validateToken);

module.exports = {handler}
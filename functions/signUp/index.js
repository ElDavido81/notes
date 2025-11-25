const AWS = require('aws-sdk')
const { sendResponse } = require("../../responses");
const bcrypt = require('bcryptjs')
const db = new AWS.DynamoDB.DocumentClient();


async function createAccount(username, hashedPassword, accountId, firstname, lastname ) {

  try {
    await db.put ({
      TableName: 'notes-accounts',
      Item: {
        username: username,
        password: hashedPassword,
        firstname: firstname,
        lastname: lastname,
        accountId: accountId
      }
    }).promise();

    return {success: true, accountId: accountId};

  } catch (error) {
    return {success: false, message: 'could not create account'}
  }

}


async function signup(username, password, firstname, lastname) {

  // if (username) {
  //   return {success: false, message: 'Username already exists.'}
  // }

  const hashedPassword = await bcrypt.hash(password, 10)
  const accountId = Math.random().toString(36).substring(2, 8);

  const result = await createAccount(username, hashedPassword, accountId, firstname, lastname );
  return result

}


exports.handler = async (event) => {

  const { username, password, firstname, lastname} = JSON.parse(event.body);

  const result = await signup(username, password, firstname, lastname);

  if (result.success) {
    return sendResponse(200, result)
  } else {
    return sendResponse(400, result)
  }
}
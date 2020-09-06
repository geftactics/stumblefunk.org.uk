"use strict";

const uuid = require("short-uuid");
const AWS = require("aws-sdk");
var db = new AWS.DynamoDB({ apiVersion: "2012-08-10" });
var dc = new AWS.DynamoDB.DocumentClient();

// --- groups/create --------------------------------------------------------------------------------------------------------------

module.exports.create = async (event) => {
  const requestBody = JSON.parse(event.body);
  if (!requestBody || !requestBody.userID || !isAdmin(requestBody.userID)) return response(401, "Unauthorized");

  var newID = uuid.generate();
  var params = {
    TableName: process.env.TABLE_NAME,
    Item: {
      id: { S: newID },
      group_name: { S: ""},
      adults: { N: "0" },
      kids: { N: "0" },
      vehicles: { N: "0" },
    },
  };

  try {
    var data = await db.putItem(params).promise();
  } catch (error) {
    console.log("DB ERROR: ", error);
    return response(400, "Database Error");
  }

  return response(200, newID);
};


// --- groups/list --------------------------------------------------------------------------------------------------------------

module.exports.list = async (event) => {
  const requestBody = JSON.parse(event.body);
  if (!requestBody || !requestBody.userID || !isAdmin(requestBody.userID)) return response(401, "Unauthorized");

  var params = {
    TableName: process.env.TABLE_NAME,
  };

  try {
    var data = await dc.scan(params).promise();
  } catch (error) {
    console.log("DB ERROR: ", error);
    return response(400, "Database Error");
  }

  return response(200, data.Items);
};


// --- groups/update --------------------------------------------------------------------------------------------------------------

module.exports.update = async (event) => {
  const requestBody = JSON.parse(event.body);
  if (!requestBody || !requestBody.userID || !isAdmin(requestBody.userID)) return response(401, "Unauthorized");
  if (!requestBody.id) return response(400, "id not specified")
  if (!requestBody.group_name) return response(400, "group_name not specified")
  if (!Number.isInteger(requestBody.adults)) return response(400, "adults must be an integer")
  if (!Number.isInteger(requestBody.kids)) return response(400, "kids must be an integer")
  if (!Number.isInteger(requestBody.vehicles)) return response(400, "vehicles must be an integer")

  var params = {
    TableName: process.env.TABLE_NAME,
    Key: {
      id: requestBody.id,
    },
    UpdateExpression: "set kids=:k, adults=:a, vehicles=:v, group_name=:n",
    ExpressionAttributeValues:{
        ":k":requestBody.kids,
        ":a":requestBody.adults,
        ":v":requestBody.vehicles,
        ":n":requestBody.group_name,
    },
    ReturnValues:"UPDATED_NEW"
  };

  try {
    var data = await dc.update(params).promise();
  } catch (error) {
    console.log("DB ERROR: ", error);
    return response(400, "Database Error");
  }

  return response(200, data.Attributes);
};


// --- groups/delete --------------------------------------------------------------------------------------------------------------

module.exports.delete = async (event) => {
  const requestBody = JSON.parse(event.body);
  if (!requestBody || !requestBody.userID || !isAdmin(requestBody.userID)) return response(401, "Unauthorized");
  if (!requestBody.id) return response(400, "id not specified")

  var params = {
    TableName: process.env.TABLE_NAME,
    Key: {
      id: requestBody.id,
    }
  };

  try {
    var data = await dc.delete(params).promise();
  } catch (error) {
    console.log("DB ERROR: ", error);
    return response(400, "Database Error");
  }

  return response(200, requestBody.id);
};


// --- helper functions ---------------------------------------------------------------------------------------------------------

function response(code, message) {
  return {
    statusCode: code,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': true,
    },
    body: JSON.stringify({
      message: message,
    }),
  };
}

function isAdmin(userid) {
  if (userid == process.env.ADMIN_ID) return true;
  else return false;
}
"use strict";

const uuid = require("short-uuid");
const AWS = require("aws-sdk");
var db = new AWS.DynamoDB({ apiVersion: "2012-08-10" });


// --- groups/create --------------------------------------------------------------------------------------------------------------

module.exports.create = async (event) => {
  const requestBody = JSON.parse(event.body);
  if (!isAdmin(requestBody.userID)) return response(401, "Unauthorized");

  var newID = uuid.generate();
  var params = {
    TableName: process.env.TABLE_NAME,
    Item: {
      id: { S: newID },
      adults: { N: "0" },
      kids: { N: "0" },
      vehicles: { N: "0" },
    },
  };

  try {
    const data = await db.putItem(params).promise();
  } catch (error) {
    console.log("DB ERROR: ", error);
    return response(400, "Database Error");
  }

  return response(200, newID);
};


// --- groups/list --------------------------------------------------------------------------------------------------------------

module.exports.list = async (event) => {
  const requestBody = JSON.parse(event.body);
  if (!isAdmin(requestBody.userID)) return response(401, "Unauthorized");

  var params = {
    TableName: process.env.TABLE_NAME,
  };

  try {
    var data = await db.scan(params).promise();
  } catch (error) {
    console.log("DB ERROR: ", error);
    return response(400, "Database Error");
  }

  return response(200, data.Items);
};


// --- groups/update --------------------------------------------------------------------------------------------------------------

module.exports.update = async (event) => {
  const requestBody = JSON.parse(event.body);
  if (!isAdmin(requestBody.userID)) return response(401, "Unauthorized");
  return response(200, "update function");
};


// --- groups/delete --------------------------------------------------------------------------------------------------------------

module.exports.delete = async (event) => {
  const requestBody = JSON.parse(event.body);
  if (!isAdmin(requestBody.userID)) return response(401, "Unauthorized");
  return response(200, "delete function");
};


// --- helper functions ---------------------------------------------------------------------------------------------------------

function response(code, message) {
  return {
    statusCode: code,
    body: JSON.stringify({
      message: message,
    }),
  };
}

function isAdmin(userid) {
  if (userid == process.env.ADMIN_ID) return true;
  else return false;
}
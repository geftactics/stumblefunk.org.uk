"use strict";

const uuid = require("uuid");
const AWS = require("aws-sdk");

var db = new AWS.DynamoDB({ apiVersion: "2012-08-10" });

const json_forbidden = {
  statusCode: 403,
  body: JSON.stringify({
    message: "Forbidden!",
  }),
};

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

module.exports.create = async (event) => {
  if (!isAdmin(event.headers.userid)) return response(401, "Unauthorized");
  const requestBody = JSON.parse(event.body);

  var params = {
    TableName: process.env.TABLE_NAME,
    Item: {
      id: { S: uuid.v1() },
      adults: { N: "0" },
      kids: { N: "0" },
      vehicles: { N: "0" }
    },
  };

  try {
    const data = await db.putItem(params).promise();
  } catch (error) {
    console.log("DB ERROR: ", error);
    return response(400, "Database Error");
  }

  return {
    statusCode: 200,
    body: JSON.stringify({
      message: "ok",
      event: event.body
    }),
  };

  return response(200, requestBody);
};

module.exports.list = async (event) => {
  if (!isAdmin(event.headers.userid)) return response(401, "Unauthorized");
  else {
    return {
      statusCode: 200,
      body: JSON.stringify({
        message: "Go Serverless v1.0! LIST",
        input: event.headers.userid,
      }),
    };
  }
};

module.exports.update = async (event) => {
  if (!isAdmin(event.headers.userid)) return response(401, "Unauthorized");
  return {
    statusCode: 200,
    body: JSON.stringify({
      message: "Go Serverless v1.0! UPDATE",
      //input: event,
    }),
  };
};

module.exports.delete = async (event) => {
  if (!isAdmin(event.headers.userid)) return response(401, "Unauthorized");
  return {
    statusCode: 200,
    body: JSON.stringify({
      message: "Go Serverless v1.0! DELETE",
      //input: event,
    }),
  };
};

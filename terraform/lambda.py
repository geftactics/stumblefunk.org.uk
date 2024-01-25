import boto3
import decimal
import json
import logging
import os
import uuid

logger = logging.getLogger()
logger.setLevel(logging.INFO)

dynamodb = boto3.resource("dynamodb")
group_table = dynamodb.Table(os.getenv("DDB_TABLE_GROUPS"))
ticket_table = dynamodb.Table(os.getenv("DDB_TABLE_TICKETS"))


def handler(event, context):
    logger.info(event)
    http_method = event["httpMethod"]
    path = event["path"]
    
    global is_admin, user_id
    user_id = event['headers'].get('Authorization', None)
    is_admin = True if user_id == os.getenv("MASTER_USER") else False

    if http_method == 'GET' and path == '/health':
        response = build_response(200)
    elif http_method == 'POST' and path == '/group':
        response = create_group()
    elif http_method == 'GET' and path == '/groups':
        response = get_groups()
    elif http_method == 'GET' and path == '/group':
        response = get_group(event["queryStringParameters"].get('group_id', None))
    elif http_method == 'PATCH' and path == '/group':
        response = modify_group(json.loads(event["body"]))
    elif http_method == 'DELETE' and path == '/group':
        response = delete_group(event["queryStringParameters"].get('group_id', None))
    else:
        response = build_response(404, "Not Found")
    return response


def create_group():
    try:
        if is_admin:
            group_id = str(uuid.uuid4())[:8]
            group_table.put_item(
                    Item={
                        "group_id": group_id,
                        "group_name": "",
                        "qty_adults": 0,
                        "qty_kids": 0,
                        "qty_vehicles": 0
                    }
                )
            body = {
                "Operation": "SAVE_GROUP",
                "Message": "SUCCESS",
                "group_id": group_id
            }
            return build_response(200, body)
        else:
            body = {
                "Operation": "SAVE_GROUP",
                "Message": "ACCESS_DENIED"
            }
            return build_response(403, body)
    except:
        logger.exception("ERROR - SAVE_GROUP")


def get_groups():
    try:
        if is_admin:
            response = group_table.scan()
            result = response["Items"]
            while "LastEvaluateKey" in response:
                response = group_table.scan(ExclusiveStartKey=response["LastEvaluatedKey"])
                result.extend(response["Items"])
            body = {
                "groups": result
            }
            return build_response(200, body)
        else:
            body = {
                "Operation": "GET_GROUPS",
                "Message": "ACCESS_DENIED"
            }
            return build_response(403, body)
    except:
        logger.exception("ERROR - GET_GROUPS")


def get_group(group_id):
    try:
        if (is_admin or (user_id == group_id)) and group_id:
            response = group_table.get_item(
                Key={
                    "group_id": group_id
                }
            )
            if "Item" in response:
                return build_response(200, response["Item"])
            else:
                return build_response(404, {"Message": "group_id: {0}s not found".format(group_id)})
        else:
            body = {
                "Operation": "GET_GROUP",
                "Message": "ACCESS_DENIED"
            }
            return build_response(403, body)

    except:
        logger.exception("ERROR - GET_GROUP")


def modify_group(request_body):
    # TODO - check not reducing beyond allocated
    try:
        if is_admin:
            response = group_table.update_item(
                Key={
                    "group_id": request_body["group_id"]
                },
                AttributeUpdates={
                    "group_name": {"Value": request_body["group_name"], "Action": "PUT"},
                    "qty_adults": {"Value": request_body["qty_adults"], "Action": "PUT"},
                    "qty_kids": {"Value": request_body["qty_kids"], "Action": "PUT"},
                    "qty_vehicles": {"Value": request_body["qty_vehicles"], "Action": "PUT"}
                },
                ReturnValues="UPDATED_NEW"
            )
            body = {
                "Operation": "MODIFY_GROUP",
                "Message": "SUCCESS",
                "group_id": request_body["group_id"],
                "UpdatedAttributes": response.get("Attributes", '')
            }
            return build_response(200, body)
        else:
            body = {
                "Operation": "MODIFY_GROUP",
                "Message": "ACCESS_DENIED"
            }
            return build_response(403, body)
    except:
        logger.exception("Do your custom error handling here. I am just gonna log it our here!!")


def delete_group(group_id):
    # TODO - check not deleting if tickets exist
    try:
        if is_admin:
            response = group_table.delete_item(
                Key={
                    "group_id": group_id
                },
                ReturnValues="ALL_OLD"
            )
            body = {
                "Operation": "DELETE_GROUP",
                "Message": "SUCCESS",
                "deltedItem": response.get("Attributes", '')
            }
            return build_response(200, body)
        else:
            body = {
                "Operation": "DELETE_GROUP",
                "Message": "ACCESS_DENIED"
            }
            return build_response(403, body)

    except:
        logger.exception("ERROR - DELETE_GROUP")


def build_response(statusCode, body=None):
    response = {
        "statusCode": statusCode,
        "headers": {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*"
        }
    }

    if body is not None:
        response["body"] = json.dumps(body, cls=DecimalEncoder)
    return response


class DecimalEncoder(json.JSONEncoder):
    def default(self, o):
        if isinstance(o, decimal.Decimal):
            return str(o)
        return super().default(o)
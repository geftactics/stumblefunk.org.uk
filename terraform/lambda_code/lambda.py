import boto3
import decimal
import json
import logging
import os
import uuid
from datetime import datetime, date

close_date = "2024-02-26"

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
    elif http_method == 'POST' and path == '/ticket':
        response = create_ticket(json.loads(event["body"]))
    elif http_method == 'DELETE' and path == '/ticket':
        response = delete_ticket(event["queryStringParameters"].get('ticket_id', None))
    elif http_method == 'POST' and path == '/login':
        response = login(json.loads(event["body"]))
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
                        "adult": 0,
                        "child": 0,
                        "vehicle": 0
                    }
                )
            body = {
                "Operation": "CREATE_GROUP",
                "Message": "SUCCESS",
                "group_id": group_id
            }
            return build_response(200, body)
        else:
            body = {
                "Operation": "CREATE_GROUP",
                "Message": "ACCESS_DENIED"
            }
            return build_response(403, body)
    except:
        logger.exception("ERROR - CREATE_GROUP")


def get_groups():
    try:
        if is_admin:
            response = group_table.scan()
            result = response["Items"]
            while "LastEvaluateKey" in response:
                response = group_table.scan(ExclusiveStartKey=response["LastEvaluatedKey"])
                result.extend(response["Items"])

            # get totals used
            data = []
            for g in response["Items"]:
                total = {}
                for ticket_type in ['adult', 'child', 'vehicle']:
                    response = ticket_table.scan(
                        FilterExpression="group_id = :group_id AND ticket_type = :ticket_type",
                        ExpressionAttributeValues={
                            ":group_id": g['group_id'],
                            ":ticket_type": ticket_type
                        }
                    )
                    total[ticket_type] = response.get('Count', 0)
                    g[ticket_type + '_used'] = total[ticket_type]
                data.append(g)

            body = {
                "groups": data
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
                group = response["Item"]
                total = {}
                for ticket_type in ['adult', 'child', 'vehicle']:
                    response = ticket_table.scan(
                        FilterExpression="group_id = :group_id AND ticket_type = :ticket_type",
                        ExpressionAttributeValues={
                            ":group_id": group_id,
                            ":ticket_type": ticket_type
                        }
                    )
                    total[ticket_type] = response.get('Count', 0)
                group['adult_used'] = total['adult']
                group['child_used'] = total['child']
                group['vehicle_used'] = total['vehicle']
                return build_response(200, group)
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
    try:
        if is_admin:
            group_id = request_body["group_id"]

            # Validate group exists and any resize is within current ticket usage
            response = group_table.get_item(Key={"group_id": group_id})
            group = response.get('Item')
            if group:
                for ticket_type in ['adult', 'child', 'vehicle']:
                    response = ticket_table.scan(
                        FilterExpression="group_id = :group_id AND ticket_type = :ticket_type",
                        ExpressionAttributeValues={
                            ":group_id": group_id,
                            ":ticket_type": ticket_type
                        }
                    )
                    count = response.get('Count', 0)
                    if int(request_body[ticket_type]) < count:
                        body = {
                            "Operation": "MODIFY_GROUP",
                            "Message": "LIMIT_EXCEEDED"
                        }
                        return build_response(403, body)

            else:
                body = {
                    "Operation": "MODIFY_GROUP",
                    "Message": "NOT_FOUND"
                }
                return build_response(404, body)


            response = group_table.update_item(
                Key={
                    "group_id": group_id
                },
                AttributeUpdates={
                    "group_name": {"Value": request_body["group_name"], "Action": "PUT"},
                    "adult": {"Value": int(request_body["adult"]), "Action": "PUT"},
                    "child": {"Value": int(request_body["child"]), "Action": "PUT"},
                    "vehicle": {"Value": int(request_body["vehicle"]), "Action": "PUT"}
                },
                ReturnValues="UPDATED_NEW"
            )
            body = {
                "Operation": "MODIFY_GROUP",
                "Message": "SUCCESS",
                "group_id": group_id,
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
        logger.exception("ERROR - MODIFY GROUP")


def delete_group(group_id):
    try:
        if is_admin:

            # Find tickets
            response = ticket_table.scan(
                FilterExpression="group_id = :group_id",
                ExpressionAttributeValues={":group_id": group_id}
            )

            # Delete tickets
            for item in response.get('Items', []):
                ticket_table.delete_item(Key={"ticket_id": item['ticket_id']})

            # Delete group
            response = group_table.delete_item(
                Key={"group_id": group_id},
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


def create_ticket(request_body):
    try:
        group_id = request_body.get('group_id')
        ticket_type = request_body.get('ticket_type')
        ticket_id = str(uuid.uuid4())   

        # Check ID is valid...
        group_check = group_table.get_item(Key={"group_id": group_id})
        if not 'Item' in group_check:
            body = {
                "Operation": "CREATE_TICKET",
                "Message": "ACCESS_DENIED"
            }
            return build_response(403, body)

        # Check group has capacity...
        response = ticket_table.scan(
            FilterExpression="group_id = :group_id AND ticket_type = :ticket_type",
            ExpressionAttributeValues={
                ":group_id": group_id,
                ":ticket_type": ticket_type
            }
        )
        if response.get('Count') >= int(group_check['Item'][ticket_type]):
            body = {
                "Operation": "CREATE_TICKET",
                "Message": "LIMIT_EXCEEDED"
            }
            return build_response(403, body)
     
        # Build item structures
        if ticket_type == 'adult':
            item={
                    "ticket_id": ticket_id,
                    "ticket_type": ticket_type,
                    "group_id": group_id,
                    "first_name": request_body.get('first_name'),
                    "last_name": request_body.get('last_name'),
                    "involvement": request_body.get('involvement'),
                    "email": request_body.get('email'),
                    "mobile_phone": request_body.get('mobile_phone'),
                }
        elif ticket_type == 'child':
            item={
                    "ticket_id": ticket_id,
                    "ticket_type": ticket_type,
                    "group_id": group_id,
                    "first_name": request_body.get('first_name'),
                    "last_name": request_body.get('last_name'),
                    "parent_id": request_body.get('parent_id'),
                    "child_age": request_body.get('child_age'),
                    "child_offsite_contact": request_body.get('child_offsite_contact'),
                    "child_offsite_mobile": request_body.get('child_offsite_mobile'),
                    "mobile_phone": request_body.get('mobile_phone'),
                }
        elif ticket_type == 'vehicle':
            item={
                    "ticket_id": ticket_id,
                    "ticket_type": ticket_type,
                    "group_id": group_id,
                    "driver_id": request_body.get('driver_id'),
                    "mobile_phone": request_body.get('mobile_phone'),
                    "vehicle_reg": request_body.get('vehicle_reg'),
                    "vehicle_size": request_body.get('vehicle_size'),
                    "vehicle_parking": request_body.get('vehicle_parking'),
                }
        else:
            return build_response(422)
        
        # Reject any missing data
        if any(value is None for value in item.values()):
            body = {
                "Operation": "CREATE_TICKET",
                "Message": "MISSING_DATA"
            }
            return build_response(422, body)
        
        # Check driver ID is valid...
        if ticket_type == 'vehicle':
            response = ticket_table.get_item(Key={"ticket_id": request_body.get('driver_id')})
            if response.get('Item', {}).get('ticket_type') != 'adult' or response.get('Item', {}).get('group_id') != group_id:
                body = {
                    "Operation": "CREATE_TICKET",
                    "Message": "INVALID_LINK"
                }
                return build_response(403, body)
            
        # Check parent ID is valid...
        if ticket_type == 'child':
            response = ticket_table.get_item(Key={"ticket_id": request_body.get('parent_id')})
            if response.get('Item', {}).get('ticket_type') != 'adult' or response.get('Item', {}).get('group_id') != group_id:
                body = {
                    "Operation": "CREATE_TICKET",
                    "Message": "INVALID_LINK"
                }
                return build_response(403, body)
            
        # Create it!
        ticket_table.put_item(Item=item)
        body = {
            "Operation": "CREATE_TICKET",
            "Message": "SUCCESS",
            "ticket_id": ticket_id
        }
        return build_response(200, body)
 
    except:
        logger.exception("ERROR - CREATE_TICKET")


def delete_ticket(ticket_id):
    try:
        # Check ownership
        response = ticket_table.get_item(Key={"ticket_id": ticket_id})
        if (user_id != response.get('Item', {}).get('group_id')) or user_id is None:
            body = {
                "Operation": "DELETE_TICKET",
                "Message": "ACCESS_DENIED"
            }
            return build_response(403, body)

        # Check for children and vehicle links
        response = ticket_table.scan(
            FilterExpression="driver_id = :search_id or parent_id = :search_id",
            ExpressionAttributeValues={
                ":search_id": ticket_id
            }
        )
        if response.get('Count', 0) > 0:
            body = {
                "Operation": "DELETE_TICKET",
                "Message": "EXISTING_LINK"
            }
            return build_response(403, body)

        response = ticket_table.delete_item(Key={"ticket_id": ticket_id})
        body = {
            "Operation": "DELETE_TICKET",
            "Message": "SUCCESS"
        }
        return build_response(200, body)

    except:
        logger.exception("ERROR - DELETE_TICKET")


def login(request_body):
    try:
        if os.getenv("MASTER_USER") == request_body.get('group_id'):
            group_id = request_body["group_id"]
            body = {
                "Operation": "LOGIN",
                "Message": "ADMIN"
            }
            return build_response(200, body)
        elif datetime.strptime(close_date, "%Y-%m-%d").date() <= date.today():
            body = {
                "Operation": "LOGIN",
                "Message": "CLOSED"
            }
            return build_response(403, body)
        elif group_table.get_item(Key={"group_id": request_body.get('group_id')}).get('Item'):
            body = {
                "Operation": "LOGIN",
                "Message": "USER"
            }
            return build_response(200, body)
        else:
            body = {
                "Operation": "LOGIN",
                "Message": "ACCESS_DENIED"
            }
            return build_response(403, body)

    except:
        logger.exception("ERROR - MODIFY GROUP")


# TODO: get tickets (all for group_id)
# TODO: get totals (admin only)
        
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
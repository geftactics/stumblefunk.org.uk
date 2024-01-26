import os
import json
import requests
import pytest

API_BASE_URL = "https://nf2c6o0vt2.execute-api.eu-west-1.amazonaws.com/dev"
MASTER_USER = 'masterpass'


def test_health_check():
    response = requests.get(f"{API_BASE_URL}/health")
    assert response.status_code == 200


def test_create_group():
    headers = {"Authorization": MASTER_USER}
    response = requests.post(f"{API_BASE_URL}/group", headers=headers)
    assert response.status_code == 200
    assert "group_id" in response.json()
    global group_id
    group_id = response.json().get("group_id")


def test_create_group_no_auth():
    response = requests.post(f"{API_BASE_URL}/group")
    assert response.status_code == 403
    assert "ACCESS_DENIED" in response.json().get("Message")


def test_get_groups():
    headers = {"Authorization": MASTER_USER}
    response = requests.get(f"{API_BASE_URL}/groups", headers=headers)
    assert response.status_code == 200
    assert "groups" in response.json()


def test_get_groups_no_auth():
    response = requests.get(f"{API_BASE_URL}/groups")
    assert response.status_code == 403
    assert "ACCESS_DENIED" in response.json().get("Message")


def test_get_group():
    headers = {"Authorization": MASTER_USER}
    response = requests.get(f"{API_BASE_URL}/group?group_id={group_id}", headers=headers)
    assert response.status_code == 200
    assert "group_id" in response.json()


def test_get_group_no_auth():
    response = requests.get(f"{API_BASE_URL}/group?group_id={group_id}")
    assert response.status_code == 403
    assert "ACCESS_DENIED" in response.json().get("Message")


def test_get_group_not_found():
    headers = {"Authorization": MASTER_USER}
    response = requests.get(f"{API_BASE_URL}/group?group_id=xxxxxxxx", headers=headers)
    assert response.status_code == 404
    assert "not found" in response.json().get("Message")


def test_modify_group():
    headers = {"Authorization": MASTER_USER}
    payload = {"group_id": group_id, "group_name": "New Group Name", "adult": 3, "child": 2, "vehicle": 2}
    response = requests.patch(f"{API_BASE_URL}/group", json=payload, headers=headers)
    assert response.status_code == 200
    assert "group_id" in response.json()


def test_modify_group_no_auth():
    payload = {"group_id": group_id, "group_name": "New Group Name", "adult": 3, "child": 2, "vehicle": 2}
    response = requests.patch(f"{API_BASE_URL}/group", json=payload)
    assert response.status_code == 403
    assert "ACCESS_DENIED" in response.json().get("Message")


def test_modify_group_not_found():
    headers = {"Authorization": MASTER_USER}
    payload = {"group_id": "xxxxxxxx", "group_name": "New Group Name", "adult": 3, "child": 2, "vehicle": 2}
    response = requests.patch(f"{API_BASE_URL}/group", json=payload, headers=headers)
    assert response.status_code == 404
    assert "NOT_FOUND" in response.json().get("Message")


def test_create_tickets_adult_missing_data():
    headers = {"Authorization": MASTER_USER}
    payload = {
        "group_id": group_id,
        "ticket_type": "adult",
        "involvement": "Member",
        "email": "john.doe@example.com",
        "mobile_phone": "07990 123456"
    }
    response = requests.post(f"{API_BASE_URL}/ticket", json=payload, headers=headers)
    assert response.status_code == 422
    assert "MISSING_DATA" in response.json().get("Message")


def test_create_tickets_not_found():
    payload = {
        "group_id": "xxxxxxxx",
        "ticket_type": "adult",
        "first_name": "John",
        "last_name": "Doe",
        "involvement": "Member",
        "email": "john.doe@example.com",
        "mobile_phone": "07990 123456"
    }
    response = requests.post(f"{API_BASE_URL}/ticket", json=payload)
    assert response.status_code == 403
    assert "ACCESS_DENIED" in response.json().get("Message")


def test_create_tickets_adult():
    headers = {"Authorization": MASTER_USER}
    payload = {
        "group_id": group_id,
        "ticket_type": "adult",
        "first_name": "John",
        "last_name": "Doe",
        "involvement": "Member",
        "email": "john.doe@example.com",
        "mobile_phone": "07990 123456"
    }
    for i in range (3):
        response = requests.post(f"{API_BASE_URL}/ticket", json=payload, headers=headers)
        assert response.status_code == 200
        assert "ticket_id" in response.json()
        global ticket_id_adult
        ticket_id_adult = response.json().get("ticket_id")


def test_create_tickets_adult_extra():
    headers = {"Authorization": MASTER_USER}
    payload = {
        "group_id": group_id,
        "ticket_type": "adult",
        "first_name": "John",
        "last_name": "Doe",
        "involvement": "Member",
        "email": "john.doe@example.com",
        "mobile_phone": "07990 123456"
    }
    response = requests.post(f"{API_BASE_URL}/ticket", json=payload, headers=headers)
    assert response.status_code == 403
    assert "LIMIT_EXCEEDED" in response.json().get("Message")


def test_modify_group_decrease_adult():
    headers = {"Authorization": MASTER_USER}
    payload = {"group_id": group_id, "group_name": "New Group Name", "adult": 2, "child": 2, "vehicle": 2}
    response = requests.patch(f"{API_BASE_URL}/group", json=payload, headers=headers)
    assert response.status_code == 403
    assert "LIMIT_EXCEEDED" in response.json().get("Message")


def test_create_tickets_vehicle():
    headers = {"Authorization": MASTER_USER}
    payload = {
        "group_id": group_id,
        "ticket_type": "vehicle",
        "driver_id": ticket_id_adult,
        "vehicle_reg": "AB12CDE",
        "vehicle_size": "Van",
        "vehicle_parking": "Crew",
        "mobile_phone": "07990 123123"
    }
    response = requests.post(f"{API_BASE_URL}/ticket", json=payload, headers=headers)
    assert response.status_code == 200
    assert "ticket_id" in response.json()
    global ticket_id_vehicle
    ticket_id_vehicle = response.json().get("ticket_id")


def test_create_tickets_vehicle_invalid():
    headers = {"Authorization": MASTER_USER}
    payload = {
        "group_id": group_id,
        "ticket_type": "vehicle",
        "driver_id": "605d901d-c5e3-4d1d-a10b-xxxxxxxxxxx",
        "vehicle_reg": "AB12CDE",
        "vehicle_size": "Van",
        "vehicle_parking": "Crew",
        "mobile_phone": "07990 123123"
    }
    response = requests.post(f"{API_BASE_URL}/ticket", json=payload, headers=headers)
    assert response.status_code == 403
    assert "INVALID_LINK" in response.json().get("Message") 


def test_create_tickets_child():
    headers = {"Authorization": MASTER_USER}
    payload = {
        "group_id": group_id,
        "parent_id": ticket_id_adult,
        "ticket_type": "child",
        "first_name": "Tom",
        "last_name": "Thumb",
        "child_age": 6,
        "child_offsite_contact": "Fred Smith",
        "child_offsite_mobile": "07847 467876",
        "mobile_phone": "07990 123123"
    }
    response = requests.post(f"{API_BASE_URL}/ticket", json=payload, headers=headers)
    assert response.status_code == 200
    assert "ticket_id" in response.json()
    global ticket_id_child
    ticket_id_child = response.json().get("ticket_id")


def test_create_tickets_child_invalid():
    headers = {"Authorization": MASTER_USER}
    payload = {
        "group_id": group_id,
        "parent_id": "605d901d-c5e3-4d1d-a10b-xxxxxxxxxxx",
        "ticket_type": "child",
        "first_name": "Tom",
        "last_name": "Thumb",
        "child_age": 6,
        "child_offsite_contact": "Fred Smith",
        "child_offsite_mobile": "07847 467876",
        "mobile_phone": "07990 123123"
    }
    response = requests.post(f"{API_BASE_URL}/ticket", json=payload, headers=headers)
    assert response.status_code == 403
    assert "INVALID_LINK" in response.json().get("Message") 


def test_login_user_ok():
    payload = {"group_id": group_id}
    response = requests.post(f"{API_BASE_URL}/login", json=payload)
    assert response.status_code == 200
    assert "USER" in response.json().get("Message") 


def test_login_admin_ok():
    payload = {"group_id": MASTER_USER}
    response = requests.post(f"{API_BASE_URL}/login", json=payload)
    assert response.status_code == 200
    assert "ADMIN" in response.json().get("Message") 


def test_login_bad():
    payload = {"group_id": "xxxxxx"}
    response = requests.post(f"{API_BASE_URL}/login", json=payload)
    assert response.status_code == 403
    assert "ACCESS_DENIED" in response.json().get("Message")


def test_delete_ticket_linked():
    headers = {"Authorization": group_id}
    response = requests.delete(f"{API_BASE_URL}/ticket?ticket_id={ticket_id_adult}", headers=headers)
    assert response.status_code == 403
    assert "EXISTING_LINK" in response.json().get("Message") 


def test_delete_ticket_no_auth():
    response = requests.delete(f"{API_BASE_URL}/ticket?ticket_id={ticket_id_adult}")
    assert response.status_code == 403
    assert "ACCESS_DENIED" in response.json().get("Message") 


def test_delete_ticket_invalid_id():
    headers = {"Authorization": group_id}
    response = requests.delete(f"{API_BASE_URL}/ticket?ticket_id=xxxxxx-xxxxxx", headers=headers)
    assert response.status_code == 403
    assert "ACCESS_DENIED" in response.json().get("Message") 


def test_delete_ticket_linked():
    headers = {"Authorization": group_id}
    response = requests.delete(f"{API_BASE_URL}/ticket?ticket_id={ticket_id_adult}", headers=headers)
    assert response.status_code == 403
    assert "EXISTING_LINK" in response.json().get("Message") 


def test_delete_ticket_vehicle():
    headers = {"Authorization": group_id}
    response = requests.delete(f"{API_BASE_URL}/ticket?ticket_id={ticket_id_vehicle}", headers=headers)
    assert response.status_code == 200
    assert "SUCCESS" in response.json().get("Message") 


def test_delete_ticket_child():
    headers = {"Authorization": group_id}
    response = requests.delete(f"{API_BASE_URL}/ticket?ticket_id={ticket_id_child}", headers=headers)
    assert response.status_code == 200
    assert "SUCCESS" in response.json().get("Message") 


def test_delete_ticket_bad_auth():
    headers = {"Authorization": "xxxxxxx"}
    response = requests.delete(f"{API_BASE_URL}/ticket?ticket_id={ticket_id_adult}", headers=headers)
    assert response.status_code == 403
    assert "ACCESS_DENIED" in response.json().get("Message") 


def test_delete_ticket_linked_retry():
    headers = {"Authorization": group_id}
    response = requests.delete(f"{API_BASE_URL}/ticket?ticket_id={ticket_id_adult}", headers=headers)
    assert response.status_code == 200
    assert "SUCCESS" in response.json().get("Message") 


def test_delete_group_no_auth():
    response = requests.delete(f"{API_BASE_URL}/group?group_id=xxxxxxxx")
    assert response.status_code == 403
    assert "ACCESS_DENIED" in response.json().get("Message")


def test_delete_group():
    headers = {"Authorization": MASTER_USER}
    response = requests.delete(f"{API_BASE_URL}/group?group_id={group_id}", headers=headers)
    assert response.status_code == 200
    assert response.json()["deltedItem"] != ""



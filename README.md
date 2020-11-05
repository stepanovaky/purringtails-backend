# Purring Tails API

This API uses GET, POST, and DELETE requests to communicate and HTTP response codes to indicate status and errors. 

## Response Codes

- 200: Success
- 201: Created
- 204: Success
- 400: Bad Request

## Login

**You send:** Your login credentials encrypted with base64. **You get:** A JWT-token with which you can make further actions. 

### Request

POST /api/user/email/login

### Response

Status: 200
[User Id, User's Name, User Email, User's hashed password, JWT token]
Status: 400
[Incorrect email or password] OR [Missing Authorization in request heqader]

## Registration

**You send:** Your name, email, and password encrypted with base64. **You get:** A 201 status that a new user has been created. 

### Request

POST /api/user

### Response

Status: 201
[Created]
Status: 400
[Missing User's Name or Authorization Token in request body] OR [User email already taken]

## List future services scheduled by user

**You send:** User email with JWT token. **You get:** A list of user specific scheduled services

### Request

GET /api/schedule

### Response

[A list of user specific scheduled services]

## Schedule new service
**You send:** User ID, service type, the start date of service, the end date of service (if applicable) and JWT token. 
**You get:** A status response that the service was created

### Request

POST /api/schedule

### Response

Status: 200
[OK]
Status:400
[Timeslot already taken]

## Delete Service

**You send:** The ID of the service to be deleted. **You get:** Status code 204 that it was successfully deleted. 

### Request

DELETE /api/schedule

### Response

Status: 204
[Success]


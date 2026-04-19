# ArchStudio — API Contracts

Base URL: `http://localhost:3000/api/v1`

All authenticated endpoints require `Authorization: Bearer <access_token>` header.

---

## Auth

### POST /auth/login
Login with email + password.
```json
Request:  { "email": "pamir@archstudio.ca", "password": "password" }
Response: {
  "user": { "id": "...", "name": "Pamir Dogan", "email": "...", "role": "principal" },
  "accessToken": "eyJ...",
  "refreshToken": "eyJ...",
  "expiresIn": 900
}
```

### POST /auth/refresh
```json
Request:  { "refreshToken": "eyJ..." }
Response: { "accessToken": "...", "refreshToken": "...", "expiresIn": 900 }
```

### POST /auth/logout
Requires auth. Returns 204.

### GET /auth/me
Returns current user from JWT.

---

## Projects

### GET /projects
Query params: `status`, `type`, `clientId`
Returns array of projects with client and member data.

### GET /projects/:id
Returns full project with invoices and member details.

### GET /projects/:id/budget
Returns: `{ budget, spent, remaining, percentUsed }`

### POST /projects
Role: architect+
```json
{
  "name": "Rosedale Residence",
  "clientId": "uuid",
  "type": "residential",
  "phase": "schematic_design",
  "budget": 250000,
  "startDate": "2024-05-01T00:00:00Z",
  "dueDate": "2025-06-30T00:00:00Z"
}
```

### PATCH /projects/:id
Partial update of project fields.

### PATCH /projects/:id/phase
```json
{ "phase": "design_development" }
```

### DELETE /projects/:id
Role: principal only

---

## Pipeline

### GET /pipeline
Returns all opportunities ordered by updatedAt desc.

### POST /pipeline
```json
{
  "name": "Westmount Estate",
  "contactName": "Eleanor Fitzgerald",
  "contactEmail": "e@email.com",
  "estimatedValue": 680000,
  "probability": 75,
  "stage": "proposal_sent",
  "source": "referral"
}
```

### PATCH /pipeline/:id/stage
```json
{ "stage": "shortlisted" }
```

---

## Invoices

### GET /invoices
Query params: `status`
Returns invoices with project and client names.

### POST /invoices
Role: architect+
```json
{
  "projectId": "uuid",
  "clientId": "uuid",
  "lineItems": [
    { "description": "SD Phase", "quantity": 1, "unitPrice": 28000 }
  ],
  "tax": 13,
  "dueDate": "2024-05-30"
}
```
Invoice number is auto-generated: `INV-YYYY-NNN`

### PATCH /invoices/:id
```json
{ "status": "paid" }
```

---

## Team

### GET /team
Returns all users with project count.

### GET /team/:id/utilization
Query params: `month` (YYYY-MM)
Returns: `{ billableHours, totalHours, targetHours, utilization }`

---

## Calendar

### GET /calendar
Query params: `start` (ISO date), `end` (ISO date)
Returns events in range with attendees.

### POST /calendar
```json
{
  "title": "Mehta Design Review",
  "type": "meeting",
  "projectId": "uuid",
  "startTime": "10:30",
  "endTime": "12:00",
  "date": "2024-04-15",
  "location": "Studio — Boardroom",
  "attendeeIds": ["user_001", "user_002"]
}
```

---

## Marketing

### GET /marketing/leads
Query params: `channel`

### GET /marketing/analytics
Query params: `month` (YYYY-MM)
Returns: `{ totalLeads, byChannel: { instagram: N, ... }, month }`

---

## Time Entries

### GET /time-entries
Query params: `userId`, `projectId`, `start`, `end`

### POST /time-entries
```json
{
  "projectId": "uuid",
  "date": "2024-04-08",
  "hours": 6,
  "description": "DD package revisions",
  "billable": true
}
```

---

## Notifications

### GET /notifications
Returns 50 most recent for current user.

### PATCH /notifications/:id/read
Marks notification as read.

### PATCH /notifications/read-all
Marks all unread as read. Returns 204.

---

## Error Responses

All errors follow this shape:
```json
{
  "error": "Bad Request",
  "message": "Description of what went wrong"
}
```

HTTP status codes: 400 (bad request), 401 (unauthenticated), 403 (forbidden), 404 (not found), 409 (conflict), 500 (server error)

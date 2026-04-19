# ArchStudio — Data Models

## Users
Represents firm employees. Roles: `principal`, `senior_architect`, `architect`, `designer`, `intern`, `admin`. Has `hourlyRate` for billing calculations and links to time entries.

## Clients
People or organizations the firm works for. A client can have multiple projects and invoices. Includes contact info and billing city.

## Projects
Core business entity. Has a `phase` (AIA phases: pre_design → CA), `status` (active/on_hold/completed), `budget`, and tracked progress. Linked to a client, team members (through ProjectMember), invoices, time entries, and calendar events.

## ProjectMember
Junction table connecting Users to Projects with an optional role override. Allows the same person to be on multiple projects.

## PipelineOpportunity
Prospects/leads tracked through a sales funnel. Stages: `initial_contact → consultation → proposal_sent → shortlisted → won/lost`. Includes estimated value and probability for weighted pipeline calculations.

## Invoice
Financial document sent to clients for payment. Stages: `draft → sent → paid`; can be marked `overdue`. Contains line items, subtotal, HST, and total. Linked to project and client.

## InvoiceLineItem
Line item on an invoice with description, quantity, unit price, and computed amount.

## Estimate
Fee proposal created for a client or pipeline opportunity. Contains a per-phase hour breakdown. Fee structures: `percentage_of_construction`, `hourly_rate`, `fixed_fee`, `stipulated`.

## EstimateHourBreakdown
Row in an estimate showing hours, rate, and amount per AIA phase.

## TimeEntry
Logged work hours by a team member on a project. Can be `billable` or non-billable. Date-based (one entry = one day's work on one project). Used for utilization and budget burn calculations.

## CalendarEvent
Scheduled event: meeting, site visit, deadline, standup, or consultation. Linked to a project (optional) and attendees (users). Has date, start/end time, and location.

## MarketingLead
Inbound lead tracked by channel (Instagram, Website, Referral, Google Ads). Can be converted to a client or pipeline opportunity. Used for marketing analytics.

## Notification
In-app notification for a user. Types: info, warning, error, success. Has `readAt` timestamp for unread tracking.

## AuditLog
Immutable log of create/update/delete actions on any entity. Stores old and new values as JSON for change history.

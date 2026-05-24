# Audit Log Requirements

- Audit logs are immutable.
- Every funding state transition requires an audit log.
- Reviewer approve/reject actions require reviewer id, role, decision reason, risk flags, previous status, next status, and timestamp.
- Configuration changes require before/after snapshots and change reason.
- User-visible transaction history may show simplified events, but the admin audit log must retain full traceability.


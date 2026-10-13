# Process governance checks

Sources checked 13 October 2026. These are administrative checks on recorded evidence. They do not certify legal compliance, worker competence, safe work or ISO certification. The responsible business owner decides applicability and obtains the needed advice.

## NZ-GRWM: changed safety procedures

[WorkSafe's general risk and workplace management guidance, part 2](https://www.worksafe.govt.nz/managing-health-and-safety/businesses/general-requirements-for-workplaces/general-risk-and-workplace-management-part-2/) describes reviewing controls when they are ineffective and before relevant workplace changes introduce new or different risks. That includes changes in systems of work, processes or procedures. A pending revision to a NZ safety-sensitive process produces a finding to review the controls before use. Approval also requires a safety-review evidence reference for any safety-sensitive procedure. This field does not prove the review happened or that controls are effective. The software cannot detect an unrecorded workplace change.

## NZ-IPP9: retention review

[NZ Privacy Principle 9](https://www.privacy.org.nz/privacy-principles/9/) limits keeping personal information to the period it is needed for a lawful purpose. Records marked personal_data in NZ are flagged when the retention purpose or review date is missing, or the review date has arrived. That is an owner review date, not an automatic destruction deadline. No universal retention period is invented.

## AU-APP11: retention and security

[OAIC APP 11 guidance](https://www.oaic.gov.au/privacy/australian-privacy-principles/australian-privacy-principles-guidelines/chapter-11-app-11-security-of-personal-information) explains security duties and destruction or de-identification when information is no longer needed, subject to exceptions. Confirm APP-entity status, legal requirements and other exceptions. Australian personal-data records use the same missing-purpose or due-date prompt. The check does not assess security or decide whether destruction is lawful.

## Local policies

POLICY-OWNER checks ownership. POLICY-REVIEW flags missing or due review dates for active processes. POLICY-APPROVAL detects active records without an approved procedure. POLICY-SAFETY flags an approved safety procedure without a recorded control review. POLICY-IMPORT reminds the owner that imported register records need content mapping and approval. POLICY-RETENTION applies the retention reminder outside the NZ and AU classifications without claiming a legal rule. These are local policies, not vendor limitations or statutory time limits.

Self-approval is rejected by comparing supplied actor names, but these names are not authenticated identities. Approved content cannot be updated through the normal database trigger. Administrators can bypass controls, so this is not an immutable evidence vault. References to approvals and read receipts are not authenticated signatures or inspected documents. A legal hold blocks archiving until the responsible operator explicitly clears it with a reason. Retention findings include archived records. There is no delete command.

Shared operation requires identity verification, restricted database roles, secure evidence storage and tested backups. Row-level security blocks public access; the CLI expects a trusted database owner. The base does not provide user authentication or tenant isolation.

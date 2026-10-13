# Candidate decision and sources

Checked 13 October 2026. Chosen family: process-governance, absent from the rebuild registry before this run. Salesforce Revenue Cloud was already built tonight and was excluded, along with every registered family and the never-list.

## Bill evidence and limits

A current NZ or AU customer invoice is not verified. Searches of the local customer and CRM context found no Nintex or Promapp match. No live customer database was accessed. Buyer fit is an inference from the business function and documented NZ use, not a claim about an existing Enterprise DNA customer.

The [July 2025 UK public procurement pricing schedule](https://assets.applytosupply.digitalmarketplace.service.gov.uk/g-cloud-14/documents/707658/418594743301315-pricing-document-2025-07-28-0924.pdf) lists annual base fees of GBP10,800 for Essentials, GBP21,600 for Professional and GBP61,200 for Expert. That establishes a five-figure procurement benchmark. It is not current NZ pricing, a paid invoice or a promise about a smaller business. A US procurement list also surfaced, but its line-item term was not sufficiently clear to use as an annual bill. No conversion to NZD or AUD was made.

[Nintex's current pricing route](https://www.nintex.com/pricing/) redirects to contact sales. [Licensing help](https://help.nintex.com/en-us/promapp/Admin/Licensing/LicenseAndPackages.htm) describes four packages and feature/capacity limits. The landing page uses no dollar or pound figures because no current price was verified on the vendor's own pricing page.

## Scored shortlist

Scores are editorial judgments, not measured search volumes or customer invoices. Order: annual bill, data-shaped, buyer fit, search demand, one-session buildable, import path.

| Candidate | Scores | Total | Decision |
|---|---|---|---|
| Nintex Process Manager | 3, 5, 3, 3, 5, 4 | 23 | Strongest evidenced register-and-procedure scope, NZ presence and documented CSV endpoint |
| SAP Signavio Process Manager | 1, 4, 2, 3, 3, 4 | 17 | Current bill unverified; broader diagram scope and weaker local buyer evidence this run |
| iGrafx Process360 Live | 1, 3, 2, 2, 2, 3 | 13 | Current bill unverified; diagramming, simulation and mining dominate the product scope |

Low bill scores for the alternatives mean insufficient bill evidence in this run, not that the products are cheap. Process Street was also checked but its workflow execution scope overlaps the existing workflow-approvals family, and its current pricing is quoted. None of these alternatives was registered for the next build.

Sources for alternative scope: [SAP exports](https://help.sap.com/docs/signavio-process-manager/user-guide/export-intro), [SAP usage reports](https://help.sap.com/docs/signavio-process-manager/user-guide/workspace-and-process-model-usage-reports?locale=en-US&version=SHIP), [iGrafx Process Design](https://doc.igrafx.com/docs/getting-started/what-process-design-is), [Process Street pricing](https://www.process.st/pricing/).

## NZ evidence and target scope

Nintex publishes deployments at [Christchurch Airport](https://www.nintex.com/customer-stories/christchurch-international-airport-improves-documentation-and-standardizes-process-knowledge/) and [ACC New Zealand](https://www.nintex.com/customer-stories/acc-new-zealand-establishes-single-source-of-truth-with-process-manager/). These establish NZ use, not owner-led SME spend. Our smaller free base covers procedure records and owner review work, not the complete Nintex platform.

[Product page](https://www.nintex.com/platforms/cloud-automation/process-management/): process documentation, ownership, feedback, reporting and mobile access. We make no claim that Nintex cannot answer a particular question. The ten demonstrated questions combine records in our own model and show the scope of custom reporting.

[Reports help](https://help.nintex.com/en-US/promapp/Admin/Reports.htm) and [vendor endpoint guide](https://community.nintex.com/process-manager-59/endpoint-urls-to-generate-the-in-app-reports-62376) document the Process List CSV. Public documentation does not pin all column headings, so the importer accepts aliases and explicit mapping. All sample exports and operating records are fictional. The three page outputs come from real command runs on those demo records.

## Queue

No other queued build was found. The existing brewery target is building and is not part of this run. The third nightly target must select another unused family; do not queue another process-governance or configure-price-quote build as new work tonight.

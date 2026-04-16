-- Enquiry status is only NEW or READ in the app; normalize legacy values.
UPDATE "Enquiry" SET "status" = 'READ' WHERE "status" IN ('REPLIED', 'ARCHIVED');

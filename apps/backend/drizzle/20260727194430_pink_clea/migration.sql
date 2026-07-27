CREATE TABLE `AuditLog` (
	`id` text PRIMARY KEY,
	`entityType` text NOT NULL,
	`entityId` text NOT NULL,
	`action` text NOT NULL,
	`userId` text,
	`userName` text,
	`oldValues` text,
	`newValues` text,
	`ipAddress` text,
	`userAgent` text,
	`createdAt` integer NOT NULL,
	CONSTRAINT `fk_AuditLog_userId_User_id_fk` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE SET NULL
);
--> statement-breakpoint
CREATE INDEX `AuditLog_entityType_entityId_idx` ON `AuditLog` (`entityType`,`entityId`);--> statement-breakpoint
CREATE INDEX `AuditLog_userId_idx` ON `AuditLog` (`userId`);--> statement-breakpoint
CREATE INDEX `AuditLog_createdAt_idx` ON `AuditLog` (`createdAt`);--> statement-breakpoint
CREATE INDEX `AuditLog_action_idx` ON `AuditLog` (`action`);
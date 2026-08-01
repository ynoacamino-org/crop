CREATE TABLE `apikey` (
	`id` text PRIMARY KEY,
	`configId` text DEFAULT 'default' NOT NULL,
	`name` text,
	`start` text,
	`referenceId` text NOT NULL,
	`prefix` text,
	`key` text NOT NULL,
	`refillInterval` integer,
	`refillAmount` integer,
	`lastRefillAt` integer,
	`enabled` integer DEFAULT true NOT NULL,
	`rateLimitEnabled` integer,
	`rateLimitTimeWindow` integer,
	`rateLimitMax` integer,
	`requestCount` integer DEFAULT 0 NOT NULL,
	`remaining` integer,
	`lastRequest` integer,
	`expiresAt` integer,
	`createdAt` integer NOT NULL,
	`updatedAt` integer NOT NULL,
	`permissions` text,
	`metadata` text
);
--> statement-breakpoint
CREATE INDEX `apikey_configId_idx` ON `apikey` (`configId`);--> statement-breakpoint
CREATE INDEX `apikey_referenceId_idx` ON `apikey` (`referenceId`);--> statement-breakpoint
CREATE INDEX `apikey_key_idx` ON `apikey` (`key`);
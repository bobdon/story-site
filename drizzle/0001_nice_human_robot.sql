ALTER TABLE `reactions` ADD `type` text NOT NULL;--> statement-breakpoint
CREATE UNIQUE INDEX `reactions_storyId_fingerprint_type_unique` ON `reactions` (`storyId`,`fingerprint`,`type`);
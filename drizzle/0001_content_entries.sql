CREATE TABLE IF NOT EXISTS `content_entries` (
	`collection` text NOT NULL,
	`key` text NOT NULL,
	`data` text NOT NULL,
	`updated_at` integer NOT NULL,
	`updated_by` text NOT NULL,
	`deleted_at` integer,
	PRIMARY KEY(`collection`, `key`)
);

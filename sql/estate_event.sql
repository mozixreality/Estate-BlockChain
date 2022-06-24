DROP TABLE IF EXISTS `event_list`;
CREATE TABLE `event_list` (
    `event_id` int PRIMARY KEY NOT NULL AUTO_INCREMENT,
    `event_type` tinyint NOT NULL,
    `operation_id` int NOT NULL,
    `operation_type` tinyint NOT NULL,
    `event_data` longtext,
    `event_date` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- event_type 
-- 0: Create
-- 1: Delete
-- 2: Merge
-- 3: Splite

DROP TABLE IF EXISTS `operation_list`;
CREATE TABLE `operation_list` (
    `operation_id` int PRIMARY KEY NOT NULL AUTO_INCREMENT,
    `operation_type` tinyint NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- operation_type 
-- 0: Create
-- 1: Merge
-- 2: Splite
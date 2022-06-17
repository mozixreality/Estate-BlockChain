DROP TABLE IF EXISTS `event_list`;
CREATE TABLE `event_list` (
    `event_id` int PRIMARY KEY NOT NULL AUTO_INCREMENT,
    `event_type` ENUM('Create', 'Delete', 'Splite', 'Merge') NOT NULL,
    `entity_id` int NOT NULL,
    `entity_type` ENUM('Create', 'Splite', 'Merge') NOT NULL,
    `event_data` text
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

DROP TABLE IF EXISTS `entity_list`;
CREATE TABLE `entity_list` (
    `entity_id` int PRIMARY KEY NOT NULL AUTO_INCREMENT,
    `entity_type` ENUM('Create', 'Splite', 'Merge') NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
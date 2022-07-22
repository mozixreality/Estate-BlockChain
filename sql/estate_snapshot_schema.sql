DROP TABLE IF EXISTS `estate_snapshot`;
CREATE TABLE `estate_snapshot` (
    `id` int PRIMARY KEY NOT NULL AUTO_INCREMENT,
    `estate_datas` longtext,
    `date` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8;
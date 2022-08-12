-- phpMyAdmin SQL Dump
-- version 4.9.5deb2
-- https://www.phpmyadmin.net/
--
-- 主機： localhost:3306
-- 產生時間： 2022 年 08 月 12 日 11:14
-- 伺服器版本： 8.0.30-0ubuntu0.20.04.2
-- PHP 版本： 7.4.3

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET AUTOCOMMIT = 0;
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- 資料庫： `estate_blockchain`
--

-- --------------------------------------------------------

--
-- 資料表結構 `olddatatable`
--
DROP TABLE IF EXISTS `olddatatable`;
CREATE TABLE `olddatatable` (
  `EstateId` varchar(20) DEFAULT NULL,
  `BeginDate` date DEFAULT NULL,
  `EndDate` date DEFAULT NULL,
  `PCNO` int DEFAULT NULL,
  `PMNO` int DEFAULT NULL,
  `SCNO` int DEFAULT NULL,
  `County` text,
  `Township` int DEFAULT NULL,
  `Reason` text,
  `ChangeTag` text,
  `EstateData` text
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- 傾印資料表的資料 `olddatatable`
--

INSERT INTO `olddatatable` (`EstateId`, `BeginDate`, `EndDate`, `PCNO`, `PMNO`, `SCNO`, `County`, `Township`, `Reason`, `ChangeTag`, `EstateData`) VALUES
('00000000000020000101', '2000-01-01', '2020-02-02', 0, 0, 0, '0000', 0, '0', '0', '{\"id\":\"00000000000020000101\",\"data\":{\"pmno\":\"0000\",\"pcno\":\"0000\",\"scno\":\"0000\",\"county\":\"0000\",\"townShip\":\"0\",\"reason\":\"0\",\"begDate\":\"20000101\",\"endDate\":\"20000101\",\"parents\":[],\"children\":[],\"changedTag\":\"0\"},\"polygon\":{\"points\":[[\"997.7540000000154\",\"-741.9500000001863\"],[\"1034.3570000000182\",\"-774.5600000000559\"],[\"1054.9870000000228\",\"-758.5879999999888\"],[\"1022.3780000000261\",\"-727.9750000000931\"],[\"n\",\"n\"],[\"n\",\"n\"],[\"n\",\"n\"],[\"n\",\"n\"],[\"n\",\"n\"],[\"n\",\"n\"],[\"n\",\"n\"],[\"n\",\"n\"],[\"n\",\"n\"],[\"n\",\"n\"],[\"n\",\"n\"],[\"n\",\"n\"],[\"n\",\"n\"],[\"n\",\"n\"],[\"n\",\"n\"],[\"n\",\"n\"],[\"n\",\"n\"],[\"n\",\"n\"],[\"n\",\"n\"],[\"n\",\"n\"],[\"n\",\"n\"],[\"n\",\"n\"],[\"n\",\"n\"],[\"n\",\"n\"],[\"n\",\"n\"],[\"n\",\"n\"],[\"n\",\"n\"],[\"n\",\"n\"],[\"n\",\"n\"],[\"n\",\"n\"],[\"n\",\"n\"],[\"n\",\"n\"],[\"n\",\"n\"],[\"n\",\"n\"],[\"n\",\"n\"],[\"n\",\"n\"],[\"n\",\"n\"],[\"n\",\"n\"],[\"n\",\"n\"],[\"n\",\"n\"],[\"n\",\"n\"],[\"n\",\"n\"],[\"n\",\"n\"],[\"n\",\"n\"],[\"n\",\"n\"],[\"n\",\"n\"],[\"n\",\"n\"],[\"n\",\"n\"],[\"n\",\"n\"],[\"n\",\"n\"],[\"n\",\"n\"],[\"n\",\"n\"],[\"n\",\"n\"],[\"n\",\"n\"],[\"n\",\"n\"],[\"n\",\"n\"],[\"n\",\"n\"],[\"n\",\"n\"],[\"n\",\"n\"],[\"n\",\"n\"],[\"n\",\"n\"],[\"n\",\"n\"],[\"n\",\"n\"],[\"n\",\"n\"],[\"n\",\"n\"],[\"n\",\"n\"],[\"n\",\"n\"],[\"n\",\"n\"],[\"n\",\"n\"],[\"n\",\"n\"],[\"n\",\"n\"],[\"n\",\"n\"],[\"n\",\"n\"],[\"n\",\"n\"],[\"n\",\"n\"],[\"n\",\"n\"],[\"n\",\"n\"],[\"n\",\"n\"],[\"n\",\"n\"],[\"n\",\"n\"],[\"n\",\"n\"],[\"n\",\"n\"],[\"n\",\"n\"],[\"n\",\"n\"],[\"n\",\"n\"],[\"n\",\"n\"],[\"n\",\"n\"],[\"n\",\"n\"],[\"n\",\"n\"],[\"n\",\"n\"],[\"n\",\"n\"],[\"n\",\"n\"],[\"n\",\"n\"],[\"n\",\"n\"],[\"n\",\"n\"],[\"n\",\"n\"]],\"length\":\"4\"}}'),
('11111111111120000303', '2000-03-03', '2020-02-02', 1111, 1111, 1111, '1111', 11, '0', '0', '{\"id\":\"11111111111120000303\",\"data\":{\"pmno\":\"1111\",\"pcno\":\"1111\",\"scno\":\"1111\",\"county\":\"1111\",\"townShip\":\"11\",\"reason\":\"0\",\"begDate\":\"20000303\",\"endDate\":\"20000303\",\"parents\":[],\"children\":[],\"changedTag\":\"0\"},\"polygon\":{\"points\":[[\"1153.9920000000275\",\"-500.90400000009686\"],[\"1139.978999999992\",\"-609.50400000019\"],[\"1177.3470000000088\",\"-620.0139999999665\"],[\"1190.191999999981\",\"-513.7489999998361\"],[\"n\",\"n\"],[\"n\",\"n\"],[\"n\",\"n\"],[\"n\",\"n\"],[\"n\",\"n\"],[\"n\",\"n\"],[\"n\",\"n\"],[\"n\",\"n\"],[\"n\",\"n\"],[\"n\",\"n\"],[\"n\",\"n\"],[\"n\",\"n\"],[\"n\",\"n\"],[\"n\",\"n\"],[\"n\",\"n\"],[\"n\",\"n\"],[\"n\",\"n\"],[\"n\",\"n\"],[\"n\",\"n\"],[\"n\",\"n\"],[\"n\",\"n\"],[\"n\",\"n\"],[\"n\",\"n\"],[\"n\",\"n\"],[\"n\",\"n\"],[\"n\",\"n\"],[\"n\",\"n\"],[\"n\",\"n\"],[\"n\",\"n\"],[\"n\",\"n\"],[\"n\",\"n\"],[\"n\",\"n\"],[\"n\",\"n\"],[\"n\",\"n\"],[\"n\",\"n\"],[\"n\",\"n\"],[\"n\",\"n\"],[\"n\",\"n\"],[\"n\",\"n\"],[\"n\",\"n\"],[\"n\",\"n\"],[\"n\",\"n\"],[\"n\",\"n\"],[\"n\",\"n\"],[\"n\",\"n\"],[\"n\",\"n\"],[\"n\",\"n\"],[\"n\",\"n\"],[\"n\",\"n\"],[\"n\",\"n\"],[\"n\",\"n\"],[\"n\",\"n\"],[\"n\",\"n\"],[\"n\",\"n\"],[\"n\",\"n\"],[\"n\",\"n\"],[\"n\",\"n\"],[\"n\",\"n\"],[\"n\",\"n\"],[\"n\",\"n\"],[\"n\",\"n\"],[\"n\",\"n\"],[\"n\",\"n\"],[\"n\",\"n\"],[\"n\",\"n\"],[\"n\",\"n\"],[\"n\",\"n\"],[\"n\",\"n\"],[\"n\",\"n\"],[\"n\",\"n\"],[\"n\",\"n\"],[\"n\",\"n\"],[\"n\",\"n\"],[\"n\",\"n\"],[\"n\",\"n\"],[\"n\",\"n\"],[\"n\",\"n\"],[\"n\",\"n\"],[\"n\",\"n\"],[\"n\",\"n\"],[\"n\",\"n\"],[\"n\",\"n\"],[\"n\",\"n\"],[\"n\",\"n\"],[\"n\",\"n\"],[\"n\",\"n\"],[\"n\",\"n\"],[\"n\",\"n\"],[\"n\",\"n\"],[\"n\",\"n\"],[\"n\",\"n\"],[\"n\",\"n\"],[\"n\",\"n\"],[\"n\",\"n\"],[\"n\",\"n\"],[\"n\",\"n\"]],\"length\":\"4\"}}');
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;

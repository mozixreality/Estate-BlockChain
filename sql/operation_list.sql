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
-- 資料表結構 `operation_list`
--
DROP TABLE IF EXISTS `operation_list`;
CREATE TABLE `operation_list` (
  `operation_id` int NOT NULL,
  `operation_type` tinyint NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;

--
-- 傾印資料表的資料 `operation_list`
--

INSERT INTO `operation_list` (`operation_id`, `operation_type`) VALUES
(1, 0),
(2, 0),
(3, 2),
(4, 1),
(5, 0),
(6, 0);

--
-- 已傾印資料表的索引
--

--
-- 資料表索引 `operation_list`
--
ALTER TABLE `operation_list`
  ADD PRIMARY KEY (`operation_id`);

--
-- 在傾印的資料表使用自動遞增(AUTO_INCREMENT)
--

--
-- 使用資料表自動遞增(AUTO_INCREMENT) `operation_list`
--
ALTER TABLE `operation_list`
  MODIFY `operation_id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;

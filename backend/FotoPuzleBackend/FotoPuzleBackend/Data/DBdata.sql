-- MySQL dump 10.13  Distrib 8.0.45, for Win64 (x86_64)
--
-- Host: localhost    Database: foto-puzle
-- ------------------------------------------------------
-- Server version	9.6.0

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;
SET @MYSQLDUMP_TEMP_LOG_BIN = @@SESSION.SQL_LOG_BIN;
SET @@SESSION.SQL_LOG_BIN= 0;

--
-- GTID state at the beginning of the backup 
--

SET @@GLOBAL.GTID_PURGED=/*!80000 '+'*/ 'eb8b4e27-1fdd-11f1-90ce-4ccc6a8edafd:1-34';

--
-- Table structure for table `__efmigrationshistory`
--

DROP TABLE IF EXISTS `__efmigrationshistory`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `__efmigrationshistory` (
  `MigrationId` varchar(150) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `ProductVersion` varchar(32) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  PRIMARY KEY (`MigrationId`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `__efmigrationshistory`
--

LOCK TABLES `__efmigrationshistory` WRITE;
/*!40000 ALTER TABLE `__efmigrationshistory` DISABLE KEYS */;
INSERT INTO `__efmigrationshistory` VALUES ('20260311214716_InitialCreate','9.0.6'),('20260322182317_AddCompletionTokens','9.0.6');
/*!40000 ALTER TABLE `__efmigrationshistory` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `completiontokens`
--

DROP TABLE IF EXISTS `completiontokens`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `completiontokens` (
  `Id` int NOT NULL AUTO_INCREMENT,
  `UserId` int NOT NULL,
  `PuzzleId` int NOT NULL,
  `Token` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `EarnedAt` datetime(6) NOT NULL,
  PRIMARY KEY (`Id`),
  UNIQUE KEY `IX_CompletionTokens_PuzzleId` (`PuzzleId`),
  UNIQUE KEY `IX_CompletionTokens_Token` (`Token`),
  KEY `IX_CompletionTokens_UserId` (`UserId`),
  CONSTRAINT `FK_CompletionTokens_Puzzles_PuzzleId` FOREIGN KEY (`PuzzleId`) REFERENCES `puzzles` (`Id`) ON DELETE CASCADE,
  CONSTRAINT `FK_CompletionTokens_Users_UserId` FOREIGN KEY (`UserId`) REFERENCES `users` (`Id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `completiontokens`
--

LOCK TABLES `completiontokens` WRITE;
/*!40000 ALTER TABLE `completiontokens` DISABLE KEYS */;
/*!40000 ALTER TABLE `completiontokens` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `photos`
--

DROP TABLE IF EXISTS `photos`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `photos` (
  `Id` int NOT NULL AUTO_INCREMENT,
  `UserId` int NOT NULL,
  `OriginalFilename` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `StoredFilename` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `FilePath` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `FileSizeBytes` bigint DEFAULT NULL,
  `MimeType` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `Status` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `UploadedAt` datetime(6) DEFAULT NULL,
  `CreatedAt` datetime(6) NOT NULL,
  `UpdatedAt` datetime(6) DEFAULT NULL,
  PRIMARY KEY (`Id`),
  KEY `IX_Photos_UserId` (`UserId`),
  CONSTRAINT `FK_Photos_Users_UserId` FOREIGN KEY (`UserId`) REFERENCES `users` (`Id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `photos`
--

LOCK TABLES `photos` WRITE;
/*!40000 ALTER TABLE `photos` DISABLE KEYS */;
INSERT INTO `photos` VALUES (1,1,'sunset.jpg','sunset_1.jpg','/uploads/sunset_1.jpg',120000,'image/jpeg','1','2026-03-23 18:33:12.000000','2026-03-23 18:33:12.000000','2026-03-23 18:33:12.000000'),(2,2,'mountain.jpg','mountain_1.jpg','/uploads/mountain_1.jpg',150000,'image/jpeg','1','2026-03-23 18:33:12.000000','2026-03-23 18:33:12.000000','2026-03-23 18:33:12.000000'),(3,3,'ocean.jpg','ocean_1.jpg','/uploads/ocean_1.jpg',98000,'image/jpeg','1','2026-03-23 18:33:12.000000','2026-03-23 18:33:12.000000','2026-03-23 18:33:12.000000'),(4,4,'forest.jpg','forest_1.jpg','/uploads/forest_1.jpg',110000,'image/jpeg','1','2026-03-23 18:33:12.000000','2026-03-23 18:33:12.000000','2026-03-23 18:33:12.000000'),(5,5,'city.jpg','city_1.jpg','/uploads/city_1.jpg',130000,'image/jpeg','1','2026-03-23 18:33:12.000000','2026-03-23 18:33:12.000000','2026-03-23 18:33:12.000000');
/*!40000 ALTER TABLE `photos` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `puzzles`
--

DROP TABLE IF EXISTS `puzzles`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `puzzles` (
  `Id` int NOT NULL AUTO_INCREMENT,
  `PhotoId` int NOT NULL,
  `UserId` int NOT NULL,
  `Difficulty` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `PieceCount` int NOT NULL,
  `Status` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `CreatedAt` datetime(6) NOT NULL,
  `UpdatedAt` datetime(6) DEFAULT NULL,
  PRIMARY KEY (`Id`),
  UNIQUE KEY `IX_Puzzles_PhotoId_Difficulty` (`PhotoId`,`Difficulty`),
  KEY `IX_Puzzles_UserId` (`UserId`),
  CONSTRAINT `FK_Puzzles_Photos_PhotoId` FOREIGN KEY (`PhotoId`) REFERENCES `photos` (`Id`) ON DELETE CASCADE,
  CONSTRAINT `FK_Puzzles_Users_UserId` FOREIGN KEY (`UserId`) REFERENCES `users` (`Id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `puzzles`
--

LOCK TABLES `puzzles` WRITE;
/*!40000 ALTER TABLE `puzzles` DISABLE KEYS */;
INSERT INTO `puzzles` VALUES (1,1,1,'1',50,'1','2026-03-23 18:33:12.000000','2026-03-23 18:33:12.000000'),(2,2,2,'2',100,'1','2026-03-23 18:33:12.000000','2026-03-23 18:33:12.000000'),(3,3,3,'3',200,'1','2026-03-23 18:33:12.000000','2026-03-23 18:33:12.000000'),(4,4,4,'2',150,'1','2026-03-23 18:33:12.000000','2026-03-23 18:33:12.000000'),(5,5,5,'1',25,'1','2026-03-23 18:33:12.000000','2026-03-23 18:33:12.000000');
/*!40000 ALTER TABLE `puzzles` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `Id` int NOT NULL AUTO_INCREMENT,
  `Email` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `Username` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `PasswordHash` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci NOT NULL,
  `CreatedAt` datetime(6) NOT NULL,
  `UpdatedAt` datetime(6) DEFAULT NULL,
  PRIMARY KEY (`Id`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (1,'rapolas@mail.com','rapvis','testpassword','2026-03-23 18:33:12.000000','2026-03-23 18:33:12.000000'),(2,'john@mail.com','john123','pass123','2026-03-23 18:33:12.000000','2026-03-23 18:33:12.000000'),(3,'emma@mail.com','emma_dev','devpass456','2026-03-23 18:33:12.000000','2026-03-23 18:33:12.000000'),(4,'liam@mail.com','liamx','liam789','2026-03-23 18:33:12.000000','2026-03-23 18:33:12.000000'),(5,'sofia@mail.com','sofia99','sofiaSecure','2026-03-23 18:33:12.000000','2026-03-23 18:33:12.000000'),(6,'alex@mail.com','alexpro','alexPass321','2026-03-23 18:33:12.000000','2026-03-23 18:33:12.000000');
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;
SET @@SESSION.SQL_LOG_BIN = @MYSQLDUMP_TEMP_LOG_BIN;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-03-23 18:45:15

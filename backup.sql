-- MariaDB dump 10.19  Distrib 10.4.32-MariaDB, for Win64 (AMD64)
--
-- Host: localhost    Database: inventory_management_db
-- ------------------------------------------------------
-- Server version	10.4.32-MariaDB

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `audit_logs`
--

DROP TABLE IF EXISTS `audit_logs`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `audit_logs` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `action` varchar(255) NOT NULL,
  `details` varchar(2000) DEFAULT NULL,
  `entity_id` bigint(20) DEFAULT NULL,
  `entity_name` varchar(255) NOT NULL,
  `timestamp` datetime(6) NOT NULL,
  `username` varchar(255) NOT NULL,
  `ip_address` varchar(45) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=29 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `audit_logs`
--

LOCK TABLES `audit_logs` WRITE;
/*!40000 ALTER TABLE `audit_logs` DISABLE KEYS */;
INSERT INTO `audit_logs` VALUES (1,'CREATE','Created product: beans',1,'Product','2026-04-01 10:08:49.000000','admin',''),(2,'CREATE','Created product: maize',2,'Product','2026-04-01 11:24:00.000000','admin',''),(3,'CREATE','Created sales order: SO-1775046370727',1,'SalesOrder','2026-04-01 12:26:11.000000','admin',''),(4,'CREATE','Created purchase order: PO-1775055094273',1,'PurchaseOrder','2026-04-01 14:51:34.000000','admin',''),(5,'CREATE','Created product: food',3,'Product','2026-04-03 11:12:57.000000','admin',''),(6,'CREATE','Created product: door',4,'Product','2026-04-14 10:51:31.000000','admin',''),(7,'CREATE','Created sales order: SO-1776167035852',2,'SalesOrder','2026-04-14 11:43:55.000000','admin',''),(8,'CREATE','Created purchase order: PO-1776167054041',2,'PurchaseOrder','2026-04-14 11:44:14.000000','admin',''),(9,'CREATE','Created sales order: SO-1776167098071',3,'SalesOrder','2026-04-14 11:44:58.000000','admin',''),(10,'CREATE','Created purchase order: PO-1776167118088',3,'PurchaseOrder','2026-04-14 11:45:18.000000','admin',''),(11,'CREATE','Created purchase order: PO-1776167288586',4,'PurchaseOrder','2026-04-14 11:48:08.000000','admin',''),(12,'CREATE','Created purchase order: PO-1776167734459',5,'PurchaseOrder','2026-04-14 11:55:34.000000','admin',''),(13,'CREATE','Created purchase order: PO-1776167773375',6,'PurchaseOrder','2026-04-14 11:56:13.000000','admin',''),(14,'CREATE','Created sales order: SO-1776167786292',4,'SalesOrder','2026-04-14 11:56:26.000000','admin',''),(15,'CREATE','Created purchase order: PO-1776167871939',7,'PurchaseOrder','2026-04-14 11:57:52.000000','admin',''),(16,'CREATE','Created sales order: SO-1776167886792',5,'SalesOrder','2026-04-14 11:58:06.000000','admin',''),(17,'CREATE','Created product: gates',5,'Product','2026-04-14 12:07:19.000000','admin',''),(18,'CREATE','Created sales order: SO-1776168489513',6,'SalesOrder','2026-04-14 12:08:09.000000','admin',''),(19,'CREATE','Created purchase order: PO-1776168518110',8,'PurchaseOrder','2026-04-14 12:08:38.000000','admin',''),(20,'CREATE','Created product: age',6,'Product','2026-04-14 12:14:27.000000','finance',''),(21,'CREATE','Created sales order: SO-1776168901114',7,'SalesOrder','2026-04-14 12:15:01.000000','finance',''),(22,'CREATE','Created sales order: SO-1776168949028',8,'SalesOrder','2026-04-14 12:15:49.000000','finance',''),(23,'CREATE','Created sales order: SO-1776168983817',9,'SalesOrder','2026-04-14 12:16:23.000000','finance',''),(24,'CREATE','Created sales order: SO-1776233051425',10,'SalesOrder','2026-04-15 06:04:11.000000','admin',''),(25,'CREATE','Created sales order: SO-1776935174548',11,'SalesOrder','2026-04-23 09:06:14.000000','admin','0:0:0:0:0:0:0:1'),(26,'CREATE','Created product: heart',7,'Product','2026-04-23 09:55:42.000000','admin','0:0:0:0:0:0:0:1'),(27,'CREATE','Created purchase order: PO-1776938263417',9,'PurchaseOrder','2026-04-23 09:57:43.000000','admin','0:0:0:0:0:0:0:1'),(28,'CREATE','Created sales order: SO-1776938287259',12,'SalesOrder','2026-04-23 09:58:07.000000','admin','0:0:0:0:0:0:0:1');
/*!40000 ALTER TABLE `audit_logs` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `customers`
--

DROP TABLE IF EXISTS `customers`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `customers` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `email` varchar(255) DEFAULT NULL,
  `phone` varchar(255) DEFAULT NULL,
  `address` varchar(255) DEFAULT NULL,
  `balance` decimal(38,2) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `total_received` decimal(38,2) DEFAULT NULL,
  `total_sales` decimal(38,2) DEFAULT NULL,
  `version` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `customers`
--

LOCK TABLES `customers` WRITE;
/*!40000 ALTER TABLE `customers` DISABLE KEYS */;
INSERT INTO `customers` VALUES (1,'jose narame','amina@gmail.com','+250798720679','k8-316',130900.00,'2026-04-01 10:10:26',0.00,130900.00,3),(2,'a n yannick','yannick@gmail.com','0798888888','kigali',11000.15,'2026-04-03 11:14:57',0.00,11000.15,2),(3,'jose narame','amina@gmail.com','+250798720679','kigali',11000.00,'2026-04-14 12:09:55',0.00,11000.00,1),(4,'jose narame','amina@gmail.com','+250798720679','Rwanda - Eastern Province - Rwamagana - Nzige - Kigarama , Nyarutovu',14300.00,'2026-04-14 14:44:40',0.00,14300.00,1);
/*!40000 ALTER TABLE `customers` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `products`
--

DROP TABLE IF EXISTS `products`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `products` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `sku` varchar(255) NOT NULL,
  `name` varchar(255) NOT NULL,
  `description` varchar(255) DEFAULT NULL,
  `purchase_price` decimal(38,2) NOT NULL,
  `selling_price` decimal(38,2) NOT NULL,
  `current_stock` int(11) DEFAULT 0,
  `reorder_level` int(11) DEFAULT 10,
  `unit` varchar(255) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `version` int(11) DEFAULT NULL,
  `category` varchar(255) DEFAULT NULL,
  `item_type` varchar(255) DEFAULT NULL,
  `qty_manufactured` int(11) DEFAULT NULL,
  `qty_purchased` int(11) DEFAULT NULL,
  `qty_sold` int(11) DEFAULT NULL,
  `qty_used` int(11) DEFAULT NULL,
  `subcategory` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `sku` (`sku`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `products`
--

LOCK TABLES `products` WRITE;
/*!40000 ALTER TABLE `products` DISABLE KEYS */;
INSERT INTO `products` VALUES (1,'wdu-90-kl','beans','for sale',12000.00,80000.00,6,4,'pcs','2026-04-01 10:08:49',2,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(2,'wdg-pu-03','maize','for sale',10000.00,100000.00,4,5,'pcs','2026-04-01 11:24:00',0,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(3,'wbs-98','food','for sale',12000.00,120000.00,8,5,'pcs','2026-04-03 11:12:57',0,NULL,NULL,NULL,NULL,NULL,NULL,NULL),(4,'ww-20','door','hh',120000.00,150000.00,0,10,'pcs','2026-04-14 10:51:31',12,'Furniture','Solid',30,16,15,10,'Metals'),(5,'sss-20','gates','originality',12000.00,13000.00,0,10,'pcs','2026-04-14 12:07:19',4,'Furniture','Solid',20,11,14,10,'Metals'),(6,'wdg-0001','age','beneficial',1200.00,10000.00,0,2,'pcs','2026-04-14 12:14:27',2,'Supplies','Solid',20,5,8,10,'Desktops'),(7,'srl-dtg-o9','heart','it is good',0.17,0.14,0,9,'pcs','2026-04-23 09:55:42',2,'electronic','solid',5,6,4,3,'mobile');
/*!40000 ALTER TABLE `products` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `purchase_items`
--

DROP TABLE IF EXISTS `purchase_items`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `purchase_items` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `purchase_order_id` bigint(20) DEFAULT NULL,
  `product_id` bigint(20) DEFAULT NULL,
  `quantity` int(11) NOT NULL,
  `unit_price` decimal(38,2) NOT NULL,
  `total_price` decimal(38,2) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `purchase_order_id` (`purchase_order_id`),
  KEY `product_id` (`product_id`),
  CONSTRAINT `purchase_items_ibfk_1` FOREIGN KEY (`purchase_order_id`) REFERENCES `purchase_orders` (`id`),
  CONSTRAINT `purchase_items_ibfk_2` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `purchase_items`
--

LOCK TABLES `purchase_items` WRITE;
/*!40000 ALTER TABLE `purchase_items` DISABLE KEYS */;
INSERT INTO `purchase_items` VALUES (1,1,1,1,12000.00,12000.00),(2,2,4,1,120000.00,120000.00),(3,3,4,1,120000.00,120000.00),(4,4,4,1,120000.00,120000.00),(5,5,4,1,120000.00,120000.00),(6,6,4,1,120000.00,120000.00),(7,7,4,1,120000.00,120000.00),(8,8,5,1,12000.00,12000.00),(9,9,7,1,0.17,0.17);
/*!40000 ALTER TABLE `purchase_items` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `purchase_orders`
--

DROP TABLE IF EXISTS `purchase_orders`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `purchase_orders` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `supplier_id` bigint(20) DEFAULT NULL,
  `order_date` datetime NOT NULL,
  `total_amount` decimal(38,2) DEFAULT NULL,
  `status` varchar(255) DEFAULT NULL,
  `grand_total` decimal(38,2) DEFAULT NULL,
  `order_number` varchar(255) NOT NULL,
  `tax_amount` decimal(38,2) DEFAULT NULL,
  `version` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `UKnqsdqb8p2iobsmeaa2jxxw7k` (`order_number`),
  KEY `supplier_id` (`supplier_id`),
  CONSTRAINT `purchase_orders_ibfk_1` FOREIGN KEY (`supplier_id`) REFERENCES `suppliers` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `purchase_orders`
--

LOCK TABLES `purchase_orders` WRITE;
/*!40000 ALTER TABLE `purchase_orders` DISABLE KEYS */;
INSERT INTO `purchase_orders` VALUES (1,1,'2026-04-01 14:51:34',12000.00,'RECEIVED',13200.00,'PO-1775055094273',1200.00,0),(2,2,'2026-04-14 11:44:14',120000.00,'RECEIVED',132000.00,'PO-1776167054041',12000.00,0),(3,2,'2026-04-14 11:45:18',120000.00,'RECEIVED',132000.00,'PO-1776167118088',12000.00,0),(4,1,'2026-04-14 11:48:08',120000.00,'RECEIVED',132000.00,'PO-1776167288586',12000.00,0),(5,1,'2026-04-14 11:55:34',120000.00,'RECEIVED',132000.00,'PO-1776167734459',12000.00,0),(6,2,'2026-04-14 11:56:13',120000.00,'RECEIVED',132000.00,'PO-1776167773375',12000.00,0),(7,2,'2026-04-14 11:57:52',120000.00,'RECEIVED',132000.00,'PO-1776167871939',12000.00,0),(8,1,'2026-04-14 12:08:38',12000.00,'RECEIVED',13200.00,'PO-1776168518110',1200.00,0),(9,1,'2026-04-23 09:57:43',0.17,'RECEIVED',0.19,'PO-1776938263417',0.02,0);
/*!40000 ALTER TABLE `purchase_orders` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `sales_items`
--

DROP TABLE IF EXISTS `sales_items`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `sales_items` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `sales_order_id` bigint(20) DEFAULT NULL,
  `product_id` bigint(20) DEFAULT NULL,
  `quantity` int(11) NOT NULL,
  `unit_price` decimal(38,2) NOT NULL,
  `total_price` decimal(38,2) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `sales_order_id` (`sales_order_id`),
  KEY `product_id` (`product_id`),
  CONSTRAINT `sales_items_ibfk_1` FOREIGN KEY (`sales_order_id`) REFERENCES `sales_orders` (`id`),
  CONSTRAINT `sales_items_ibfk_2` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `sales_items`
--

LOCK TABLES `sales_items` WRITE;
/*!40000 ALTER TABLE `sales_items` DISABLE KEYS */;
INSERT INTO `sales_items` VALUES (1,1,1,1,80000.00,80000.00),(2,2,4,1,150000.00,150000.00),(3,3,4,1,150000.00,150000.00),(4,4,4,1,150000.00,150000.00),(5,5,4,1,150000.00,150000.00),(6,6,5,1,13000.00,13000.00),(7,7,6,1,10000.00,10000.00),(8,8,6,1,10000.00,10000.00),(9,9,5,2,13000.00,26000.00),(10,10,4,1,150000.00,150000.00),(11,11,5,1,13000.00,13000.00),(12,12,7,1,0.14,0.14);
/*!40000 ALTER TABLE `sales_items` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `sales_orders`
--

DROP TABLE IF EXISTS `sales_orders`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `sales_orders` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `customer_id` bigint(20) DEFAULT NULL,
  `order_date` datetime NOT NULL,
  `total_amount` decimal(38,2) DEFAULT NULL,
  `status` varchar(255) DEFAULT NULL,
  `grand_total` decimal(38,2) DEFAULT NULL,
  `order_number` varchar(255) NOT NULL,
  `tax_amount` decimal(38,2) DEFAULT NULL,
  `version` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `UK710tqn7k0rkp3ubriqlh0woyp` (`order_number`),
  KEY `customer_id` (`customer_id`),
  CONSTRAINT `sales_orders_ibfk_1` FOREIGN KEY (`customer_id`) REFERENCES `customers` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `sales_orders`
--

LOCK TABLES `sales_orders` WRITE;
/*!40000 ALTER TABLE `sales_orders` DISABLE KEYS */;
INSERT INTO `sales_orders` VALUES (1,1,'2026-04-01 12:26:11',80000.00,'COMPLETED',88000.00,'SO-1775046370727',8000.00,0),(2,2,'2026-04-14 11:43:55',150000.00,'COMPLETED',165000.00,'SO-1776167035852',15000.00,1),(3,2,'2026-04-14 11:44:58',150000.00,'COMPLETED',165000.00,'SO-1776167098071',15000.00,1),(4,1,'2026-04-14 11:56:26',150000.00,'COMPLETED',165000.00,'SO-1776167786292',15000.00,1),(5,1,'2026-04-14 11:58:06',150000.00,'COMPLETED',165000.00,'SO-1776167886792',15000.00,1),(6,1,'2026-04-14 12:08:09',13000.00,'COMPLETED',14300.00,'SO-1776168489513',1300.00,0),(7,2,'2026-04-14 12:15:01',10000.00,'COMPLETED',11000.00,'SO-1776168901114',1000.00,0),(8,3,'2026-04-14 12:15:49',10000.00,'COMPLETED',11000.00,'SO-1776168949028',1000.00,0),(9,1,'2026-04-14 12:16:23',26000.00,'COMPLETED',28600.00,'SO-1776168983817',2600.00,0),(10,1,'2026-04-15 06:04:11',150000.00,'COMPLETED',165000.00,'SO-1776233051425',15000.00,1),(11,4,'2026-04-23 09:06:14',13000.00,'COMPLETED',14300.00,'SO-1776935174548',1300.00,0),(12,2,'2026-04-23 09:58:07',0.14,'COMPLETED',0.15,'SO-1776938287259',0.01,0);
/*!40000 ALTER TABLE `sales_orders` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `suppliers`
--

DROP TABLE IF EXISTS `suppliers`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `suppliers` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `contact_person` varchar(255) DEFAULT NULL,
  `email` varchar(255) DEFAULT NULL,
  `phone` varchar(255) DEFAULT NULL,
  `address` varchar(255) DEFAULT NULL,
  `balance` decimal(38,2) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `total_paid` decimal(38,2) DEFAULT NULL,
  `total_purchases` decimal(38,2) DEFAULT NULL,
  `version` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `suppliers`
--

LOCK TABLES `suppliers` WRITE;
/*!40000 ALTER TABLE `suppliers` DISABLE KEYS */;
INSERT INTO `suppliers` VALUES (1,'abc coorp','jose narame','amina@gmail.com','+250798720679','k8-360',290400.19,'2026-04-01 10:09:43',0.00,290400.19,5),(2,'dcb coop','yannick','yannick@gmail.com','078888888','kigali',528000.00,'2026-04-03 11:14:02',0.00,528000.00,4);
/*!40000 ALTER TABLE `suppliers` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `users` (
  `id` bigint(20) NOT NULL AUTO_INCREMENT,
  `username` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `role` varchar(50) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `email` varchar(255) NOT NULL,
  `full_name` varchar(255) DEFAULT NULL,
  `profile_picture_url` varchar(255) DEFAULT NULL,
  `enabled` bit(1) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `username` (`username`),
  UNIQUE KEY `UK6dotkott2kjsp8vw4d0m25fb7` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (1,'admin','$2a$10$0ztz4BylxX84G2MbPGcT/.2sbUGZ87QkqT5ZVCXC0lPox14Vrgi1e','SUPER_ADMIN','2026-03-27 11:23:12','vizionbot@gmail.com','Vizion Bot Administrator',NULL,''),(2,'vaz','$2a$10$.UZrEP01GM0rkfqhdyQLduGyvqKRpj8.fXg7wkTRKV1YkzzDJPCsy','OPERATIONS_STAFF','2026-03-27 11:41:04','vaz@gmail.com','vaz',NULL,'\0'),(3,'ange','$2a$10$Tg.dafP4Fr.62RA7MXgoDuOlp.sr8ofTv0H07XHzg.KrsChuKRPBq','FINANCE_ACCOUNTANT','2026-03-27 14:30:29','ange@gmail.com','ange','/uploads/profiles/3264dad6-bb6b-4087-9dff-ce7b5a8f0d50_vlcsnap-2025-12-28-17h50m39s177.png','\0'),(4,'finance','$2a$10$SQsYa/eB2j2bGCA39exIDezKQqbs0YEc0d8YglUONNpY9Oo1CkyAe','FINANCE_ACCOUNTANT','2026-04-01 10:14:24','finance@gmail.com','finance','/uploads/profiles/97ce87ef-b76e-4f97-b46d-d3fa145a786a_bbbbbbbbbbb.jpg','\0'),(5,'manager','$2a$10$Vo8aGmYjxi58kFuDy0wPs.2AtKslMebnKgRVXTgxSIa0GEGAddbZq','MANAGER_SUPERVISOR','2026-04-01 11:28:44','manager@gmail.com','manager','/uploads/profiles/063626ec-1473-4986-9add-2f5f6888918d_IMG-20250919-WA0002.jpg','\0'),(6,'single','$2a$10$XHU.A0GGf60Q/YAZ4wHSeO/eJdU7f67Dp5tpRUeCHUQFT1zgzd372','OPERATIONS_STAFF','2026-04-14 11:40:57','single@gmail.com','single',NULL,'\0'),(7,'jose','$2a$10$NyRBg808G89rDFIfV.MXvOTDaRf2nxFgv9IWODBlhgikQOYWyjI.W','OPERATIONS_STAFF','2026-04-22 20:02:23','josenarame@gmail.com','jose',NULL,'\0'),(8,'staff','$2a$10$m8dnof8k7WQqkX16NidxNeAXzK7YbkED1oO9gUbrsexd3cQHSApHq','OPERATIONS_STAFF','2026-04-23 12:42:51','staff@vizion.com','Staff User',NULL,'');
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-04-23 16:20:31

# Host: 107.180.46.149  (Version 5.6.49-cll-lve)
# Date: 2021-03-19 18:25:42
# Generator: MySQL-Front 6.0  (Build 2.20)


#
# Structure for table "migrations"
#

DROP TABLE IF EXISTS `migrations`;
CREATE TABLE `migrations` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `migration` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `batch` int(11) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

#
# Data for table "migrations"
#

/*!40000 ALTER TABLE `migrations` DISABLE KEYS */;
INSERT INTO `migrations` VALUES (1,'2014_10_12_000000_create_users_table',1),(2,'2014_10_12_100000_create_password_resets_table',1),(3,'2019_03_22_234307_create_geral_tables',1);
/*!40000 ALTER TABLE `migrations` ENABLE KEYS */;

#
# Structure for table "movimentacoes"
#

DROP TABLE IF EXISTS `movimentacoes`;
CREATE TABLE `movimentacoes` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `tipo_movimentacao` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `usuario_id` int(10) unsigned NOT NULL,
  `tipo_valor_tag` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `tipo_valor` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `valor_total` int(10) unsigned DEFAULT NULL,
  `valor_parcela` int(10) unsigned DEFAULT NULL,
  `n_parcelas` int(10) unsigned DEFAULT NULL,
  `parcela_atual` int(10) unsigned DEFAULT NULL,
  `data_vencimento_parcela` int(10) unsigned DEFAULT NULL,
  `entrada_data` int(10) unsigned DEFAULT NULL,
  `created_at` int(11) DEFAULT NULL,
  `updated_at` int(11) DEFAULT NULL,
  `deleted_at` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `movimentacoes_usuario_id_foreign` (`usuario_id`)
) ENGINE=MyISAM AUTO_INCREMENT=21 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

#
# Data for table "movimentacoes"
#

/*!40000 ALTER TABLE `movimentacoes` DISABLE KEYS */;
INSERT INTO `movimentacoes` VALUES (1,'entrada',1,'venda','Sofá',122178,NULL,NULL,NULL,NULL,1555848000,1575148371,1575148371,NULL),(2,'saida',1,'salario','Geladeira',109093,NULL,NULL,NULL,NULL,1565827200,1575148371,1575148371,NULL),(3,'saida',1,'venda','Pizza',195427,NULL,NULL,NULL,NULL,1582329600,1575148371,1575148371,NULL),(4,'entrada',1,'venda','Viagem ao Rio de Janeiro',39796,6633,6,2,1575753171,1565827200,1575148371,1575148371,NULL),(5,'entrada',1,'outros','Geladeira',112348,28087,4,3,1575753171,1565827200,1575148371,1575148371,NULL),(6,'entrada',1,'salario','Playstation 4',18963,NULL,NULL,NULL,NULL,1555848000,1575148371,1575148371,NULL),(7,'saida',1,'outros','Playstation 4',156468,NULL,NULL,NULL,NULL,1565827200,1575148371,1575148371,NULL),(8,'entrada',1,'bonus','PC',184228,NULL,NULL,NULL,NULL,1555848000,1575148371,1575148371,NULL),(9,'saida',1,'bonus','Viagem ao Rio de Janeiro',30888,3861,8,3,1574284371,1557230400,1575148371,1581265185,1581265185),(10,'entrada',1,'salario','Pizza',54074,27037,2,1,1574284371,1555848000,1575148371,1575148371,NULL),(11,'entrada',1,'outros','Microondas',80439,NULL,NULL,NULL,NULL,1557230400,1575148371,1575148371,NULL),(12,'entrada',1,'venda','Pizza 123',31616,7904,4,2,1569877971,1565827200,1575148371,1585472894,NULL),(13,'saida',1,'bonus','Bônus de Dezembro',19113,NULL,NULL,NULL,NULL,1582329600,1575148371,1575148371,NULL),(14,'entrada',1,'venda','Viagem ao Rio de Janeiro',54571,NULL,NULL,NULL,NULL,1565827200,1575148371,1575148371,NULL),(15,'saida',1,'salario','Viagem ao Rio de Janeiro',192503,NULL,NULL,NULL,NULL,1557230400,1575148371,1575148371,NULL),(16,'entrada',1,'salario','Viagem ao Rio de Janeiro',73824,9228,8,3,1573333971,1582329600,1575148371,1575148371,NULL),(17,'entrada',1,'salario','Sofá',50518,NULL,NULL,NULL,NULL,1557230400,1575148371,1585472899,1585472899),(18,'entrada',1,'venda','Teste',1222,NULL,NULL,NULL,NULL,NULL,1585472941,1590617383,1590617383),(19,'saida',1,'cartao','Teste',180000,15000,12,1,1588042800,NULL,1585472968,1585472968,NULL),(20,'entrada',6,'venda','2323',538936,2323,232,1,1602644400,NULL,1602041303,1602041303,NULL);
/*!40000 ALTER TABLE `movimentacoes` ENABLE KEYS */;

#
# Structure for table "objetivos"
#

DROP TABLE IF EXISTS `objetivos`;
CREATE TABLE `objetivos` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `usuario_id` int(10) unsigned NOT NULL,
  `tipo_valor_tag` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `tipo_valor` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `valor_total` int(10) unsigned NOT NULL,
  `data_prevista` int(10) unsigned NOT NULL,
  `data_conclusao` int(10) unsigned DEFAULT NULL,
  `created_at` int(11) DEFAULT NULL,
  `updated_at` int(11) DEFAULT NULL,
  `deleted_at` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `objetivos_usuario_id_foreign` (`usuario_id`)
) ENGINE=MyISAM AUTO_INCREMENT=15 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

#
# Data for table "objetivos"
#

/*!40000 ALTER TABLE `objetivos` DISABLE KEYS */;
INSERT INTO `objetivos` VALUES (1,1,'compra','Bônus de Dezembro',33206,1566432000,NULL,1575148371,1575148371,NULL),(2,1,'compra','Playstation 4',64004,1566432000,NULL,1575148371,1575148371,NULL),(3,1,'venda','Viagem ao Rio de Janeiro',112186,1577664000,NULL,1575148371,1575148371,NULL),(4,1,'compra','Pizza',131467,1559476800,NULL,1575148371,1602041313,1602041313),(5,1,'venda','Xbox One',155139,1577664000,NULL,1575148371,1575148371,NULL),(6,1,'compra','Playstation 4',96854,1581681600,NULL,1575148371,1575148371,NULL),(7,1,'venda','Pizza',180443,1559476800,NULL,1575148371,1575148371,NULL),(8,1,'compra','Sofá',15253,1559476800,NULL,1575148371,1575148371,NULL),(9,1,'compra','Xbox One',65487,1566432000,NULL,1575148371,1575148371,NULL),(10,1,'compra','Playstation 4',198271,1566432000,NULL,1575148371,1575148371,NULL),(11,1,'compra','Sofá',23399,1581681600,NULL,1575148371,1575148371,NULL),(12,1,'venda','Microondas',109688,1581681600,NULL,1575148371,1575148371,NULL),(13,1,'compra','teste',12222,1580439600,NULL,1580510760,1585472918,1585472918),(14,1,'venda','teste 123',12222,1580958000,NULL,1580510782,1585472912,NULL);
/*!40000 ALTER TABLE `objetivos` ENABLE KEYS */;

#
# Structure for table "password_resets"
#

DROP TABLE IF EXISTS `password_resets`;
CREATE TABLE `password_resets` (
  `email` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `token` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  KEY `password_resets_email_index` (`email`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

#
# Data for table "password_resets"
#


#
# Structure for table "poupancas"
#

DROP TABLE IF EXISTS `poupancas`;
CREATE TABLE `poupancas` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `usuario_id` int(10) unsigned NOT NULL,
  `total` int(10) unsigned NOT NULL,
  `objetivo` int(10) unsigned NOT NULL,
  `created_at` int(11) DEFAULT NULL,
  `updated_at` int(11) DEFAULT NULL,
  `deleted_at` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `poupancas_usuario_id_foreign` (`usuario_id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

#
# Data for table "poupancas"
#


#
# Structure for table "salarios"
#

DROP TABLE IF EXISTS `salarios`;
CREATE TABLE `salarios` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `usuario_id` int(10) unsigned NOT NULL,
  `bruto` int(10) unsigned NOT NULL,
  `hora_extra` int(10) unsigned NOT NULL,
  `descontos` int(10) unsigned NOT NULL,
  `dia_recebimento` int(10) unsigned NOT NULL,
  `created_at` int(11) DEFAULT NULL,
  `updated_at` int(11) DEFAULT NULL,
  `deleted_at` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `salarios_usuario_id_foreign` (`usuario_id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

#
# Data for table "salarios"
#


#
# Structure for table "users"
#

DROP TABLE IF EXISTS `users`;
CREATE TABLE `users` (
  `id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `nome` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `email` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `email_verified_at` timestamp NULL DEFAULT NULL,
  `password` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `api_token` varchar(60) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `sexo` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `profissao` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `data_nascimento` int(11) NOT NULL,
  `foto` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `ultimo_acesso` int(11) DEFAULT NULL,
  `recuperar_senha` int(11) DEFAULT NULL,
  `remember_token` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `created_at` int(11) DEFAULT NULL,
  `updated_at` int(11) DEFAULT NULL,
  `deleted_at` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `users_email_unique` (`email`),
  UNIQUE KEY `users_api_token_unique` (`api_token`)
) ENGINE=MyISAM AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

#
# Data for table "users"
#

/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (1,'Alan Pardini Sant\'Ana','alanps2012@gmail.com',NULL,'$2y$10$tng66pghqPZHEMSm9Zqazu4tmQdF8KVoA4sQYlulG3Vmoe.wddnQq',NULL,'Masculino','Programador',560880000,'uploads/avatar.jpg',NULL,NULL,NULL,1575148371,1616187579,NULL),(2,'Alan Pardini Sant\'Ana','alan.pardini@ekantika.com.br',NULL,'$2y$10$4zZ0A214v5uvEz2TXYDV4.amQ44Z4M1Pt.x/kHuhJTo366kfRh/QS',NULL,'Masculino','Programador',560833200,NULL,NULL,NULL,NULL,1585475879,1590617438,NULL),(3,'Alan PS','fanfarrao_com@hotmail.com',NULL,'$2y$10$W5AOtevSOgT6fiS/QalCq.bqPFUMoDl1.dXLkeCE/shI6VV38.S8.',NULL,'Masculino','Programador',560833200,NULL,NULL,NULL,NULL,1600089290,1600089290,NULL),(4,'Alan PS','alanps2012@outlook.com',NULL,'$2y$10$8QsgL4XF.p99lcGeKahZ4.hI3PE79kLvSg/kLtRtIeh1Gc1uQAUrO',NULL,'Masculino','Programador',560833200,NULL,NULL,NULL,NULL,1600089433,1600581118,NULL),(5,'teste','teste@teste.com',NULL,'$2y$10$98xZU4EkYh4D20XtNG5mX.cFESakk2cyoXVYJxzcCsT2K3s2K9w2G','aZ11cQdtwRCG7r6YcggbBRtpzmFG4EUqJhoalrmTJfl025kYCdr3wOup62K6','Masculino','teste',1052881200,NULL,NULL,NULL,NULL,1601089493,1601089514,NULL),(6,'wewe wew','sds@dsd',NULL,'$2y$10$jiLSq8MaUHLZ7QQEXpq1eeiStzAYtoln3QZz6C4US7v61mSS39LjG','3jep23CXHhVfcy2HnC5nbgkyUJYmnPx7OZFdqwRv5TUkGVemGKzHdmVAKOau','Feminino','123',1601348400,NULL,NULL,NULL,NULL,1602041231,1602041235,NULL),(7,'Bruno Moreno','brunomoreno75310@gmail.com',NULL,'$2y$10$B77oFrQrcQEwYsGoiMIV0eODHsyQRT4wrj5ARTJZtbttw3xGqVbuS','d5qSx5Myi9ypAKzsfyAnsMFHscOOf2M1RoSyDyfWO2i97StQzFXAR0bWCuEE','Masculino','a',1606791600,NULL,NULL,NULL,NULL,1607915684,1607915687,NULL);
/*!40000 ALTER TABLE `users` ENABLE KEYS */;

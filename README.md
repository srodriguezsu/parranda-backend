Instrucciones SQL
```
CREATE TABLE canciones (
  id INT AUTO_INCREMENT PRIMARY KEY,
  titulo VARCHAR(100) NOT NULL,
  artista VARCHAR(100),
  url VARCHAR(255) NOT NULL,
  villancico TINYINT(1) NOT NULL
);

CREATE TABLE `usuarios` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `correo` varchar(255) NOT NULL,
  `nombre_completo` varchar(255) NOT NULL,
  `clave_hasheada` varchar(255) NOT NULL,
  `fecha_creacion` timestamp NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  UNIQUE KEY `correo` (`correo`)
)

CREATE TABLE `recetas` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `titulo` varchar(255) NOT NULL,
  `imagen_url` text DEFAULT NULL,
  `instrucciones` text NOT NULL,
  `autor` int(11) NOT NULL,
  `fecha_creacion` timestamp NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`),
  KEY `autor` (`autor`),
  CONSTRAINT `recetas_ibfk_1` FOREIGN KEY (`autor`) REFERENCES `usuarios` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=19 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci

CREATE TABLE `likes` (
  `usuario_id` int(11) NOT NULL,
  `receta_id` int(11) NOT NULL,
  `valor` int(11) DEFAULT NULL CHECK (`valor` in (-1,1)),
  PRIMARY KEY (`usuario_id`,`receta_id`),
  KEY `receta_id` (`receta_id`),
  CONSTRAINT `likes_ibfk_1` FOREIGN KEY (`usuario_id`) REFERENCES `usuarios` (`id`),
  CONSTRAINT `likes_ibfk_2` FOREIGN KEY (`receta_id`) REFERENCES `recetas` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
```
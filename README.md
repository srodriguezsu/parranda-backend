# 🎄 Parranda Backend

Este es el servidor backend del proyecto *Parranda, una aplicación web para compartir recetas navideñas y villancicos colombianos. Este backend proporciona una API REST construida con **Node.js, **Express, y una base de datos **MySQL*.

---

## 🚀 Características

- Registro e inicio de sesión de usuarios con autenticación JWT
- Gestión de recetas con imágenes (subidas con multer)
- Gestión de canciones (villancicos)
- Sistema de likes para recetas
- Comunicación segura con CORS habilitado
- Estructura modular organizada por controladores, servicios y rutas

---

## 📁 Estructura del Proyecto


parranda-backend/
├── controllers/        # Lógica de rutas para recetas, canciones, usuarios
├── middlewares/        # Middlewares personalizados (autenticación, validación)
├── services/           # Servicios para acceder a la base de datos (recetas, usuarios,canciones)
├── uploads/            # Carpeta para archivos subidos (ej. imágenes de recetas)
├── db.js               # Conexión a MongoDB
├── server.js           # Archivo principal donde se configura y arranca el servidor
├── package.json        # Dependencias del proyecto
├── .env-example        # Ejemplo del archivo de variables de entorno
└── README.md           # Documentación del proyecto


---

## 🧪 Instalación

1. Clona el repositorio:

bash
git clone https://github.com/srodriguezsu/parranda-backend.git
cd parranda-backend


2. Instala las dependencias:

bash
npm install

---

## ▶ Ejecutar el servidor

bash
# Modo desarrollo con reinicio automático
```npm run dev```

# Modo producción
```npm run start```


El servidor se ejecutará por defecto en [http://localhost:3456](http://localhost:3456)

---

## 🔐 Autenticación

- Se utiliza JWT para proteger rutas privadas.
- Al iniciar sesión, se genera un token que debe enviarse en el header Authorization: Bearer <token>.

---

## 📦 Endpoints principales

### 👤 Usuarios

| Método | Ruta                      | Descripción                |
| ------ | ------------------------- | -------------------------- |
| POST   | /api/usuarios/registrar | Registro de usuario        |
| POST   | /api/usuarios/login     | Login y obtención de token |

---

### 📸 Recetas

| Método | Ruta           | Descripción               |
| ------ | -------------- | ------------------------- |
| GET    | /api/recetas | Obtener todas las recetas |
| POST   | /api/recetas | Crear receta (con imagen) |

> Las imágenes se almacenan en la carpeta /uploads.

---

### 🎵 Villancicos

| Método | Ruta             | Descripción        |
| ------ | ---------------- | ------------------ |
| GET    | /api/canciones | Lista de canciones |
| POST   | /api/canciones | Agregar canción    |

---

### ❤ Likes

| Método | Ruta         | Descripción          |
| ------ | ------------ | -------------------- |
| POST   | /api/likes | Dar o quitar like    |
| GET    | /api/likes | Ver likes por receta |

---

## 🌐 Conexión con el Frontend

Este backend se conecta con el repositorio [*parranda (Frontend)*](https://github.com/srodriguezsu/parranda), construido en React.\
Las peticiones desde el cliente se realizan vía fetch o axios y apuntan a las rutas expuestas por este backend.


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
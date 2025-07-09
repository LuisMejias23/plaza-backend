
import mongoose from 'mongoose';
import Product from '../models/Product.js';


const products = [
  {
    "name": "Balón de Fútbol Profesional",
    "description": "Balón de fútbol de alta calidad, tamaño reglamentario, ideal para partidos y entrenamientos.",
    "price": 35.99,
    "imageUrl": "/images/balon_futbol.png",
    "category": "Deportes",
    "brand": "Nike",
    "countInStock": 50,
    "rating": 4.8,
    "numReviews": 120,
  },
  {
    "name": "Mancuernas Ajustables (Par)",
    "description": "Set de mancuernas ajustables de 2.5kg a 25kg, perfectas para entrenamiento en casa o gimnasio.",
    "price": 129.99,
    "imageUrl": "/images/mancuernas_ajustables.png",
    "category": "Deportes",
    "brand": "Bowflex",
    "countInStock": 30,
    "rating": 4.7,
    "numReviews": 85,
  },
  {
    "name": "Batería de Auto 12V",
    "description": "Batería de arranque de 12V para automóviles, con alta durabilidad y rendimiento en diversas condiciones climáticas.",
    "price": 99.50,
    "imageUrl": "/images/bateria_auto.png",
    "category": "Repuestos de Carro",
    "brand": "ACDelco",
    "countInStock": 25,
    "rating": 4.5,
    "numReviews": 60,
  },
  {
    "name": "Filtro de Aceite Sintético",
    "description": "Filtro de aceite de alto rendimiento para motores, compatible con la mayoría de vehículos modernos.",
    "price": 15.75,
    "imageUrl": "/images/filtro_aceite.png",
    "category": "Repuestos de Carro",
    "brand": "Mobil 1",
    "countInStock": 100,
    "rating": 4.6,
    "numReviews": 95,
    "isFeatured": false
  },
  {
    "name": "Set de Construcción de Robótica",
    "description": "Kit avanzado para construir y programar robots, ideal para niños y adolescentes interesados en STEM.",
    "price": 79.99,
    "imageUrl": "/images/kit_robotica.png",
    "category": "Juguetes",
    "brand": "LEGO Education",
    "countInStock": 40,
    "rating": 4.9,
    "numReviews": 70,
    "isFeatured": true
  },
  {
    "name": "Cafetera Espresso Manual",
    "description": "Cafetera de espresso manual de diseño elegante, fácil de usar para los amantes del café.",
    "price": 59.99,
    "imageUrl": "/images/cafetera-expresso.png",
    "category": "Electrodomésticos",
    "brand": "Brevill", 
    "countInStock": 35,
    "rating": 4.6,
    "numReviews": 55,
    "isFeatured": false
  },
  {
    "name": "Auriculares ANC Inalámbricos",
    "description": "Auriculares con cancelación activa de ruido, ideales para viajes y trabajo, con sonido premium.",
    "price": 149.99,
    "imageUrl": "/images/auriculares-anc.png",
    "category": "Audio",
    "brand": "Bose",
    "countInStock": 20,
    "rating": 4.7,
    "numReviews": 90,
    "isFeatured": true
  },
  {
    "name": "Smartwatch Fitness Tracker", 
    "description": "Reloj inteligente con monitor de ritmo cardíaco, GPS y seguimiento de actividad, ideal para deportistas.",
    "price": 89.99,
    "imageUrl": "/images/smartwatch-fitness.png",
    "category": "Electrónica",
    "brand": "Fitbit",
    "countInStock": 45,
    "rating": 4.4,
    "numReviews": 150,
    "isFeatured": false
  },
  {
    "name": "Robot Aspirador Inteligente", 
    "description": "Aspirador robotizado con mapeo inteligente y control por aplicación, limpia tu hogar sin esfuerzo.",
    "price": 299.99,
    "imageUrl": "/images/robot-aspirador.png",
    "category": "Hogar Inteligente",
    "brand": "iRobot",
    "countInStock": 15,
    "rating": 4.8,
    "numReviews": 130,
    "isFeatured": true
  },
  {
    "name": "Set de Cuchillos de Cocina Profesional", 
    "description": "Juego de 5 cuchillos de acero inoxidable de alta calidad con bloque de madera, para chefs y amantes de la cocina.",
    "price": 75.00,
    "imageUrl": "/images/set-cuchillos-cocina.png",
    "category": "Cocina",
    "brand": "Zwilling J.A. Henckels",
    "countInStock": 20,
    "rating": 4.6,
    "numReviews": 75,
    "isFeatured": false
  },
  {
    "name": "Laptop Gaming Ultrafina", 
    "description": "Laptop potente y portátil para juegos, con gráficos de última generación y pantalla de alta frecuencia de actualización.",
    "price": 1499.99,
    "imageUrl": "/images/laptop-gaming.png",
    "category": "Computadoras",
    "brand": "MSI",
    "countInStock": 10,
    "rating": 4.9,
    "numReviews": 115,
    "isFeatured": true
  },
  {
    "name": "Dinosaurio T-Rex de Juguete Gigante", 
    "description": "Figura de juguete de T-Rex a escala, con sonido y movimientos realistas, para horas de diversión jurásica.",
    "price": 45.00,
    "imageUrl": "/images/t-rex.png",
    "category": "Juguetes",
    "brand": "Jurassic World", 
    "countInStock": 25,
    "rating": 4.7,
    "numReviews": 80,
    "isFeatured": false
  }
];


// Conecta a la base de datos
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB conectado para seeding.'))
  .catch(err => {
    console.error('Error al conectar MongoDB para seeding:', err);
    process.exit(1); 
  });

const importData = async () => {
  try {
    // Elimina todos los productos existentes antes de importar
    await Product.deleteMany(); 
    // Si tuvieras usuarios de prueba, también los podrías eliminar o insertar aquí:
    // await User.deleteMany(); 

    await Product.insertMany(products); // Inserta los nuevos productos

    console.log('Datos importados con éxito (Productos).');
    process.exit(); // Sale del script con éxito
  } catch (error) {
    console.error('Error al importar datos:', error);
    process.exit(1); // Sale del script con error
  }
};

const destroyData = async () => {
  try {
    await Product.deleteMany();
    // await User.deleteMany();
    console.log('Datos destruidos con éxito (Productos).');
    process.exit();
  } catch (error) {
    console.error('Error al destruir datos:', error);
    process.exit(1);
  }
};

// Lógica para ejecutar importData o destroyData basada en el argumento de la línea de comandos
if (process.argv[2] === '-d') {
  destroyData();
} else {
  importData();
}
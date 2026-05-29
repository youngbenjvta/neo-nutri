"use client";

// ============================================================
//  KAIZEN — Base de alimentos para cálculo automático.
//  Cada alimento tiene calorías por su unidad natural.
//  kcal = cantidad elegida × kcalPorUnidad
//  Los macros (proteína/carbos/grasa) se estiman automáticamente
//  según la categoría del alimento.
// ============================================================

export type Alimento = {
  id: string;
  nombre: string;
  categoria: string;
  unidad: string;      // "taza", "100g", "unidad", "cda"
  kcalPorUnidad: number;
};

export type Macros = {
  prote: number;   // gramos de proteína
  carbs: number;   // gramos de carbohidratos
  grasa: number;   // gramos de grasa
};

// Proporción de macros estimada según la categoría (porcentaje de kcal)
// Recordar: 1g prote = 4 kcal, 1g carbs = 4 kcal, 1g grasa = 9 kcal
const MACROS_POR_CATEGORIA: Record<string, { prote: number; carbs: number; grasa: number }> = {
  "Proteínas":          { prote: 0.65, carbs: 0.05, grasa: 0.30 },
  "Carbohidratos":      { prote: 0.10, carbs: 0.82, grasa: 0.08 },
  "Latinos":            { prote: 0.20, carbs: 0.50, grasa: 0.30 },
  "Comida rápida":      { prote: 0.18, carbs: 0.42, grasa: 0.40 },
  "Frutas":             { prote: 0.05, carbs: 0.90, grasa: 0.05 },
  "Verduras":           { prote: 0.30, carbs: 0.60, grasa: 0.10 },
  "Lácteos":            { prote: 0.30, carbs: 0.35, grasa: 0.35 },
  "Bebidas":            { prote: 0.10, carbs: 0.80, grasa: 0.10 },
  "Panadería y dulces": { prote: 0.08, carbs: 0.55, grasa: 0.37 },
  "Aderezos":           { prote: 0.05, carbs: 0.15, grasa: 0.80 },
  "Grasas y snacks":    { prote: 0.10, carbs: 0.20, grasa: 0.70 },
};

// Calcula los macros para una cantidad de kcal de cierta categoría
export function macrosDesde(kcal: number, categoria?: string): Macros {
  const prop = (categoria && MACROS_POR_CATEGORIA[categoria]) || MACROS_POR_CATEGORIA["Comida rápida"];
  return {
    prote: Math.round((kcal * prop.prote) / 4),
    carbs: Math.round((kcal * prop.carbs) / 4),
    grasa: Math.round((kcal * prop.grasa) / 9),
  };
}

// Lista completa y variada (con enfoque fitness)
export const ALIMENTOS: Alimento[] = [
  // 🍗 PROTEÍNAS
  { id: "pollo", nombre: "Pechuga de pollo", categoria: "Proteínas", unidad: "100g", kcalPorUnidad: 165 },
  { id: "carne", nombre: "Carne de res magra", categoria: "Proteínas", unidad: "100g", kcalPorUnidad: 250 },
  { id: "pescado", nombre: "Pescado blanco", categoria: "Proteínas", unidad: "100g", kcalPorUnidad: 120 },
  { id: "salmon", nombre: "Salmón", categoria: "Proteínas", unidad: "100g", kcalPorUnidad: 208 },
  { id: "atun", nombre: "Atún (lata)", categoria: "Proteínas", unidad: "lata", kcalPorUnidad: 130 },
  { id: "huevo", nombre: "Huevo entero", categoria: "Proteínas", unidad: "unidad", kcalPorUnidad: 70 },
  { id: "clara", nombre: "Clara de huevo", categoria: "Proteínas", unidad: "unidad", kcalPorUnidad: 17 },
  { id: "proteina", nombre: "Proteína en polvo", categoria: "Proteínas", unidad: "scoop", kcalPorUnidad: 120 },
  { id: "cerdo", nombre: "Lomo de cerdo", categoria: "Proteínas", unidad: "100g", kcalPorUnidad: 242 },

  // 🍚 CARBOHIDRATOS
  { id: "arroz", nombre: "Arroz cocido", categoria: "Carbohidratos", unidad: "taza", kcalPorUnidad: 205 },
  { id: "pasta", nombre: "Pasta cocida", categoria: "Carbohidratos", unidad: "taza", kcalPorUnidad: 220 },
  { id: "pan", nombre: "Pan (rebanada)", categoria: "Carbohidratos", unidad: "rebanada", kcalPorUnidad: 80 },
  { id: "avena", nombre: "Avena", categoria: "Carbohidratos", unidad: "taza", kcalPorUnidad: 150 },
  { id: "batata", nombre: "Batata / camote", categoria: "Carbohidratos", unidad: "100g", kcalPorUnidad: 86 },
  { id: "papa", nombre: "Papa cocida", categoria: "Carbohidratos", unidad: "100g", kcalPorUnidad: 87 },
  { id: "quinoa", nombre: "Quinoa cocida", categoria: "Carbohidratos", unidad: "taza", kcalPorUnidad: 222 },
  { id: "tortilla", nombre: "Tortilla", categoria: "Carbohidratos", unidad: "unidad", kcalPorUnidad: 90 },

  // 🍎 FRUTAS
  { id: "platano", nombre: "Plátano", categoria: "Frutas", unidad: "unidad", kcalPorUnidad: 105 },
  { id: "manzana", nombre: "Manzana", categoria: "Frutas", unidad: "unidad", kcalPorUnidad: 95 },
  { id: "fresa", nombre: "Fresas", categoria: "Frutas", unidad: "taza", kcalPorUnidad: 49 },
  { id: "naranja", nombre: "Naranja", categoria: "Frutas", unidad: "unidad", kcalPorUnidad: 62 },
  { id: "uva", nombre: "Uvas", categoria: "Frutas", unidad: "taza", kcalPorUnidad: 104 },
  { id: "arandano", nombre: "Arándanos", categoria: "Frutas", unidad: "taza", kcalPorUnidad: 84 },

  // 🥦 VERDURAS
  { id: "brocoli", nombre: "Brócoli", categoria: "Verduras", unidad: "taza", kcalPorUnidad: 31 },
  { id: "ensalada", nombre: "Ensalada verde", categoria: "Verduras", unidad: "taza", kcalPorUnidad: 15 },
  { id: "esparrago", nombre: "Espárragos", categoria: "Verduras", unidad: "taza", kcalPorUnidad: 27 },
  { id: "tomate", nombre: "Tomate", categoria: "Verduras", unidad: "unidad", kcalPorUnidad: 22 },
  { id: "zanahoria", nombre: "Zanahoria", categoria: "Verduras", unidad: "unidad", kcalPorUnidad: 25 },

  // 🥛 LÁCTEOS
  { id: "leche", nombre: "Leche", categoria: "Lácteos", unidad: "taza", kcalPorUnidad: 150 },
  { id: "yogur", nombre: "Yogur griego", categoria: "Lácteos", unidad: "taza", kcalPorUnidad: 130 },
  { id: "queso", nombre: "Queso", categoria: "Lácteos", unidad: "rebanada", kcalPorUnidad: 80 },

  // 🥜 GRASAS Y SNACKS
  { id: "almendra", nombre: "Almendras", categoria: "Grasas y snacks", unidad: "puñado", kcalPorUnidad: 160 },
  { id: "mani", nombre: "Mantequilla de maní", categoria: "Grasas y snacks", unidad: "cda", kcalPorUnidad: 95 },
  { id: "aguacate", nombre: "Aguacate", categoria: "Grasas y snacks", unidad: "unidad", kcalPorUnidad: 240 },
  { id: "aceite", nombre: "Aceite de oliva", categoria: "Grasas y snacks", unidad: "cda", kcalPorUnidad: 119 },
  { id: "nuez", nombre: "Nueces", categoria: "Grasas y snacks", unidad: "puñado", kcalPorUnidad: 185 },

  // 🫓 LATINOS / TÍPICOS
  { id: "arepa", nombre: "Arepa", categoria: "Latinos", unidad: "unidad", kcalPorUnidad: 220 },
  { id: "empanada", nombre: "Empanada", categoria: "Latinos", unidad: "unidad", kcalPorUnidad: 290 },
  { id: "frijoles", nombre: "Frijoles / porotos", categoria: "Latinos", unidad: "taza", kcalPorUnidad: 227 },
  { id: "lentejas", nombre: "Lentejas", categoria: "Latinos", unidad: "taza", kcalPorUnidad: 230 },
  { id: "arrozpollo", nombre: "Arroz con pollo", categoria: "Latinos", unidad: "plato", kcalPorUnidad: 480 },
  { id: "platanofrito", nombre: "Plátano frito", categoria: "Latinos", unidad: "unidad", kcalPorUnidad: 150 },
  { id: "completo", nombre: "Completo / hot dog", categoria: "Latinos", unidad: "unidad", kcalPorUnidad: 350 },
  { id: "sopaipilla", nombre: "Sopaipilla", categoria: "Latinos", unidad: "unidad", kcalPorUnidad: 130 },
  { id: "humita", nombre: "Humita", categoria: "Latinos", unidad: "unidad", kcalPorUnidad: 190 },
  { id: "cazuela", nombre: "Cazuela", categoria: "Latinos", unidad: "plato", kcalPorUnidad: 350 },

  // 🍔 COMIDA RÁPIDA
  { id: "pizza", nombre: "Pizza (porción)", categoria: "Comida rápida", unidad: "porción", kcalPorUnidad: 285 },
  { id: "hamburguesa", nombre: "Hamburguesa", categoria: "Comida rápida", unidad: "unidad", kcalPorUnidad: 540 },
  { id: "papasfritas", nombre: "Papas fritas", categoria: "Comida rápida", unidad: "porción", kcalPorUnidad: 365 },
  { id: "sandwich", nombre: "Sándwich", categoria: "Comida rápida", unidad: "unidad", kcalPorUnidad: 350 },
  { id: "sushi", nombre: "Sushi (roll)", categoria: "Comida rápida", unidad: "roll", kcalPorUnidad: 255 },

  // ☕ BEBIDAS
  { id: "cafe", nombre: "Café con leche", categoria: "Bebidas", unidad: "taza", kcalPorUnidad: 70 },
  { id: "cafenegro", nombre: "Café negro", categoria: "Bebidas", unidad: "taza", kcalPorUnidad: 5 },
  { id: "gaseosa", nombre: "Gaseosa / bebida", categoria: "Bebidas", unidad: "vaso", kcalPorUnidad: 140 },
  { id: "jugo", nombre: "Jugo natural", categoria: "Bebidas", unidad: "vaso", kcalPorUnidad: 110 },
  { id: "batido", nombre: "Batido de proteína", categoria: "Bebidas", unidad: "vaso", kcalPorUnidad: 180 },

  // 🍫 SNACKS DULCES
  { id: "galletas", nombre: "Galletas", categoria: "Grasas y snacks", unidad: "unidad", kcalPorUnidad: 50 },
  { id: "chocolate", nombre: "Chocolate", categoria: "Grasas y snacks", unidad: "barra", kcalPorUnidad: 230 },
  { id: "barracereal", nombre: "Barra de cereal", categoria: "Grasas y snacks", unidad: "unidad", kcalPorUnidad: 120 },
  { id: "helado", nombre: "Helado", categoria: "Grasas y snacks", unidad: "bola", kcalPorUnidad: 140 },

  // 🥤 MÁS BEBIDAS (café, té, etc.)
  { id: "te", nombre: "Té (sin azúcar)", categoria: "Bebidas", unidad: "taza", kcalPorUnidad: 2 },
  { id: "teleche", nombre: "Té con leche y azúcar", categoria: "Bebidas", unidad: "taza", kcalPorUnidad: 60 },
  { id: "capuchino", nombre: "Capuchino", categoria: "Bebidas", unidad: "taza", kcalPorUnidad: 120 },
  { id: "agua", nombre: "Agua", categoria: "Bebidas", unidad: "vaso", kcalPorUnidad: 0 },
  { id: "cerveza", nombre: "Cerveza", categoria: "Bebidas", unidad: "lata", kcalPorUnidad: 150 },
  { id: "vino", nombre: "Vino", categoria: "Bebidas", unidad: "copa", kcalPorUnidad: 125 },
  { id: "energetica", nombre: "Bebida energética", categoria: "Bebidas", unidad: "lata", kcalPorUnidad: 160 },
  { id: "limonada", nombre: "Limonada", categoria: "Bebidas", unidad: "vaso", kcalPorUnidad: 99 },
  { id: "lechechoco", nombre: "Leche chocolatada", categoria: "Bebidas", unidad: "vaso", kcalPorUnidad: 190 },
  { id: "smoothie", nombre: "Smoothie de frutas", categoria: "Bebidas", unidad: "vaso", kcalPorUnidad: 150 },

  // 🧈 ADEREZOS Y CONDIMENTOS
  { id: "mantequilla", nombre: "Mantequilla", categoria: "Aderezos", unidad: "cda", kcalPorUnidad: 102 },
  { id: "margarina", nombre: "Margarina", categoria: "Aderezos", unidad: "cda", kcalPorUnidad: 75 },
  { id: "mayonesa", nombre: "Mayonesa", categoria: "Aderezos", unidad: "cda", kcalPorUnidad: 94 },
  { id: "ketchup", nombre: "Ketchup", categoria: "Aderezos", unidad: "cda", kcalPorUnidad: 19 },
  { id: "mostaza", nombre: "Mostaza", categoria: "Aderezos", unidad: "cda", kcalPorUnidad: 10 },
  { id: "salsatomate", nombre: "Salsa de tomate", categoria: "Aderezos", unidad: "cda", kcalPorUnidad: 15 },
  { id: "salsasoya", nombre: "Salsa de soya", categoria: "Aderezos", unidad: "cda", kcalPorUnidad: 9 },
  { id: "aderezocesar", nombre: "Aderezo César", categoria: "Aderezos", unidad: "cda", kcalPorUnidad: 80 },
  { id: "vinagreta", nombre: "Vinagreta", categoria: "Aderezos", unidad: "cda", kcalPorUnidad: 45 },
  { id: "miel", nombre: "Miel", categoria: "Aderezos", unidad: "cda", kcalPorUnidad: 64 },
  { id: "mermelada", nombre: "Mermelada", categoria: "Aderezos", unidad: "cda", kcalPorUnidad: 56 },
  { id: "azucar", nombre: "Azúcar", categoria: "Aderezos", unidad: "cda", kcalPorUnidad: 48 },
  { id: "crema", nombre: "Crema de leche", categoria: "Aderezos", unidad: "cda", kcalPorUnidad: 52 },
  { id: "guacamole", nombre: "Guacamole", categoria: "Aderezos", unidad: "cda", kcalPorUnidad: 45 },
  { id: "humus", nombre: "Hummus", categoria: "Aderezos", unidad: "cda", kcalPorUnidad: 35 },

  // 🍞 PANADERÍA Y DULCES
  { id: "croissant", nombre: "Croissant", categoria: "Panadería y dulces", unidad: "unidad", kcalPorUnidad: 230 },
  { id: "panintegral", nombre: "Pan integral", categoria: "Panadería y dulces", unidad: "rebanada", kcalPorUnidad: 70 },
  { id: "bagel", nombre: "Bagel", categoria: "Panadería y dulces", unidad: "unidad", kcalPorUnidad: 250 },
  { id: "panqueque", nombre: "Panqueque", categoria: "Panadería y dulces", unidad: "unidad", kcalPorUnidad: 90 },
  { id: "waffle", nombre: "Waffle", categoria: "Panadería y dulces", unidad: "unidad", kcalPorUnidad: 220 },
  { id: "dona", nombre: "Dona", categoria: "Panadería y dulces", unidad: "unidad", kcalPorUnidad: 250 },
  { id: "muffin", nombre: "Muffin", categoria: "Panadería y dulces", unidad: "unidad", kcalPorUnidad: 280 },
  { id: "queque", nombre: "Queque / bizcocho", categoria: "Panadería y dulces", unidad: "rebanada", kcalPorUnidad: 240 },
  { id: "brownie", nombre: "Brownie", categoria: "Panadería y dulces", unidad: "unidad", kcalPorUnidad: 200 },
  { id: "galletaavena", nombre: "Galleta de avena", categoria: "Panadería y dulces", unidad: "unidad", kcalPorUnidad: 80 },

  // 🍗 MÁS PROTEÍNAS
  { id: "pavo", nombre: "Pavo", categoria: "Proteínas", unidad: "100g", kcalPorUnidad: 135 },
  { id: "camaron", nombre: "Camarones", categoria: "Proteínas", unidad: "100g", kcalPorUnidad: 99 },
  { id: "tofu", nombre: "Tofu", categoria: "Proteínas", unidad: "100g", kcalPorUnidad: 76 },
  { id: "jamon", nombre: "Jamón", categoria: "Proteínas", unidad: "rebanada", kcalPorUnidad: 46 },
  { id: "salchicha", nombre: "Salchicha", categoria: "Proteínas", unidad: "unidad", kcalPorUnidad: 150 },
  { id: "tocino", nombre: "Tocino", categoria: "Proteínas", unidad: "tira", kcalPorUnidad: 43 },

  // 🥦 MÁS VERDURAS Y FRUTAS
  { id: "espinaca", nombre: "Espinaca", categoria: "Verduras", unidad: "taza", kcalPorUnidad: 7 },
  { id: "champinon", nombre: "Champiñones", categoria: "Verduras", unidad: "taza", kcalPorUnidad: 15 },
  { id: "palta", nombre: "Palta / aguacate", categoria: "Frutas", unidad: "unidad", kcalPorUnidad: 240 },
  { id: "pina", nombre: "Piña", categoria: "Frutas", unidad: "taza", kcalPorUnidad: 82 },
  { id: "mango", nombre: "Mango", categoria: "Frutas", unidad: "unidad", kcalPorUnidad: 135 },
  { id: "sandia", nombre: "Sandía", categoria: "Frutas", unidad: "taza", kcalPorUnidad: 46 },

  // 🥛 MÁS LÁCTEOS
  { id: "quesocrema", nombre: "Queso crema", categoria: "Lácteos", unidad: "cda", kcalPorUnidad: 50 },
  { id: "yogurnatural", nombre: "Yogur natural", categoria: "Lácteos", unidad: "taza", kcalPorUnidad: 100 },
  { id: "lechedesc", nombre: "Leche descremada", categoria: "Lácteos", unidad: "taza", kcalPorUnidad: 90 },
];

// Categorías en orden, para los filtros
export const CATEGORIAS = ["Proteínas", "Carbohidratos", "Latinos", "Comida rápida", "Frutas", "Verduras", "Lácteos", "Bebidas", "Panadería y dulces", "Aderezos", "Grasas y snacks"];

// Cantidades rápidas que se pueden elegir
export const CANTIDADES = [0.5, 1, 1.5, 2, 3];
"use client";

// ============================================================
//  NEO NUTRI — Base de alimentos para cálculo automático.
//  Cada alimento tiene calorías por su unidad natural.
//  kcal = cantidad elegida × kcalPorUnidad
// ============================================================

export type Alimento = {
  id: string;
  nombre: string;
  categoria: string;
  unidad: string;      // "taza", "100g", "unidad", "cda"
  kcalPorUnidad: number;
};

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
];

// Categorías en orden, para los filtros
export const CATEGORIAS = ["Proteínas", "Carbohidratos", "Latinos", "Comida rápida", "Frutas", "Verduras", "Lácteos", "Bebidas", "Grasas y snacks"];

// Cantidades rápidas que se pueden elegir
export const CANTIDADES = [0.5, 1, 1.5, 2, 3];
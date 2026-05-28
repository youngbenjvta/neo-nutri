"use client";

// ============================================================
//  KAIZEN — Base de recetas
//  Cada receta tiene calorías, ingredientes, pasos y etiquetas
//  para filtrar según restricciones del usuario.
// ============================================================

export type Receta = {
  id: string;
  nombre: string;
  emoji: string;          // ícono visual (sin necesitar imágenes externas)
  tipo: string;           // Desayuno / Almuerzo / Merienda / Cena / Snack
  kcal: number;
  tiempo: string;         // tiempo de preparación
  ingredientes: string[];
  pasos: string[];
  etiquetas: string[];    // "vegetariano","vegano","singluten","sinlactosa","alta-proteina"
};

export const RECETAS: Receta[] = [
  // ========= DESAYUNOS =========
  {
    id: "r01",
    nombre: "Avena con plátano y miel",
    emoji: "🥣",
    tipo: "Desayuno",
    kcal: 320,
    tiempo: "5 min",
    ingredientes: ["1/2 taza de avena", "1 taza de leche (o vegetal)", "1 plátano", "1 cdita de miel", "Canela"],
    pasos: [
      "Calienta la leche en una olla.",
      "Añade la avena y cocina 3 minutos revolviendo.",
      "Sirve, agrega plátano en rodajas, miel y canela.",
    ],
    etiquetas: ["vegetariano"],
  },
  {
    id: "r02",
    nombre: "Tostadas con palta y huevo",
    emoji: "🥑",
    tipo: "Desayuno",
    kcal: 380,
    tiempo: "10 min",
    ingredientes: ["2 rebanadas de pan integral", "1/2 palta", "2 huevos", "Sal, pimienta, limón"],
    pasos: [
      "Tuesta el pan.",
      "Fríe o pocha los huevos.",
      "Aplasta la palta con limón, sal y pimienta.",
      "Unta sobre el pan y pon el huevo encima.",
    ],
    etiquetas: ["vegetariano", "alta-proteina"],
  },
  {
    id: "r03",
    nombre: "Yogur con granola y frutas",
    emoji: "🫐",
    tipo: "Desayuno",
    kcal: 280,
    tiempo: "3 min",
    ingredientes: ["1 yogur natural", "3 cdas de granola", "Frutas del bosque", "1 cdita de miel"],
    pasos: [
      "Pon el yogur en un bowl.",
      "Añade granola encima.",
      "Decora con frutas y un toque de miel.",
    ],
    etiquetas: ["vegetariano"],
  },
  {
    id: "r04",
    nombre: "Tofu revuelto con verduras",
    emoji: "🍳",
    tipo: "Desayuno",
    kcal: 290,
    tiempo: "15 min",
    ingredientes: ["150g de tofu", "1/2 cebolla", "1 pimiento", "Cúrcuma", "Sal, pimienta"],
    pasos: [
      "Desmenuza el tofu con un tenedor.",
      "Sofríe la cebolla y el pimiento.",
      "Añade el tofu, cúrcuma y especias.",
      "Cocina 5 minutos revolviendo.",
    ],
    etiquetas: ["vegetariano", "vegano", "sinlactosa", "singluten", "alta-proteina"],
  },

  // ========= ALMUERZOS =========
  {
    id: "r05",
    nombre: "Pollo a la plancha con arroz y ensalada",
    emoji: "🍗",
    tipo: "Almuerzo",
    kcal: 520,
    tiempo: "20 min",
    ingredientes: ["150g de pechuga de pollo", "1 taza de arroz cocido", "Lechuga, tomate, pepino", "Aceite de oliva, limón, sal"],
    pasos: [
      "Sazona el pollo con sal y pimienta.",
      "Cocínalo en una plancha 5-6 minutos por lado.",
      "Prepara la ensalada con aceite y limón.",
      "Sirve con arroz al lado.",
    ],
    etiquetas: ["singluten", "sinlactosa", "alta-proteina"],
  },
  {
    id: "r06",
    nombre: "Bowl de quinoa con palta y garbanzos",
    emoji: "🥗",
    tipo: "Almuerzo",
    kcal: 480,
    tiempo: "20 min",
    ingredientes: ["1 taza de quinoa cocida", "1/2 palta", "1/2 taza de garbanzos", "Tomates cherry", "Aceite, limón, sal"],
    pasos: [
      "Cocina la quinoa siguiendo el paquete.",
      "Sirve en un bowl con palta en rodajas.",
      "Añade garbanzos y tomates cherry.",
      "Aliña con aceite, limón y sal.",
    ],
    etiquetas: ["vegetariano", "vegano", "sinlactosa", "singluten"],
  },
  {
    id: "r07",
    nombre: "Pasta con atún y tomate",
    emoji: "🍝",
    tipo: "Almuerzo",
    kcal: 540,
    tiempo: "15 min",
    ingredientes: ["100g de pasta", "1 lata de atún", "Salsa de tomate", "Ajo, aceite, orégano"],
    pasos: [
      "Hierve la pasta según el paquete.",
      "Sofríe el ajo en aceite.",
      "Añade la salsa y el atún.",
      "Mezcla con la pasta y agrega orégano.",
    ],
    etiquetas: ["alta-proteina"],
  },
  {
    id: "r08",
    nombre: "Salmón al horno con verduras",
    emoji: "🐟",
    tipo: "Almuerzo",
    kcal: 460,
    tiempo: "25 min",
    ingredientes: ["150g de salmón", "Brócoli, zanahoria", "Limón, ajo, aceite de oliva", "Sal, pimienta"],
    pasos: [
      "Precalienta el horno a 200°C.",
      "Coloca el salmón y las verduras en una bandeja.",
      "Sazona con ajo, limón, aceite y especias.",
      "Hornea 18-20 minutos.",
    ],
    etiquetas: ["singluten", "sinlactosa", "alta-proteina"],
  },
  {
    id: "r09",
    nombre: "Tacos de carne y guacamole",
    emoji: "🌮",
    tipo: "Almuerzo",
    kcal: 580,
    tiempo: "20 min",
    ingredientes: ["150g de carne molida", "3 tortillas", "1/2 palta", "Cebolla, tomate, cilantro", "Limón, comino"],
    pasos: [
      "Cocina la carne con cebolla y comino.",
      "Prepara guacamole con palta, limón y cilantro.",
      "Calienta las tortillas.",
      "Arma los tacos con carne y guacamole.",
    ],
    etiquetas: ["alta-proteina"],
  },

  // ========= MERIENDAS / SNACKS =========
  {
    id: "r10",
    nombre: "Batido de proteína con plátano",
    emoji: "🥤",
    tipo: "Merienda",
    kcal: 250,
    tiempo: "3 min",
    ingredientes: ["1 scoop de proteína", "1 plátano", "1 taza de leche (o vegetal)", "Hielo"],
    pasos: [
      "Pon todos los ingredientes en la licuadora.",
      "Bate hasta que esté cremoso.",
      "Sirve frío.",
    ],
    etiquetas: ["vegetariano", "alta-proteina"],
  },
  {
    id: "r11",
    nombre: "Hummus con palitos de zanahoria",
    emoji: "🥕",
    tipo: "Snack",
    kcal: 180,
    tiempo: "5 min",
    ingredientes: ["3 cdas de hummus", "2 zanahorias", "1 pepino"],
    pasos: [
      "Corta la zanahoria y el pepino en palitos.",
      "Sirve el hummus en un bowl pequeño.",
      "Listo para mojar.",
    ],
    etiquetas: ["vegetariano", "vegano", "sinlactosa", "singluten"],
  },
  {
    id: "r12",
    nombre: "Manzana con mantequilla de maní",
    emoji: "🍎",
    tipo: "Snack",
    kcal: 220,
    tiempo: "2 min",
    ingredientes: ["1 manzana", "1 cda de mantequilla de maní"],
    pasos: [
      "Corta la manzana en rodajas.",
      "Sirve con la mantequilla de maní al lado.",
    ],
    etiquetas: ["vegetariano", "vegano", "sinlactosa", "singluten"],
  },
  {
    id: "r13",
    nombre: "Yogur con frutos secos",
    emoji: "🥜",
    tipo: "Merienda",
    kcal: 230,
    tiempo: "2 min",
    ingredientes: ["1 yogur natural", "Puñado de frutos secos", "1 cdita de miel"],
    pasos: [
      "Sirve el yogur en un bowl.",
      "Añade los frutos secos y la miel.",
    ],
    etiquetas: ["vegetariano"],
  },

  // ========= CENAS =========
  {
    id: "r14",
    nombre: "Pollo al curry con coliflor",
    emoji: "🍛",
    tipo: "Cena",
    kcal: 430,
    tiempo: "25 min",
    ingredientes: ["150g de pollo", "Coliflor", "Leche de coco", "Curry, ajo, cebolla"],
    pasos: [
      "Sofríe cebolla y ajo.",
      "Añade el pollo y dóralo.",
      "Agrega coliflor, leche de coco y curry.",
      "Cocina 15 minutos a fuego medio.",
    ],
    etiquetas: ["singluten", "sinlactosa", "alta-proteina"],
  },
  {
    id: "r15",
    nombre: "Ensalada caprese con pollo",
    emoji: "🥗",
    tipo: "Cena",
    kcal: 380,
    tiempo: "15 min",
    ingredientes: ["150g de pollo a la plancha", "Tomate", "Mozzarella", "Albahaca, aceite, sal"],
    pasos: [
      "Cocina el pollo a la plancha.",
      "Corta tomate y mozzarella en rodajas.",
      "Arma intercalando, añade albahaca.",
      "Aliña con aceite y sal.",
    ],
    etiquetas: ["vegetariano", "singluten", "alta-proteina"],
  },
  {
    id: "r16",
    nombre: "Lentejas con verduras",
    emoji: "🍲",
    tipo: "Cena",
    kcal: 360,
    tiempo: "30 min",
    ingredientes: ["1 taza de lentejas", "Zanahoria, cebolla, apio", "Tomate, ajo, especias"],
    pasos: [
      "Sofríe cebolla, ajo y verduras.",
      "Añade las lentejas y agua.",
      "Cocina 25 minutos hasta que estén tiernas.",
      "Sazona al gusto.",
    ],
    etiquetas: ["vegetariano", "vegano", "sinlactosa", "singluten"],
  },
  {
    id: "r17",
    nombre: "Omelette de espinacas y queso",
    emoji: "🍳",
    tipo: "Cena",
    kcal: 310,
    tiempo: "10 min",
    ingredientes: ["3 huevos", "1 taza de espinacas", "Queso", "Sal, pimienta"],
    pasos: [
      "Bate los huevos con sal y pimienta.",
      "Saltea las espinacas.",
      "Vierte los huevos, añade queso.",
      "Cocina hasta que cuaje y dobla.",
    ],
    etiquetas: ["vegetariano", "singluten", "alta-proteina"],
  },
  {
    id: "r18",
    nombre: "Wrap de pavo con vegetales",
    emoji: "🌯",
    tipo: "Cena",
    kcal: 420,
    tiempo: "10 min",
    ingredientes: ["1 tortilla integral", "100g de pavo", "Lechuga, tomate, palta", "Mostaza"],
    pasos: [
      "Calienta la tortilla.",
      "Unta mostaza.",
      "Pon pavo, vegetales y palta.",
      "Enrolla y corta a la mitad.",
    ],
    etiquetas: ["alta-proteina"],
  },
];

// Etiquetas legibles para los filtros
export const ETIQUETAS_FILTROS = [
  { id: "todos", label: "Todos" },
  { id: "vegetariano", label: "Vegetariano" },
  { id: "vegano", label: "Vegano" },
  { id: "singluten", label: "Sin gluten" },
  { id: "sinlactosa", label: "Sin lactosa" },
  { id: "alta-proteina", label: "Alta proteína" },
];

// Tipos de comida para los filtros
export const TIPOS_RECETA = ["Todos", "Desayuno", "Almuerzo", "Merienda", "Snack", "Cena"];
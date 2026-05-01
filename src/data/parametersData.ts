export interface ParameterOption {
  id: string;
  label: string;
}

export interface ParameterCategory {
  id: string;
  /** Назва категорії для плейсхолдера: «Оберіть <labelUk>» */
  labelUk: string;
  options: ParameterOption[];
}

export const parameterCategories: ParameterCategory[] = [
  {
    id: "color",
    labelUk: "колір",
    options: [
      { id: "mono", label: "Чорно-білий" },
      { id: "warm", label: "Теплі тони" },
      { id: "cool", label: "Холодні тони" },
      { id: "pastel", label: "Пастельні" },
      { id: "neon", label: "Насичені / яскраві" },
      { id: "earth", label: "Природні / земні" },
      { id: "neutral", label: "Нейтральні" },
    ],
  },
  {
    id: "style",
    labelUk: "стиль",
    options: [
      { id: "realism", label: "Реалізм" },
      { id: "abstract", label: "Абстракція" },
      { id: "minimal", label: "Мінімалізм" },
      { id: "expressionism", label: "Експресіонізм" },
      { id: "conceptual", label: "Концептуальне мистецтво" },
      { id: "street", label: "Стріт-арт / графіті" },
      { id: "pop", label: "Поп-арт" },
      { id: "other_style", label: "Інше" },
    ],
  },
  {
    id: "price",
    labelUk: "ціну",
    options: [
      { id: "lt100", label: "Менше 100 $" },
      { id: "100_500", label: "100–500 $" },
      { id: "501_1000", label: "501–1000 $" },
      { id: "1001_5000", label: "1001–5000 $" },
      { id: "5001_10000", label: "5001–10 000 $" },
      { id: "gt10000", label: "Більше 10 000 $" },
    ],
  },
  {
    id: "artist_country",
    labelUk: "країну артиста",
    options: [
      { id: "ua", label: "Україна" },
      { id: "pl", label: "Польща" },
      { id: "de", label: "Німеччина" },
      { id: "fr", label: "Франція" },
      { id: "uk", label: "Велика Британія" },
      { id: "us", label: "США" },
      { id: "other_country", label: "Інша країна" },
    ],
  },
  {
    id: "subject",
    labelUk: "предмет",
    options: [
      { id: "portrait", label: "Портрет" },
      { id: "landscape", label: "Пейзаж" },
      { id: "stilllife", label: "Натюрморт" },
      { id: "architecture", label: "Архітектура" },
      { id: "animals", label: "Тварини" },
      { id: "fantasy", label: "Фентезі / сюжет" },
      { id: "abstract_subject", label: "Абстрактна тема" },
      { id: "other_subject", label: "Інше" },
    ],
  },
  {
    id: "material",
    labelUk: "матеріал",
    options: [
      { id: "canvas_oil", label: "Полотно, олія" },
      { id: "canvas_acrylic", label: "Полотно, акрил" },
      { id: "paper", label: "Папір / графіка" },
      { id: "digital", label: "Цифровий арт" },
      { id: "photo", label: "Фотографія" },
      { id: "sculpture_mix", label: "Скульптура / мікс-медіа" },
      { id: "fabric", label: "Текстиль" },
      { id: "other_material", label: "Інше" },
    ],
  },
  {
    id: "size",
    labelUk: "розмір",
    options: [
      { id: "xs", label: "До 30×40 см" },
      { id: "s", label: "30×40 – 60×80 см" },
      { id: "m", label: "60×80 – 100×120 см" },
      { id: "l", label: "100×120 см – 2 м" },
      { id: "xl", label: "Понад 2 м" },
      { id: "installation", label: "Інсталяція / об’єкт" },
      { id: "variable", label: "Змінний / немає фіксації" },
    ],
  },
];

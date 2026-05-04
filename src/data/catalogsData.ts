import { artistsData } from "./artistsData";
import { organizationsData } from "./organizationsData";

export interface Catalog {
  id: number;
  authorId: number;
  image: string;
  title: string;
  date: string;
  artSubCategory: string;
  likes: number;
  authorAvatar: string;
  authorName: string;
  /** Ім'я файлу PDF у каталозі `public/catalogs` (без шляху). */
  pdfFile?: string;
}

/** URL для відкриття PDF у переглядачі браузера. */
export function getCatalogPdfUrl(pdfFile?: string): string | undefined {
  const name = pdfFile?.trim();
  if (!name) return undefined;
  return `/catalogs/${encodeURIComponent(name)}`;
}

const authorById = new Map([...artistsData, ...organizationsData].map((author) => [author.id, author]));

const getCatalogAuthorById = (artistId: number) => {
  const artist = authorById.get(artistId);

  return {
    authorAvatar: artist?.artistPhoto ?? "",
    authorName: artist?.artistName ?? "",
  };
};

export const catalogsData: Catalog[] = [
  // painting
  { id: 1, authorId: 1, image: "/projects/project-photo-1.png", title: "Промені на полотні", date: "12.01.2026", artSubCategory: "painting", likes: 17, ...getCatalogAuthorById(1) },
  { id: 2, authorId: 15, image: "/projects/project-photo-2.png", title: "Абстрактні хмари", date: "18.01.2026", artSubCategory: "painting", likes: 29, ...getCatalogAuthorById(15) },
  { id: 27, authorId: 105, image: "/projects/project-photo-3.png", title: "Кольори Дніпра", date: "02.05.2026", artSubCategory: "painting", likes: 34, ...getCatalogAuthorById(105) },
  { id: 28, authorId: 105, image: "/projects/project-photo-4.png", title: "Галерейний подих", date: "04.05.2026", artSubCategory: "painting", likes: 21, ...getCatalogAuthorById(105) },

  // sculpture
  { id: 3, authorId: 2, image: "/projects/project-photo-3.png", title: "«Пульс»", date: "25.01.2026", artSubCategory: "sculpture", likes: 17, ...getCatalogAuthorById(2) },
  { id: 4, authorId: 1, image: "/projects/project-photo-4.png", title: "«Тиша»", date: "02.02.2026", artSubCategory: "sculpture", likes: 22, ...getCatalogAuthorById(1) },
  { id: 29, authorId: 114, image: "/projects/project-photo-1.png", title: "Сталь і форма", date: "06.05.2026", artSubCategory: "sculpture", likes: 27, ...getCatalogAuthorById(114) },
  { id: 30, authorId: 114, image: "/projects/project-photo-2.png", title: "Двір скульптур", date: "08.05.2026", artSubCategory: "sculpture", likes: 32, ...getCatalogAuthorById(114) },

  // graphics
  { id: 5, authorId: 3, image: "/projects/project-photo-1.png", title: "Лінії міста", date: "09.02.2026", artSubCategory: "graphics", likes: 35, ...getCatalogAuthorById(3) },
  { id: 6, authorId: 2, image: "/projects/project-photo-2.png", title: "Сонячний ритм", date: "16.02.2026", artSubCategory: "graphics", likes: 18, ...getCatalogAuthorById(2) },
  { id: 31, authorId: 108, image: "/projects/project-photo-3.png", title: "Лекторій ліній", date: "10.05.2026", artSubCategory: "graphics", likes: 24, ...getCatalogAuthorById(108) },
  { id: 32, authorId: 108, image: "/projects/project-photo-4.png", title: "Ілюстрація простору", date: "12.05.2026", artSubCategory: "graphics", likes: 29, ...getCatalogAuthorById(108) },

  // art-photography
  { id: 7, authorId: 4, image: "/projects/project-photo-3.png", title: "Відблиск", date: "23.02.2026", artSubCategory: "art-photography", likes: 17, ...getCatalogAuthorById(4) },
  { id: 8, authorId: 3, image: "/projects/project-photo-4.png", title: "Нічна тінь", date: "01.03.2026", artSubCategory: "art-photography", likes: 26, ...getCatalogAuthorById(3) },
  { id: 33, authorId: 106, image: "/projects/project-photo-1.png", title: "Погляд Вінниці", date: "14.05.2026", artSubCategory: "art-photography", likes: 25, ...getCatalogAuthorById(106) },
  { id: 34, authorId: 106, image: "/projects/project-photo-2.png", title: "Світло в об'єктиві", date: "16.05.2026", artSubCategory: "art-photography", likes: 30, ...getCatalogAuthorById(106) },

  // video-editing
  { id: 9, authorId: 5, image: "/projects/project-photo-1.png", title: "Міські сполохи", date: "07.03.2026", artSubCategory: "video-editing", likes: 22, ...getCatalogAuthorById(5) },
  { id: 10, authorId: 4, image: "/projects/project-photo-2.png", title: "Злам часу", date: "10.03.2026", artSubCategory: "video-editing", likes: 19, ...getCatalogAuthorById(4) },
  { id: 35, authorId: 111, image: "/projects/project-photo-3.png", title: "Медіа резонанс", date: "18.05.2026", artSubCategory: "video-editing", likes: 26, ...getCatalogAuthorById(111) },
  { id: 36, authorId: 111, image: "/projects/project-photo-4.png", title: "Кадр резиденції", date: "20.05.2026", artSubCategory: "video-editing", likes: 22, ...getCatalogAuthorById(111) },

  // cinema
  { id: 11, authorId: 6, image: "/projects/project-photo-3.png", title: "Нічне місто", date: "14.03.2026", artSubCategory: "cinema", likes: 19, ...getCatalogAuthorById(6) },
  { id: 12, authorId: 5, image: "/projects/project-photo-4.png", title: "Тиша за дверима", date: "18.03.2026", artSubCategory: "cinema", likes: 31, ...getCatalogAuthorById(5) },
  { id: 37, authorId: 107, image: "/projects/project-photo-1.png", title: "Платформа кадру", date: "22.05.2026", artSubCategory: "cinema", likes: 28, ...getCatalogAuthorById(107) },
  { id: 38, authorId: 107, image: "/projects/project-photo-2.png", title: "Документальний рух", date: "24.05.2026", artSubCategory: "cinema", likes: 23, ...getCatalogAuthorById(107) },

  // ar
  { id: 13, authorId: 7, image: "/projects/project-photo-1.png", title: "Голограми", date: "21.03.2026", artSubCategory: "ar", likes: 28, ...getCatalogAuthorById(7) },
  { id: 14, authorId: 6, image: "/projects/project-photo-2.png", title: "Кольорова арка", date: "24.03.2026", artSubCategory: "ar", likes: 15, ...getCatalogAuthorById(6) },
  { id: 39, authorId: 113, image: "/projects/project-photo-3.png", title: "AR-інсталяція міста", date: "26.05.2026", artSubCategory: "ar", likes: 31, ...getCatalogAuthorById(113) },
  { id: 40, authorId: 113, image: "/projects/project-photo-4.png", title: "Навігація доповнення", date: "28.05.2026", artSubCategory: "ar", likes: 24, ...getCatalogAuthorById(113) },

  // directing
  { id: 15, authorId: 8, image: "/projects/project-photo-3.png", title: "Театр руху", date: "27.03.2026", artSubCategory: "directing", likes: 31, ...getCatalogAuthorById(8) },
  { id: 16, authorId: 7, image: "/projects/project-photo-4.png", title: "Сцени світла", date: "30.03.2026", artSubCategory: "directing", likes: 24, ...getCatalogAuthorById(7) },
  { id: 41, authorId: 102, image: "/projects/project-photo-1.png", title: "Камерна постанова", date: "30.05.2026", artSubCategory: "directing", likes: 26, ...getCatalogAuthorById(102) },
  { id: 42, authorId: 102, image: "/projects/project-photo-2.png", title: "Драма близького плану", date: "01.06.2026", artSubCategory: "directing", likes: 19, ...getCatalogAuthorById(102) },

  // acting
  { id: 17, authorId: 9, image: "/projects/project-photo-1.png", title: "Відлуння", date: "02.04.2026", artSubCategory: "acting", likes: 15, ...getCatalogAuthorById(9) },
  { id: 18, authorId: 8, image: "/projects/project-photo-2.png", title: "Шепіт", date: "05.04.2026", artSubCategory: "acting", likes: 28, ...getCatalogAuthorById(8) },
  { id: 43, authorId: 101, image: "/projects/project-photo-3.png", title: "Модерна сцена", date: "03.06.2026", artSubCategory: "acting", likes: 30, ...getCatalogAuthorById(101) },
  { id: 44, authorId: 101, image: "/projects/project-photo-4.png", title: "Гастрольний акцент", date: "05.06.2026", artSubCategory: "acting", likes: 22, ...getCatalogAuthorById(101) },
  { id: 45, authorId: 115, image: "/projects/project-photo-1.png", title: "Сцена Кривбасу", date: "07.06.2026", artSubCategory: "acting", likes: 25, ...getCatalogAuthorById(115) },
  { id: 46, authorId: 115, image: "/projects/project-photo-2.png", title: "Театральна хвиля", date: "09.06.2026", artSubCategory: "acting", likes: 20, ...getCatalogAuthorById(115) },

  // music
  { id: 19, authorId: 10, image: "/projects/project-photo-3.png", title: "Промінь", date: "08.04.2026", artSubCategory: "music", likes: 24, ...getCatalogAuthorById(10) },
  { id: 20, authorId: 9, image: "/projects/project-photo-4.png", title: "Сон у темряві", date: "11.04.2026", artSubCategory: "music", likes: 22, ...getCatalogAuthorById(9) },
  { id: 47, authorId: 103, image: "/projects/project-photo-3.png", title: "Оперний експеримент", date: "11.06.2026", artSubCategory: "music", likes: 33, ...getCatalogAuthorById(103) },
  { id: 48, authorId: 103, image: "/projects/project-photo-4.png", title: "LAB арія", date: "13.06.2026", artSubCategory: "music", likes: 27, ...getCatalogAuthorById(103) },

  // choreography
  { id: 21, authorId: 11, image: "/projects/project-photo-1.png", title: "Лінії тіла", date: "14.04.2026", artSubCategory: "choreography", likes: 18, ...getCatalogAuthorById(11) },
  { id: 22, authorId: 10, image: "/projects/project-photo-2.png", title: "Оберт", date: "17.04.2026", artSubCategory: "choreography", likes: 33, ...getCatalogAuthorById(10) },
  { id: 49, authorId: 104, image: "/projects/project-photo-1.png", title: "Танець міста", date: "15.06.2026", artSubCategory: "choreography", likes: 29, ...getCatalogAuthorById(104) },
  { id: 50, authorId: 104, image: "/projects/project-photo-2.png", title: "Перформанс центру", date: "17.06.2026", artSubCategory: "choreography", likes: 24, ...getCatalogAuthorById(104) },

  // original-genre
  { id: 23, authorId: 12, image: "/projects/project-photo-3.png", title: "Ехо простору", date: "20.04.2026", artSubCategory: "original-genre", likes: 26, ...getCatalogAuthorById(12) },
  { id: 24, authorId: 11, image: "/projects/project-photo-4.png", title: "Квант ритму", date: "23.04.2026", artSubCategory: "original-genre", likes: 20, ...getCatalogAuthorById(11) },
  { id: 51, authorId: 112, image: "/projects/project-photo-3.png", title: "Імерсивний контур", date: "19.06.2026", artSubCategory: "original-genre", likes: 28, ...getCatalogAuthorById(112) },
  { id: 52, authorId: 112, image: "/projects/project-photo-4.png", title: "Експеримент сцени", date: "21.06.2026", artSubCategory: "original-genre", likes: 23, ...getCatalogAuthorById(112) },

  // poetry
  { id: 25, authorId: 13, image: "/projects/project-photo-1.png", title: "Сонячна пауза", date: "26.04.2026", artSubCategory: "poetry", likes: 20, ...getCatalogAuthorById(13) },
  { id: 26, authorId: 12, image: "/projects/project-photo-2.png", title: "Лист до вітру", date: "29.04.2026", artSubCategory: "poetry", likes: 29, ...getCatalogAuthorById(12) },
  { id: 53, authorId: 110, image: "/projects/project-photo-1.png", title: "Слемова хвиля", date: "23.06.2026", artSubCategory: "poetry", likes: 26, ...getCatalogAuthorById(110) },
  { id: 54, authorId: 110, image: "/projects/project-photo-2.png", title: "Поетична лабораторія", date: "25.06.2026", artSubCategory: "poetry", likes: 31, ...getCatalogAuthorById(110) },

  // prose
  { id: 55, authorId: 109, image: "/projects/project-photo-3.png", title: "Клубне читання", date: "27.06.2026", artSubCategory: "prose", likes: 25, ...getCatalogAuthorById(109) },
  { id: 56, authorId: 109, image: "/projects/project-photo-4.png", title: "Нова проза ІФ", date: "29.06.2026", artSubCategory: "prose", likes: 18, ...getCatalogAuthorById(109) },

  // graphics — Сергій Лаушкін
  {
    id: 57,
    authorId: 16,
    image: "/projects/project-photo-1.png",
    title: "Мистецтво допомоги - найсучасніше з мистецтв",
    date: "04.05.2026",
    artSubCategory: "graphics",
    likes: 31,
    pdfFile: "ID_Art UA. Laushkin UA Album.pdf",
    ...getCatalogAuthorById(16),
  },
];

export interface MyCatalogCard {
  id: number;
  image: string;
  title: string;
  likes: number;
}

export const getCatalogsByAuthorId = (authorId: number): Catalog[] =>
  catalogsData.filter((catalog) => catalog.authorId === authorId);

export const getMyCatalogsByAuthorId = (authorId: number): MyCatalogCard[] =>
  getCatalogsByAuthorId(authorId).map(({ id, image, title, likes }) => ({
    id,
    image,
    title,
    likes,
  }));

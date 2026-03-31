import { artistsData } from "./participantsData";

export interface Catalog {
  id: number;
  image: string;
  title: string;
  date: string;
  artSubCategory: string;
  likes: number;
  authorAvatar: string;
  authorName: string;
}

const artistById = new Map(artistsData.map((artist) => [artist.id, artist]));

const getCatalogAuthorById = (artistId: number) => {
  const artist = artistById.get(artistId);

  return {
    authorAvatar: artist?.artistPhoto ?? "",
    authorName: artist?.artistName ?? "",
  };
};

export const catalogsData: Catalog[] = [
  // painting
  { id: 1, image: "/projects/project-photo-1.png", title: "Промені на полотні", date: "12.01.2026", artSubCategory: "painting", likes: 17, ...getCatalogAuthorById(1) },
  { id: 2, image: "/projects/project-photo-2.png", title: "Абстрактні хмари", date: "18.01.2026", artSubCategory: "painting", likes: 29, ...getCatalogAuthorById(15) },

  // sculpture
  { id: 3, image: "/projects/project-photo-3.png", title: "«Пульс»", date: "25.01.2026", artSubCategory: "sculpture", likes: 17, ...getCatalogAuthorById(2) },
  { id: 4, image: "/projects/project-photo-4.png", title: "«Тиша»", date: "02.02.2026", artSubCategory: "sculpture", likes: 22, ...getCatalogAuthorById(1) },

  // graphics
  { id: 5, image: "/projects/project-photo-1.png", title: "Лінії міста", date: "09.02.2026", artSubCategory: "graphics", likes: 35, ...getCatalogAuthorById(3) },
  { id: 6, image: "/projects/project-photo-2.png", title: "Сонячний ритм", date: "16.02.2026", artSubCategory: "graphics", likes: 18, ...getCatalogAuthorById(2) },

  // art-photography
  { id: 7, image: "/projects/project-photo-3.png", title: "Відблиск", date: "23.02.2026", artSubCategory: "art-photography", likes: 17, ...getCatalogAuthorById(4) },
  { id: 8, image: "/projects/project-photo-4.png", title: "Нічна тінь", date: "01.03.2026", artSubCategory: "art-photography", likes: 26, ...getCatalogAuthorById(3) },

  // video-editing
  { id: 9, image: "/projects/project-photo-1.png", title: "Міські сполохи", date: "07.03.2026", artSubCategory: "video-editing", likes: 22, ...getCatalogAuthorById(5) },
  { id: 10, image: "/projects/project-photo-2.png", title: "Злам часу", date: "10.03.2026", artSubCategory: "video-editing", likes: 19, ...getCatalogAuthorById(4) },

  // cinema
  { id: 11, image: "/projects/project-photo-3.png", title: "Нічне місто", date: "14.03.2026", artSubCategory: "cinema", likes: 19, ...getCatalogAuthorById(6) },
  { id: 12, image: "/projects/project-photo-4.png", title: "Тиша за дверима", date: "18.03.2026", artSubCategory: "cinema", likes: 31, ...getCatalogAuthorById(5) },

  // ar
  { id: 13, image: "/projects/project-photo-1.png", title: "Голограми", date: "21.03.2026", artSubCategory: "ar", likes: 28, ...getCatalogAuthorById(7) },
  { id: 14, image: "/projects/project-photo-2.png", title: "Кольорова арка", date: "24.03.2026", artSubCategory: "ar", likes: 15, ...getCatalogAuthorById(6) },

  // directing
  { id: 15, image: "/projects/project-photo-3.png", title: "Театр руху", date: "27.03.2026", artSubCategory: "directing", likes: 31, ...getCatalogAuthorById(8) },
  { id: 16, image: "/projects/project-photo-4.png", title: "Сцени світла", date: "30.03.2026", artSubCategory: "directing", likes: 24, ...getCatalogAuthorById(7) },

  // acting
  { id: 17, image: "/projects/project-photo-1.png", title: "Відлуння", date: "02.04.2026", artSubCategory: "acting", likes: 15, ...getCatalogAuthorById(9) },
  { id: 18, image: "/projects/project-photo-2.png", title: "Шепіт", date: "05.04.2026", artSubCategory: "acting", likes: 28, ...getCatalogAuthorById(8) },

  // music
  { id: 19, image: "/projects/project-photo-3.png", title: "Промінь", date: "08.04.2026", artSubCategory: "music", likes: 24, ...getCatalogAuthorById(10) },
  { id: 20, image: "/projects/project-photo-4.png", title: "Сон у темряві", date: "11.04.2026", artSubCategory: "music", likes: 22, ...getCatalogAuthorById(9) },

  // choreography
  { id: 21, image: "/projects/project-photo-1.png", title: "Лінії тіла", date: "14.04.2026", artSubCategory: "choreography", likes: 18, ...getCatalogAuthorById(11) },
  { id: 22, image: "/projects/project-photo-2.png", title: "Оберт", date: "17.04.2026", artSubCategory: "choreography", likes: 33, ...getCatalogAuthorById(10) },

  // original-genre
  { id: 23, image: "/projects/project-photo-3.png", title: "Ехо простору", date: "20.04.2026", artSubCategory: "original-genre", likes: 26, ...getCatalogAuthorById(12) },
  { id: 24, image: "/projects/project-photo-4.png", title: "Квант ритму", date: "23.04.2026", artSubCategory: "original-genre", likes: 20, ...getCatalogAuthorById(11) },

  // poetry
  { id: 25, image: "/projects/project-photo-1.png", title: "Сонячна пауза", date: "26.04.2026", artSubCategory: "poetry", likes: 20, ...getCatalogAuthorById(13) },
  { id: 26, image: "/projects/project-photo-2.png", title: "Лист до вітру", date: "29.04.2026", artSubCategory: "poetry", likes: 29, ...getCatalogAuthorById(12) },

  // // prose
  // { id: 27, image: "/projects/project-photo-3.png", title: "Тінь на воді", artSubCategory: "prose", likes: 33, authorAvatar: "/artists/artist-photo-6.png", authorName: "Тарас Омельчук" },
  // { id: 28, image: "/projects/project-photo-4.png", title: "Зерно спогадів", artSubCategory: "prose", likes: 17, authorAvatar: "/artists/artist-photo-5.png", authorName: "Людмила Черненко" },
];

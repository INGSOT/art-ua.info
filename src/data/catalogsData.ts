export interface Catalog {
  id: number;
  image: string;
  title: string;
  artCategory: string;
  likes: number;
  authorAvatar: string;
  authorName: string;
}

export const catalogsData: Catalog[] = [
  // painting
  { id: 1, image: "/projects/project-photo-1.png", title: "Промені на полотні", artCategory: "painting", likes: 17, authorAvatar: "/artists/artist-photo-5.png", authorName: "Олена Кравець" },
  { id: 2, image: "/projects/project-photo-2.png", title: "Абстрактні хмари", artCategory: "painting", likes: 29, authorAvatar: "/artists/artist-photo-7.png", authorName: "Аліна Савчук" },

  // sculpture
  { id: 3, image: "/projects/project-photo-3.png", title: "«Пульс»", artCategory: "sculpture", likes: 17, authorAvatar: "/artists/artist-photo-6.png", authorName: "Максим Шевченко" },
  { id: 4, image: "/projects/project-photo-4.png", title: "«Тиша»", artCategory: "sculpture", likes: 22, authorAvatar: "/artists/artist-photo-5.png", authorName: "Олена Кравець" },

  // graphics
  { id: 5, image: "/projects/project-photo-1.png", title: "Лінії міста", artCategory: "graphics", likes: 35, authorAvatar: "/artists/artist-photo-7.png", authorName: "Ірина Мельник" },
  { id: 6, image: "/projects/project-photo-2.png", title: "Сонячний ритм", artCategory: "graphics", likes: 18, authorAvatar: "/artists/artist-photo-6.png", authorName: "Максим Шевченко" },

  // art-photography
  { id: 7, image: "/projects/project-photo-3.png", title: "Відблиск", artCategory: "art-photography", likes: 17, authorAvatar: "/artists/artist-photo-8.png", authorName: "Андрій Соколенко" },
  { id: 8, image: "/projects/project-photo-4.png", title: "Нічна тінь", artCategory: "art-photography", likes: 26, authorAvatar: "/artists/artist-photo-7.png", authorName: "Ірина Мельник" },

  // video-editing
  { id: 9, image: "/projects/project-photo-1.png", title: "Міські сполохи", artCategory: "video-editing", likes: 22, authorAvatar: "/artists/artist-photo-9.png", authorName: "Наталія Бондар" },
  { id: 10, image: "/projects/project-photo-2.png", title: "Злам часу", artCategory: "video-editing", likes: 19, authorAvatar: "/artists/artist-photo-8.png", authorName: "Андрій Соколенко" },

  // cinema
  { id: 11, image: "/projects/project-photo-3.png", title: "Нічне місто", artCategory: "cinema", likes: 19, authorAvatar: "/artists/artist-photo-10.png", authorName: "Дмитро Романюк" },
  { id: 12, image: "/projects/project-photo-4.png", title: "Тиша за дверима", artCategory: "cinema", likes: 31, authorAvatar: "/artists/artist-photo-9.png", authorName: "Наталія Бондар" },

  // ar
  { id: 13, image: "/projects/project-photo-1.png", title: "Голограми", artCategory: "ar", likes: 28, authorAvatar: "/artists/artist-photo-5.png", authorName: "Софія Ткаченко" },
  { id: 14, image: "/projects/project-photo-2.png", title: "Кольорова арка", artCategory: "ar", likes: 15, authorAvatar: "/artists/artist-photo-10.png", authorName: "Дмитро Романюк" },

  // directing
  { id: 15, image: "/projects/project-photo-3.png", title: "Театр руху", artCategory: "directing", likes: 31, authorAvatar: "/artists/artist-photo-6.png", authorName: "Юрій Коваленко" },
  { id: 16, image: "/projects/project-photo-4.png", title: "Сцени світла", artCategory: "directing", likes: 24, authorAvatar: "/artists/artist-photo-5.png", authorName: "Софія Ткаченко" },

  // acting
  { id: 17, image: "/projects/project-photo-1.png", title: "Відлуння", artCategory: "acting", likes: 15, authorAvatar: "/artists/artist-photo-7.png", authorName: "Марина Гончар" },
  { id: 18, image: "/projects/project-photo-2.png", title: "Шепіт", artCategory: "acting", likes: 28, authorAvatar: "/artists/artist-photo-6.png", authorName: "Юрій Коваленко" },

  // music
  { id: 19, image: "/projects/project-photo-3.png", title: "Промінь", artCategory: "music", likes: 24, authorAvatar: "/artists/artist-photo-8.png", authorName: "Віталій Лисенко" },
  { id: 20, image: "/projects/project-photo-4.png", title: "Сон у темряві", artCategory: "music", likes: 22, authorAvatar: "/artists/artist-photo-7.png", authorName: "Марина Гончар" },

  // choreography
  { id: 21, image: "/projects/project-photo-1.png", title: "Лінії тіла", artCategory: "choreography", likes: 18, authorAvatar: "/artists/artist-photo-9.png", authorName: "Катерина Дорошенко" },
  { id: 22, image: "/projects/project-photo-2.png", title: "Оберт", artCategory: "choreography", likes: 33, authorAvatar: "/artists/artist-photo-8.png", authorName: "Віталій Лисенко" },

  // original-genre
  { id: 23, image: "/projects/project-photo-3.png", title: "Ехо простору", artCategory: "original-genre", likes: 26, authorAvatar: "/artists/artist-photo-10.png", authorName: "Павло Яценко" },
  { id: 24, image: "/projects/project-photo-4.png", title: "Квант ритму", artCategory: "original-genre", likes: 20, authorAvatar: "/artists/artist-photo-9.png", authorName: "Катерина Дорошенко" },

  // poetry
  { id: 25, image: "/projects/project-photo-1.png", title: "Сонячна пауза", artCategory: "poetry", likes: 20, authorAvatar: "/artists/artist-photo-5.png", authorName: "Людмила Черненко" },
  { id: 26, image: "/projects/project-photo-2.png", title: "Лист до вітру", artCategory: "poetry", likes: 29, authorAvatar: "/artists/artist-photo-10.png", authorName: "Павло Яценко" },

  // prose
  { id: 27, image: "/projects/project-photo-3.png", title: "Тінь на воді", artCategory: "prose", likes: 33, authorAvatar: "/artists/artist-photo-6.png", authorName: "Тарас Омельчук" },
  { id: 28, image: "/projects/project-photo-4.png", title: "Зерно спогадів", artCategory: "prose", likes: 17, authorAvatar: "/artists/artist-photo-5.png", authorName: "Людмила Черненко" },
];

export interface Catalog {
  id: number;
  image: string;
  title: string;
  date: string;
  artCategory: string;
  likes: number;
  authorAvatar: string;
  authorName: string;
}

export const catalogsData: Catalog[] = [
  // painting
  { id: 1, image: "/projects/project-photo-1.png", title: "Промені на полотні", date: "12.01.2026", artCategory: "painting", likes: 17, authorAvatar: "/artists/artist-photo-5.png", authorName: "Олена Кравець" },
  { id: 2, image: "/projects/project-photo-2.png", title: "Абстрактні хмари", date: "18.01.2026", artCategory: "painting", likes: 29, authorAvatar: "/artists/artist-photo-7.png", authorName: "Аліна Савчук" },

  // sculpture
  { id: 3, image: "/projects/project-photo-3.png", title: "«Пульс»", date: "25.01.2026", artCategory: "sculpture", likes: 17, authorAvatar: "/artists/artist-photo-6.png", authorName: "Максим Шевченко" },
  { id: 4, image: "/projects/project-photo-4.png", title: "«Тиша»", date: "02.02.2026", artCategory: "sculpture", likes: 22, authorAvatar: "/artists/artist-photo-5.png", authorName: "Олена Кравець" },

  // graphics
  { id: 5, image: "/projects/project-photo-1.png", title: "Лінії міста", date: "09.02.2026", artCategory: "graphics", likes: 35, authorAvatar: "/artists/artist-photo-7.png", authorName: "Ірина Мельник" },
  { id: 6, image: "/projects/project-photo-2.png", title: "Сонячний ритм", date: "16.02.2026", artCategory: "graphics", likes: 18, authorAvatar: "/artists/artist-photo-6.png", authorName: "Максим Шевченко" },

  // art-photography
  { id: 7, image: "/projects/project-photo-3.png", title: "Відблиск", date: "23.02.2026", artCategory: "art-photography", likes: 17, authorAvatar: "/artists/artist-photo-8.png", authorName: "Андрій Соколенко" },
  { id: 8, image: "/projects/project-photo-4.png", title: "Нічна тінь", date: "01.03.2026", artCategory: "art-photography", likes: 26, authorAvatar: "/artists/artist-photo-7.png", authorName: "Ірина Мельник" },

  // video-editing
  { id: 9, image: "/projects/project-photo-1.png", title: "Міські сполохи", date: "07.03.2026", artCategory: "video-editing", likes: 22, authorAvatar: "/artists/artist-photo-9.png", authorName: "Наталія Бондар" },
  { id: 10, image: "/projects/project-photo-2.png", title: "Злам часу", date: "10.03.2026", artCategory: "video-editing", likes: 19, authorAvatar: "/artists/artist-photo-8.png", authorName: "Андрій Соколенко" },

  // cinema
  { id: 11, image: "/projects/project-photo-3.png", title: "Нічне місто", date: "14.03.2026", artCategory: "cinema", likes: 19, authorAvatar: "/artists/artist-photo-10.png", authorName: "Дмитро Романюк" },
  { id: 12, image: "/projects/project-photo-4.png", title: "Тиша за дверима", date: "18.03.2026", artCategory: "cinema", likes: 31, authorAvatar: "/artists/artist-photo-9.png", authorName: "Наталія Бондар" },

  // ar
  { id: 13, image: "/projects/project-photo-1.png", title: "Голограми", date: "21.03.2026", artCategory: "ar", likes: 28, authorAvatar: "/artists/artist-photo-5.png", authorName: "Софія Ткаченко" },
  { id: 14, image: "/projects/project-photo-2.png", title: "Кольорова арка", date: "24.03.2026", artCategory: "ar", likes: 15, authorAvatar: "/artists/artist-photo-10.png", authorName: "Дмитро Романюк" },

  // directing
  { id: 15, image: "/projects/project-photo-3.png", title: "Театр руху", date: "27.03.2026", artCategory: "directing", likes: 31, authorAvatar: "/artists/artist-photo-6.png", authorName: "Юрій Коваленко" },
  { id: 16, image: "/projects/project-photo-4.png", title: "Сцени світла", date: "30.03.2026", artCategory: "directing", likes: 24, authorAvatar: "/artists/artist-photo-5.png", authorName: "Софія Ткаченко" },

  // acting
  { id: 17, image: "/projects/project-photo-1.png", title: "Відлуння", date: "02.04.2026", artCategory: "acting", likes: 15, authorAvatar: "/artists/artist-photo-7.png", authorName: "Марина Гончар" },
  { id: 18, image: "/projects/project-photo-2.png", title: "Шепіт", date: "05.04.2026", artCategory: "acting", likes: 28, authorAvatar: "/artists/artist-photo-6.png", authorName: "Юрій Коваленко" },

  // music
  { id: 19, image: "/projects/project-photo-3.png", title: "Промінь", date: "08.04.2026", artCategory: "music", likes: 24, authorAvatar: "/artists/artist-photo-8.png", authorName: "Віталій Лисенко" },
  { id: 20, image: "/projects/project-photo-4.png", title: "Сон у темряві", date: "11.04.2026", artCategory: "music", likes: 22, authorAvatar: "/artists/artist-photo-7.png", authorName: "Марина Гончар" },

  // choreography
  { id: 21, image: "/projects/project-photo-1.png", title: "Лінії тіла", date: "14.04.2026", artCategory: "choreography", likes: 18, authorAvatar: "/artists/artist-photo-9.png", authorName: "Катерина Дорошенко" },
  { id: 22, image: "/projects/project-photo-2.png", title: "Оберт", date: "17.04.2026", artCategory: "choreography", likes: 33, authorAvatar: "/artists/artist-photo-8.png", authorName: "Віталій Лисенко" },

  // original-genre
  { id: 23, image: "/projects/project-photo-3.png", title: "Ехо простору", date: "20.04.2026", artCategory: "original-genre", likes: 26, authorAvatar: "/artists/artist-photo-10.png", authorName: "Павло Яценко" },
  { id: 24, image: "/projects/project-photo-4.png", title: "Квант ритму", date: "23.04.2026", artCategory: "original-genre", likes: 20, authorAvatar: "/artists/artist-photo-9.png", authorName: "Катерина Дорошенко" },

  // poetry
  { id: 25, image: "/projects/project-photo-1.png", title: "Сонячна пауза", date: "26.04.2026", artCategory: "poetry", likes: 20, authorAvatar: "/artists/artist-photo-5.png", authorName: "Людмила Черненко" },
  { id: 26, image: "/projects/project-photo-2.png", title: "Лист до вітру", date: "29.04.2026", artCategory: "poetry", likes: 29, authorAvatar: "/artists/artist-photo-10.png", authorName: "Павло Яценко" },

  // // prose
  // { id: 27, image: "/projects/project-photo-3.png", title: "Тінь на воді", artCategory: "prose", likes: 33, authorAvatar: "/artists/artist-photo-6.png", authorName: "Тарас Омельчук" },
  // { id: 28, image: "/projects/project-photo-4.png", title: "Зерно спогадів", artCategory: "prose", likes: 17, authorAvatar: "/artists/artist-photo-5.png", authorName: "Людмила Черненко" },
];

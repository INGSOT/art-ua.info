export interface Project {
  id: number;
  image: string;
  title: string;
  date: string;
  artCategory: string;
  likes: number;
  authorAvatar: string;
  authorName: string;
}

export const projectsData: Project[] = [
  { id: 1, image: "/projects/project-photo-1.png", title: "Ранкове світло", date: "12.01.2026", artCategory: "painting", likes: 17, authorAvatar: "/artists/artist-photo-5.png", authorName: "Олена Кравець" },
  { id: 2, image: "/projects/project-photo-2.png", title: "Політ кольору", date: "18.01.2026", artCategory: "painting", likes: 17, authorAvatar: "/artists/artist-photo-6.png", authorName: "Максим Шевченко" },
  { id: 3, image: "/projects/project-photo-3.png", title: "«Камінний подих»", date: "25.01.2026", artCategory: "sculpture", likes: 35, authorAvatar: "/artists/artist-photo-7.png", authorName: "Ірина Мельник" },
  { id: 4, image: "/projects/project-photo-4.png", title: "«Форма тиші»", date: "02.02.2026", artCategory: "sculpture", likes: 17, authorAvatar: "/artists/artist-photo-8.png", authorName: "Андрій Соколенко" },
  { id: 5, image: "/projects/project-photo-1.png", title: "Контур міста", date: "09.02.2026", artCategory: "graphics", likes: 22, authorAvatar: "/artists/artist-photo-9.png", authorName: "Наталія Бондар" },
  { id: 6, image: "/projects/project-photo-2.png", title: "Графічний імпульс", date: "16.02.2026", artCategory: "graphics", likes: 19, authorAvatar: "/artists/artist-photo-10.png", authorName: "Дмитро Романюк" },
  { id: 7, image: "/projects/project-photo-3.png", title: "Світло в об'єктиві", date: "23.02.2026", artCategory: "art-photography", likes: 28, authorAvatar: "/artists/artist-photo-5.png", authorName: "Софія Ткаченко" },
  { id: 8, image: "/projects/project-photo-4.png", title: "Мовчання кадру", date: "01.03.2026", artCategory: "art-photography", likes: 31, authorAvatar: "/artists/artist-photo-6.png", authorName: "Юрій Коваленко" },
  { id: 9, image: "/projects/project-photo-1.png", title: "Монтаж ритму", date: "07.03.2026", artCategory: "video-editing", likes: 15, authorAvatar: "/artists/artist-photo-7.png", authorName: "Марина Гончар" },
  { id: 10, image: "/projects/project-photo-2.png", title: "Кадр за кадром", date: "10.03.2026", artCategory: "video-editing", likes: 24, authorAvatar: "/artists/artist-photo-8.png", authorName: "Віталій Лисенко" },
  { id: 11, image: "/projects/project-photo-3.png", title: "Після заходу", date: "14.03.2026", artCategory: "cinema", likes: 18, authorAvatar: "/artists/artist-photo-9.png", authorName: "Катерина Дорошенко" },
  { id: 12, image: "/projects/project-photo-4.png", title: "Остання сцена", date: "18.03.2026", artCategory: "cinema", likes: 26, authorAvatar: "/artists/artist-photo-10.png", authorName: "Павло Яценко" },
  { id: 13, image: "/projects/project-photo-1.png", title: "AR-міраж", date: "21.03.2026", artCategory: "ar", likes: 20, authorAvatar: "/artists/artist-photo-5.png", authorName: "Людмила Черненко" },
  { id: 14, image: "/projects/project-photo-2.png", title: "Доповнена реальність: Портал", date: "24.03.2026", artCategory: "ar", likes: 33, authorAvatar: "/artists/artist-photo-6.png", authorName: "Тарас Омельчук" },
  { id: 15, image: "/projects/project-photo-3.png", title: "Пластика сцени", date: "27.03.2026", artCategory: "directing", likes: 29, authorAvatar: "/artists/artist-photo-7.png", authorName: "Аліна Савчук" },
];

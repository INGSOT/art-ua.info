import { artistsData } from "./artistsData";

export interface Project {
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

const getProjectAuthor = (projectId: number) => {
  const artist = artistById.get(projectId);

  return {
    authorAvatar: artist?.artistPhoto ?? "",
    authorName: artist?.artistName ?? "",
  };
};

export const projectsData: Project[] = [
  { id: 1, image: "/projects/project-photo-1.png", title: "Ранкове світло", date: "12.01.2026", artSubCategory: "painting", likes: 17, ...getProjectAuthor(1) },
  { id: 2, image: "/projects/project-photo-2.png", title: "Політ кольору", date: "18.01.2026", artSubCategory: "painting", likes: 17, ...getProjectAuthor(2) },
  { id: 3, image: "/projects/project-photo-3.png", title: "«Камінний подих»", date: "25.01.2026", artSubCategory: "sculpture", likes: 35, ...getProjectAuthor(3) },
  { id: 4, image: "/projects/project-photo-4.png", title: "«Форма тиші»", date: "02.02.2026", artSubCategory: "sculpture", likes: 17, ...getProjectAuthor(4) },
  { id: 5, image: "/projects/project-photo-1.png", title: "Контур міста", date: "09.02.2026", artSubCategory: "graphics", likes: 22, ...getProjectAuthor(5) },
  { id: 6, image: "/projects/project-photo-2.png", title: "Графічний імпульс", date: "16.02.2026", artSubCategory: "graphics", likes: 19, ...getProjectAuthor(6) },
  { id: 7, image: "/projects/project-photo-3.png", title: "Світло в об'єктиві", date: "23.02.2026", artSubCategory: "art-photography", likes: 28, ...getProjectAuthor(7) },
  { id: 8, image: "/projects/project-photo-4.png", title: "Мовчання кадру", date: "01.03.2026", artSubCategory: "art-photography", likes: 31, ...getProjectAuthor(8) },
  { id: 9, image: "/projects/project-photo-1.png", title: "Монтаж ритму", date: "07.03.2026", artSubCategory: "video-editing", likes: 15, ...getProjectAuthor(9) },
  { id: 10, image: "/projects/project-photo-2.png", title: "Кадр за кадром", date: "10.03.2026", artSubCategory: "video-editing", likes: 24, ...getProjectAuthor(10) },
  { id: 11, image: "/projects/project-photo-3.png", title: "Після заходу", date: "14.03.2026", artSubCategory: "cinema", likes: 18, ...getProjectAuthor(11) },
  { id: 12, image: "/projects/project-photo-4.png", title: "Остання сцена", date: "18.03.2026", artSubCategory: "cinema", likes: 26, ...getProjectAuthor(12) },
  { id: 13, image: "/projects/project-photo-1.png", title: "AR-міраж", date: "21.03.2026", artSubCategory: "ar", likes: 20, ...getProjectAuthor(13) },
  { id: 14, image: "/projects/project-photo-2.png", title: "Доповнена реальність: Портал", date: "24.03.2026", artSubCategory: "ar", likes: 33, ...getProjectAuthor(14) },
  { id: 15, image: "/projects/project-photo-3.png", title: "Пластика сцени", date: "27.03.2026", artSubCategory: "directing", likes: 29, ...getProjectAuthor(15) },
];

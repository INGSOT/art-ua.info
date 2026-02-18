// About Me
export interface Team {
  name: string;
  icon: string;
}

export interface AboutMeButton {
  id: string;
  label: string;
}

export interface AboutMeData {
  name: string;
  description: string;
  avatar: string;
  teams: Team[];
  buttons: AboutMeButton[];
}

export const aboutMeData: AboutMeData = {
  name: "Ім'я Прізвище",
  description: "Художник, скульптор, архітектор, режисер, співак",
  avatar: "/image-13.png",
  teams: [
    { name: "Назва Команди", icon: "/teams/team-photo-1.png" },
    { name: "Назва Команди", icon: "/teams/team-photo-2.png" },
    { name: "Довга назва команди", icon: "/teams/team-photo-3.png" },
    { name: "Назва Команди", icon: "/teams/team-photo-4.png" },
  ],
  buttons: [
    { id: "save-art", label: "save-art.in.ua/username" },
    { id: "art-ua", label: "art-ua.info/username" },
  ],
};

// My Projects
export interface MyProject {
  id: number;
  image: string;
  title: string;
  likes: number;
}

export interface ProjectFilterButton {
  id: string;
  text: string;
}

export const myProjects: MyProject[] = [
  // { id: 1, image: "/projects/project-photo-1.png", title: "Назва роботи", likes: 17 },
  // { id: 2, image: "/projects/project-photo-2.png", title: "Назва роботи", likes: 17 },
  // { id: 3, image: "/projects/project-photo-3.png", title: "Назва роботи", likes: 35 },
  // { id: 4, image: "/projects/project-photo-4.png", title: "Назва роботи", likes: 17 },
];

export const projectFilterButtons: ProjectFilterButton[] = [
  { id: "all", text: "Усі категорії" },
  { id: "newest", text: "Новіші" },
];

export const projectEmptyState = {
  message: "Тут ще нічого немає",
  subMessage: "Додайте свою першу роботу.",
  createButtonText: "Створити",
};

export const profileTexts = {
  editProfileButton: "Редагувати профіль",
};

// My Catalogs
export interface MyCatalog {
  id: number;
  image: string;
  title: string;
  likes: number;
}

export const myCatalogs: MyCatalog[] = [
  { id: 1, image: "/gallery/abstractionism.png", title: "Абстракціонізм", likes: 17 },
  { id: 2, image: "/gallery/autumn.png", title: "Осінь", likes: 24 },
  { id: 3, image: "/gallery/big_lebovski.png", title: "Великий Лебовскі", likes: 35 },
];

export interface CatalogsTexts {
  addCatalogButton: string;
  addCatalogButtonIconAlt: string;
  tooltip: string;
  deleteIconAlt: string;
  likeIconAlt: string;
}

export const catalogsTexts: CatalogsTexts = {
  addCatalogButton: "Додати каталог",
  addCatalogButtonIconAlt: "Plus",
  tooltip: "Зробити основним (для відображення на головній та сторінці митців).",
  deleteIconAlt: "Delete",
  likeIconAlt: "Like",
};

// Add Catalog Modal
export interface AddCatalogTexts {
  title: string;
  closeAlt: string;
  imageUploadText: string;
  imageRemoveAlt: string;
  catalogUploadText: string;
  catalogRemoveAlt: string;
  uploadIconAlt: string;
  addButton: string;
}

export const addCatalogTexts: AddCatalogTexts = {
  title: "Новий каталог",
  closeAlt: "Close",
  imageUploadText: "Додайте обкладинку.\nДобре будуть виглядати зображення зі співвідношенням 4х3.",
  imageRemoveAlt: "Remove",
  catalogUploadText: "Завантажте каталог",
  catalogRemoveAlt: "Remove catalog",
  uploadIconAlt: "Upload",
  addButton: "Додати",
};

// Delete Catalog Modal
export interface DeleteCatalogTexts {
  title: string;
  closeAlt: string;
  description: string;
  deleteButton: string;
  cancelButton: string;
}

export const deleteCatalogTexts: DeleteCatalogTexts = {
  title: "Ви видаляєте каталог",
  closeAlt: "Close",
  description: "Ви впевнені, що хочете видалити цей каталог?\nЦю дію неможливо буде відмінити.",
  deleteButton: "Так, видалити",
  cancelButton: "Ні, залишити",
};

// My Services
export interface MyService {
  id: number;
  image: string;
  buttonLabel: string;
  title: string;
}

export const myServices: MyService[] = [
  {
    id: 1,
    image: "/gallery/autumn.png",
    buttonLabel: "Від 100 000 ₴",
    title: "Назва послуги на декілька слів. Не більше ніж на два рядки. Кра...",
  },
  {
    id: 2,
    image: "/gallery/rain.png",
    buttonLabel: "Ціна договірна",
    title: "Назва послуги на декілька слів. Не більше ніж на два рядки. Кра...",
  },
  {
    id: 3,
    image: "/gallery/ship.png",
    buttonLabel: "Від ₴ 100 000 000",
    title: "Назва послуги на декілька слів. Не більше ніж на два рядки. Кра...",
  },
];

export interface ServicesTexts {
  addServiceButton: string;
  editServiceButton: string;
}

export const servicesTexts: ServicesTexts = {
  addServiceButton: "Додати послуги",
  editServiceButton: "Редагувати послугу",
};

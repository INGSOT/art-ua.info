export interface LanguageButton {
  id: string;
  label: string;
  icon: string;
}

export interface ProjectOwner {
  id: string;
  type: 'author' | 'team';
  name: string;
  avatar: string;
}

export interface ProjectCharacteristic {
  id: string;
  name: string;
  description: string;
}

export interface ArtSubcategory {
  id: string;
  label: string;
}

export interface ArtCategory {
  id: string;
  title: string;
  subcategories: ArtSubcategory[];
}

export const languageButtons: LanguageButton[] = [
  { id: 'ua', label: 'Українська', icon: '/ua.svg' },
  { id: 'en', label: 'English', icon: '/en.svg' },
];

export const artCategories: ArtCategory[] = [
  {
    id: 'stage-art',
    title: 'Сценічне мистецтво',
    subcategories: [
      { id: 'directing', label: 'Режисура' },
      { id: 'acting', label: 'Акторське мистецтво' },
      { id: 'music', label: 'Музичне мистецтво' },
      { id: 'choreography', label: 'Хореографічне мистецтво' },
      { id: 'original-genre', label: 'Оригінальний жанр' },
    ]
  },
  {
    id: 'visual-art',
    title: 'Візуальне мистецтво',
    subcategories: [
      { id: 'art-photography', label: 'Художня фотографія' },
      { id: 'video-editing', label: 'Відеозйомка та монтаж' },
      { id: 'cinema', label: 'Повнометражний кінематограф' },
      { id: 'ar', label: 'Доповнена реальність' },
    ]
  },
  {
    id: 'fine-art',
    title: 'Образотворче мистецтво',
    subcategories: [
      { id: 'painting', label: 'Живопис' },
      { id: 'sculpture', label: 'Скульптура' },
      { id: 'graphics', label: 'Графіка' },
    ]
  },
  {
    id: 'literature',
    title: 'Література',
    subcategories: [
      { id: 'poetry', label: 'Поезія' },
      { id: 'prose', label: 'Проза' },
    ]
  }
];

export const newProjectTexts = {
  title: 'Новий проект',
  ownerQuestion: 'Хто буде власником проекту',
  projectNamePlaceholder: 'Вкажіть назву проекту',
  projectNamePlaceholderEn: 'Specify the project name',
  artFieldButton: 'Оберіть галузь мистецтва',
  artFieldModalTitle: 'Оберіть галузь мистецтва',
  coverUploadText: 'Додайте обкладинку',
  workUploadText: 'Додайте роботу',
  tagsLabel: 'Додайте теги для зручності пошуку',
  tagsPlaceholder: 'Додайте теги',
  tagsPlaceholderEn: 'Add tags',
  tagsHint: 'Поле не є обов’язковим.',
  characteristicsTitle: 'Характеристики проекту',
  characteristicsDescription: `Таблиця характеристик проєкту.
Якщо ви малюєте картину — якого розміру вона буде? Знімаєте фільм — хто напише сценарій?
Розділ не є обов'язковим.`,
  characteristicNameLabel: 'Назва',
  characteristicDescLabel: 'Опис',
  characteristicNamePlaceholder: 'Наприклад, довжина фільму',
  characteristicNamePlaceholderEn: 'For example, film lenght',
  characteristicDescPlaceholder: 'Наприклад, 90 хв.',
  characteristicDescPlaceholderEn: 'For example, 90 min.',
  addBlockButton: 'Додати блок',
  soldProjectDescription: 'Вкажіть, якщо ваш проєкт вже був проданий через art-ua.com чи будь-яку іншу платформу.',
  soldProjectLabel: 'Проект проданий',
  acceptTermsLabel: 'Я приймаю умови використання платформи',
  publicationNotice: 'Проєкт також буде опубліковано у вашому профілі на art-ua.com',
  deleteButton: 'Видалити',
  saveDraftButton: 'Зберегти чернетку',
  publishButton: 'Опублікувати',
  addCoverTitle: 'Додайте обкладинку проєкту',
  addCoverUploadText: 'Додайте зображення.\nДобре будуть виглядати зі співвідношенням 4х3.',
  addCoverButton: 'Додати',
  addWorkTitle: 'Додати роботу',
  addWorkImageButton: 'Зображення',
  addWorkGalleryButton: 'Галерею зображень',
  addWorkLinkButton: 'Посилання (YouTube, Vimeo, Issuu)',
  addBlockTitle: 'Додати блок',
  addBlockTitleButton: 'Заголовок',
  addBlockParagraphButton: 'Абзац тексту',
  addBlockImageButton: 'Зображення',
  addBlockLinkButton: 'Посилання (YouTube, Vimeo, Issuu)',
  addTitleModalTitle: 'Додати заголовок',
  addTitleLabelUa: 'Впишіть заголовок',
  addTitleLabelEn: 'Enter the heading',
  addTitlePlaceholderUa: 'Наприклад, опис проєкту',
  addTitlePlaceholderEn: 'For example, Project Description',
  addTitleButton: 'Додати',
  addParagraphModalTitle: 'Додати абзац тексту',
  addParagraphLabelUa: 'Впишіть текст',
  addParagraphLabelEn: 'Enter the text',
  addParagraphPlaceholderUa: 'Наприклад, розкажіть розгорнуто про проєкт',
  addParagraphPlaceholderEn: 'For example, tell us more about the project',
  addParagraphButton: 'Додати',
  addImageModalTitle: 'Додати зображення',
  addLinkModalTitle: 'Додати посилання',
  addLinkLabel: 'Вставте посилання',
  addLinkPlaceholder: 'https://...',
  addLinkButton: 'Додати',
  projectNameLabel: 'Назва проекту',
  addCoverText: 'Додайте обкладинку',
  addCoverOptional: '(Необов\'язково)',
  addImageGalleryTitle: 'Додайте галерею зображень',
  addImageGallerySubtitle: 'Добре будуть виглядати зображення зі співвідношенням 4x3',
  addImageGalleryUploadButton: 'Завантажте зображення',
  addImageGalleryHint: 'До 10 зображень. Формати .jpg, .jpeg, .png та .webp до 15 мб кожна.',
  addImageGalleryAddButton: 'Додати',
};

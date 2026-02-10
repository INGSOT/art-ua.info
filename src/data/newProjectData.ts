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

export const languageButtons: LanguageButton[] = [
  { id: 'ua', label: 'Українська', icon: '/ua.svg' },
  { id: 'en', label: 'English', icon: '/en.svg' },
];

export const newProjectTexts = {
  title: 'Новий проект',
  ownerQuestion: 'Хто буде власником проекту',
  projectNamePlaceholder: 'Вкажіть назву проекту',
  projectNamePlaceholderEn: 'Specify the project name',
  artFieldButton: 'Оберіть галузь мистецтва',
  coverUploadText: 'Додайте обкладинку',
  workUploadText: 'Додайте роботу',
  tagsLabel: 'Додайте теги',
  tagsPlaceholder: 'Через кому, наприклад: картина, масло, пейзаж',
  tagsPlaceholderEn: 'Comma separated, for example: painting, oil, landscape',
  tagsHint: 'По цих тегах інші користувачі зможуть знайти вашу роботу.',
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
};

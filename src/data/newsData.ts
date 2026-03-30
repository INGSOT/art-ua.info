export interface News {
  id: number;
  image: string;
  title: string;
  date: string;
  category: "Новини" | "Події";
}

export const newsData: News[] = [
  { id: 1, image: "/news/news-image-1.png", title: "Виставка сучасного мистецтва відкриється вже цими вихідними", date: "12.01.2026", category: "Новини" },
  { id: 2, image: "/news/news-image-2.png", title: "Публічна лекція про роль культури в міських трансформаціях", date: "11.01.2026", category: "Події" },
  { id: 3, image: "/news/news-image-3.png", title: "Стартував прийом заявок на участь у творчій резиденції", date: "10.01.2026", category: "Новини" },
  { id: 4, image: "/news/news-image-4.png", title: "Оновлено програму зимових подій у галерейному просторі", date: "09.01.2026", category: "Новини" },
  { id: 5, image: "/news/news-image-5.jpg", title: "Учасники проєкту представили серію нових мистецьких робіт", date: "08.01.2026", category: "Новини" },
  { id: 6, image: "/news/news-image-6.png", title: "Дискусія з кураторками: як народжуються виставкові концепції", date: "07.01.2026", category: "Події" },
  { id: 7, image: "/news/news-image-7.png", title: "Майстерня для молодих митців відбудеться у форматі open call", date: "06.01.2026", category: "Події" },
  { id: 8, image: "/news/news-image-8.png", title: "Вечір перформансу та музики об’єднає художників з різних міст", date: "05.01.2026", category: "Події" },
  { id: 9, image: "/news/news-image-9.png", title: "Екскурсія експозицією з авторськими коментарями кураторської групи", date: "04.01.2026", category: "Події" },
  { id: 10, image: "/news/news-image-1.png", title: "Творча зустріч про нові практики взаємодії мистецтва й громади", date: "03.01.2026", category: "Події" },
  { id: 11, image: "/news/news-image-2.png", title: "Прем’єра документального відео про роботу команди проєкту", date: "02.01.2026", category: "Події" },
  { id: 12, image: "/news/news-image-3.png", title: "Святкова програма подій на початок року: розклад і анонси", date: "01.01.2026", category: "Події" },
  { id: 13, image: "/news/news-image-4.png", title: "Підсумки року: найяскравіші виставки та ініціативи спільноти", date: "31.12.2025", category: "Події" },
  { id: 14, image: "/news/news-image-5.jpg", title: "Фандрейзинг-івент на підтримку нових культурних проєктів", date: "30.12.2025", category: "Події" },
  { id: 15, image: "/news/news-image-6.png", title: "Онлайн-зустріч з митцями: питання, відповіді та живе спілкування", date: "29.12.2025", category: "Події" },
];

export interface ArticleContent {
  category: string;
  date: string;
  title: string;
  mainImage: string;
  textBlocks: {
    paragraphs: string[];
    image?: string;
  }[];
}

export interface SocialLink {
  name: string;
  url: string;
  icon: string;
}

export const articleData: ArticleContent = {
  category: "Новини",
  date: "12.01.25",
  title: "Заголовок новини або події",
  mainImage: "/news/news-image-4.png",
  textBlocks: [
    {
      paragraphs: [
        "Текст.",
        "Культурна спадщина України в контексті нових історичних подій набула особливої актуальності та нових змістів.",
        "Сьогодні образотворче мистецтво у фарбах на холсті відображає не просто сюжети чи метафори, а небувалий у сучасній історії злам епох. Художники фіксують не тільки події, а ще й глибину емоційно-почуттєвого фону, який неможливо передати на словах та в стрічці новин. Це - новітнє мистецтво, сучасне, переосмислене, глибинне, на віки.",
        "Саме зараз настає його час - аби уберегти наступні покоління від руїн, транслюючи біль крізь художні образи.",
      ],
      image: "/news/news-image-10.png",
    },
    {
      paragraphs: [
        "Текст.",
        "Культурна спадщина України в контексті нових історичних подій набула особливої актуальності та нових змістів.",
        "Сьогодні образотворче мистецтво у фарбах на холсті відображає не просто сюжети чи метафори, а небувалий у сучасній історії злам епох. Художники фіксують не тільки події, а ще й глибину емоційно-почуттєвого фону, який неможливо передати на словах та в стрічці новин. Це - новітнє мистецтво, сучасне, переосмислене, глибинне, на віки.",
        "Саме зараз настає його час - аби уберегти наступні покоління від руїн, транслюючи біль крізь художні образи.",
      ],
    },
  ],
};

export const socialLinks: SocialLink[] = [
  {
    name: "DeviantArt",
    url: "",
    icon: "/socials/deviantart_yellow.svg",
  },
  {
    name: "Facebook",
    url: "https://facebook.com",
    icon: "/socials/facebook_yellow.svg",
  },
  {
    name: "X (Twitter)",
    url: "https://twitter.com",
    icon: "/socials/x_yellow.svg",
  },
  {
    name: "Pinterest",
    url: "https://pinterest.com",
    icon: "/socials/pinterest_yellow.svg",
  },
  {
    name: "LinkedIn",
    url: "https://linkedin.com",
    icon: "/socials/linked_in_yellow.svg",
  },
];

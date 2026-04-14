import { artistsData } from "./artistsData";
import { getTeamById, teamData } from "./teamData";

export type CurrencyCode = "UAH" | "USD" | "EUR";
export type ServicePerformerType = "artist" | "team";

export interface ServiceItemData {
    id: number;
    authorId?: number;
    authorName: string;
    authorAvatar: string;
    performerType: ServicePerformerType;
    serviceImage: string;
    title: string;
    slug: string;
    description: string;
    artSubCategory: string;
    location: string;
    price?: number;
    currency?: CurrencyCode;
    priceNegotiable: boolean;
    options: ServiceOption[];
}

export interface ServiceOption {
    id: string;
    label: string;
}

export interface ServiceFormField {
    id: string;
    label: string;
    placeholder: string;
    type: "text" | "email" | "tel" | "textarea";
    rows?: number;
}

export interface ServicePageData {
    photo: string;
    breadcrumb: {
        authorName: string;
        section: string;
    };
    title: string;
    priceLabel: string;
    description: string[];
    options: ServiceOption[];
    formFields: ServiceFormField[];
    submitButtonLabel: string;
}

const artistById = new Map(artistsData.map((artist) => [artist.id, artist]));

const teamServiceLegacyKeyToProfileId: Record<number, string> = Object.fromEntries(
    teamData.map((team, index) => [index + 1, team.id] as const)
);

const getServiceAuthor = (artistId: number) => {
    const artist = artistById.get(artistId);

    return {
        authorId: artistId,
        authorName: artist?.artistName ?? "",
        authorAvatar: artist?.artistPhoto ?? "",
        performerType: "artist" as const,
    };
};

const getTeamServiceAuthor = (legacyTeamKey: number) => {
    const profileId = teamServiceLegacyKeyToProfileId[legacyTeamKey];
    const team = getTeamById(profileId);

    return {
        authorName: team.name,
        authorAvatar: team.avatar,
        performerType: "team" as const,
    };
};

const SERVICE_FORM_FIELDS: ServiceFormField[] = [
    {
        id: "name",
        label: "Як до вас звертатись",
        placeholder: "Ваше ім'я та прізвище",
        type: "text",
    },
    {
        id: "email",
        label: "Електронна пошта",
        placeholder: "Вкажіть адресу електронної пошти",
        type: "email",
    },
    {
        id: "phone",
        label: "Телефон",
        placeholder: "Вкажіть номер телефону",
        type: "tel",
    },
    {
        id: "message",
        label: "Повідомлення",
        placeholder: "Ваше повідомлення",
        type: "textarea",
        rows: 5,
    },
];

export const servicesData: ServiceItemData[] = [
    // painting
    {
        id: 1,
        ...getServiceAuthor(1),
        serviceImage: "/services.jpg",
        title: "Живопис на замовлення",
        slug: "zhyvopys-na-zamovlennya",
        description: "Створюю авторські картини на замовлення для дому, офісу або подарунка. Працюю з вашою ідеєю, референсами та палітрою інтер'єру, щоб полотно виглядало органічно саме у вашому просторі. Перед фінальним етапом погоджую ескіз і кольорове рішення.",
        artSubCategory: "painting",
        location: "Львів",
        priceNegotiable: true,
        options: [
            { id: "opt-1-sketch", label: "Ескіз + підбір палітри" },
            { id: "opt-1-canvas", label: "Полотно 60x80 см" },
            { id: "opt-1-framing", label: "Оформлення в раму" },
        ],
    },
    {
        id: 2,
        ...getServiceAuthor(2),
        serviceImage: "/services.jpg",
        title: "Портрети олійними фарбами",
        slug: "portrety-oliynymy-farbamy",
        description: "Пишу портрети олійними фарбами у класичному або сучасному стилі. Можливе виконання за фото, із попереднім узгодженням композиції, фону та настрою роботи. У результаті ви отримуєте живий, деталізований портрет із глибокою передачею характеру.",
        artSubCategory: "painting",
        location: "Київ",
        price: 675000,
        currency: "UAH",
        priceNegotiable: false,
        options: [
            { id: "opt-2-bust", label: "Портрет погруддя" },
            { id: "opt-2-full", label: "Портрет у повний зріст" },
            { id: "opt-2-background", label: "Деталізований фон" },
        ],
    },
    // sculpture
    {
        id: 3,
        ...getServiceAuthor(3),
        serviceImage: "/services.jpg",
        title: "Скульптура та інсталяції",
        slug: "skulptura-ta-instalyatsiyi",
        description: "Розробляю скульптурні об'єкти та інсталяції для публічних просторів, виставок і приватних колекцій. Від ідеї до монтажу супроводжую весь процес: концепт, матеріали, технічні рішення та інтеграцію у середовище. Фокусуюся на виразній формі та змісті, що запам'ятовується.",
        artSubCategory: "sculpture",
        location: "Одеса",
        priceNegotiable: true,
        options: [
            { id: "opt-3-concept", label: "Концепт і 3D-візуалізація" },
            { id: "opt-3-materials", label: "Підбір матеріалів" },
            { id: "opt-3-mount", label: "Монтаж на локації" },
        ],
    },
    {
        id: 4,
        ...getServiceAuthor(4),
        serviceImage: "/services.jpg",
        title: "Скульптурний портрет",
        slug: "skulpturnyy-portret",
        description: "Створюю портретні скульптури з глини та гіпсу для інтер'єрів і колекцій. Узгоджую характер пластики, масштаб і матеріал, а також готую варіанти тонування під конкретний простір. Готову роботу можна адаптувати для лиття у бронзі або композиті.",
        artSubCategory: "sculpture",
        location: "Київ",
        price: 444000,
        currency: "USD",
        priceNegotiable: false,
        options: [
            { id: "opt-4-clay", label: "Модель з глини" },
            { id: "opt-4-gypsum", label: "Фінал у гіпсі" },
            { id: "opt-4-bronze", label: "Підготовка до лиття в бронзі" },
        ],
    },
    // graphics
    {
        id: 5,
        ...getServiceAuthor(5),
        serviceImage: "/services.jpg",
        title: "Графічний дизайн",
        slug: "hrafichnyy-dyzayn",
        description: "Створюю графічний дизайн для брендів, подій та цифрових продуктів: айдентика, афіші, презентації, банери для соцмереж. Працюю системно - від візуальної концепції до готових макетів для друку й онлайн-публікації. Рішення адаптую під вашу аудиторію та задачі бізнесу.",
        artSubCategory: "graphics",
        location: "Харків",
        price: 95000,
        currency: "EUR",
        priceNegotiable: false,
        options: [
            { id: "opt-5-logo", label: "Логотип і фірмові кольори" },
            { id: "opt-5-social", label: "Пакет макетів для соцмереж" },
            { id: "opt-5-print", label: "Файли для друку" },
        ],
    },
    {
        id: 6,
        ...getServiceAuthor(6),
        serviceImage: "/services.jpg",
        title: "Ілюстрації для видань",
        slug: "ilyustratsiyi-dlya-vydan",
        description: "Розробляю ілюстрації для книжок, журналів і digital-статей у впізнаваному стилі. Працюю з сюжетом і композицією так, щоб зображення підсилювало текст і передавало потрібний настрій. Перед здачею надаю файли у форматах для друку та веб-публікації.",
        artSubCategory: "graphics",
        location: "Чернігів",
        priceNegotiable: true,
        options: [
            { id: "opt-6-cover", label: "Ілюстрація обкладинки" },
            { id: "opt-6-spreads", label: "Серія розворотів" },
            { id: "opt-6-web", label: "Адаптація для веб-версії" },
        ],
    },
    // art-photography
    {
        id: 7,
        ...getServiceAuthor(7),
        serviceImage: "/services.jpg",
        title: "Художня фотографія",
        slug: "khudozhnya-fotohrafiya",
        description: "Проводжу художні фотозйомки для персональних, сімейних і комерційних проєктів. Підбираю локацію, світло та стилістику кадру так, щоб отримати цілісну історію, а не просто набір фото. У вартість входить базова ретуш і підготовка знімків для вебу та друку.",
        artSubCategory: "art-photography",
        location: "Івано-Франківськ",
        price: 140000,
        currency: "USD",
        priceNegotiable: false,
        options: [
            { id: "opt-7-session", label: "Фотосесія до 2 годин" },
            { id: "opt-7-retouch", label: "Ретуш 20 кадрів" },
            { id: "opt-7-print", label: "Підготовка до друку" },
        ],
    },
    {
        id: 8,
        ...getServiceAuthor(8),
        serviceImage: "/services.jpg",
        title: "Фотопроєкти для брендів",
        slug: "fotoproyekty-dlya-brendiv",
        description: "Знімаю креативні фотосерії для брендів, артистів і культурних подій. Формую візуальну концепцію, підбираю команду та контролюю постобробку, щоб матеріал одразу працював у PR і соцмережах. Можлива пакетна зйомка з кількома локаціями за один день.",
        artSubCategory: "art-photography",
        location: "Тернопіль",
        price: 380000,
        currency: "EUR",
        priceNegotiable: false,
        options: [
            { id: "opt-8-concept", label: "Креативна концепція зйомки" },
            { id: "opt-8-studio", label: "Студійна зйомка" },
            { id: "opt-8-locations", label: "Додаткові локації" },
        ],
    },
    // video-editing
    {
        id: 9,
        ...getServiceAuthor(9),
        serviceImage: "/services.jpg",
        title: "Відеозйомка та монтаж",
        slug: "videozyomka-ta-montazh",
        description: "Надаю повний цикл відеопродакшену: зйомка, монтаж, кольорокорекція, титри та адаптація форматів під різні платформи. Працюю з рекламними роликами, репортажами подій і контентом для соцмереж. Важливою частиною є чіткий ритм монтажу та емоційний акцент у кожному кадрі.",
        artSubCategory: "video-editing",
        location: "Луцьк",
        priceNegotiable: true,
        options: [
            { id: "opt-9-shoot", label: "Зйомка на локації" },
            { id: "opt-9-edit", label: "Монтаж і титрування" },
            { id: "opt-9-color", label: "Кольорокорекція" },
        ],
    },
    {
        id: 10,
        ...getServiceAuthor(10),
        serviceImage: "/services.jpg",
        title: "Рілси та короткі відео",
        slug: "rilsy-ta-korotki-video",
        description: "Створюю короткі вертикальні відео для Instagram, TikTok і YouTube Shorts. Беру на себе сценарний каркас, зйомку, монтаж і адаптацію під трендову динаміку платформи. На виході ви отримуєте контент-пакет із кількох роликів для регулярних публікацій.",
        artSubCategory: "video-editing",
        location: "Вінниця",
        price: 290000,
        currency: "USD",
        priceNegotiable: false,
        options: [
            { id: "opt-10-script", label: "Сценарний план роликів" },
            { id: "opt-10-pack", label: "Пакет із 5 short-відео" },
            { id: "opt-10-subtitles", label: "Субтитри й адаптації" },
        ],
    },
    // music
    {
        id: 11,
        ...getServiceAuthor(11),
        serviceImage: "/services.jpg",
        title: "Музичний супровід заходів",
        slug: "muzychnyy-suprovid-zakhodiv",
        description: "Забезпечую музичний супровід заходів будь-якого формату: приватні події, презентації, камерні концерти та корпоративи. Формую програму під сценарій події - від фонового саунду до активного сценічного сету. За потреби допомагаю з технічним райдером і координацією звуку на майданчику.",
        artSubCategory: "music",
        location: "Полтава",
        price: 140,
        currency: "USD",
        priceNegotiable: false,
        options: [
            { id: "opt-11-duo", label: "Дуетний формат виступу" },
            { id: "opt-11-band", label: "Повний склад гурту" },
            { id: "opt-11-soundcheck", label: "Саундчек перед подією" },
        ],
    },
    {
        id: 12,
        ...getServiceAuthor(12),
        serviceImage: "/services.jpg",
        title: "Авторська музика для відео",
        slug: "avtorska-muzyka-dlya-video",
        description: "Пишу оригінальні музичні теми для реклами, документальних роликів і подкастів. Підбираю темп, фактуру та інструментальний склад під драматургію вашого матеріалу. Передаю фінальні треки у потрібних технічних форматах з урахуванням платформи публікації.",
        artSubCategory: "music",
        location: "Ужгород",
        price: 210,
        currency: "EUR",
        priceNegotiable: false,
        options: [
            { id: "opt-12-theme", label: "Основна музична тема" },
            { id: "opt-12-variations", label: "3 варіації треку" },
            { id: "opt-12-stems", label: "Передача STEM-доріжок" },
        ],
    },
    // directing
    {
        id: 13,
        ...getServiceAuthor(13),
        serviceImage: "/services.jpg",
        title: "Театральна режисура",
        slug: "teatralna-rezhysura",
        description: "Пропоную режисерський супровід театральних постановок: від розбору драматургії до фінальних репетицій перед прем'єрою. Працюю з акторами, пластикою сцени, ритмом дії та візуальною структурою вистави. Мета - створити виразну постановку, яка тримає увагу глядача від першої до останньої сцени.",
        artSubCategory: "directing",
        location: "Черкаси",
        priceNegotiable: true,
        options: [
            { id: "opt-13-analysis", label: "Аналіз драматургії" },
            { id: "opt-13-rehearsal", label: "Блок репетицій" },
            { id: "opt-13-premiere", label: "Супровід прем'єри" },
        ],
    },
    {
        id: 14,
        ...getServiceAuthor(14),
        serviceImage: "/services.jpg",
        title: "Режисура подієвих шоу",
        slug: "rezhysura-podiyevykh-shou",
        description: "Розробляю режисерську концепцію для культурних і корпоративних подій: від сценарної структури до постановки номерів. Координую взаємодію ведучих, артистів і технічної команди, щоб програма мала цілісний ритм. Працюю як на етапі підготовки, так і в день проведення події.",
        artSubCategory: "directing",
        location: "Суми",
        price: 260,
        currency: "USD",
        priceNegotiable: false,
        options: [
            { id: "opt-14-showflow", label: "Сценарна структура шоу" },
            { id: "opt-14-staging", label: "Постановка номерів" },
            { id: "opt-14-run", label: "Режисерський прогін події" },
        ],
    },
    // acting
    {
        id: 15,
        ...getServiceAuthor(15),
        serviceImage: "/services.jpg",
        title: "Акторська майстерність для сцени",
        slug: "aktorska-maysternist-dlya-stseny",
        description: "Проводжу індивідуальні заняття з акторської майстерності для театру та публічних виступів. Працюємо над увагою, імпровізацією, мовленням і сценічною присутністю. Програма адаптується під ваш рівень і конкретну творчу мету.",
        artSubCategory: "acting",
        location: "Житомир",
        price: 3000,
        currency: "UAH",
        priceNegotiable: false,
        options: [
            { id: "opt-15-improv", label: "Імпровізаційні практики" },
            { id: "opt-15-speech", label: "Техніка мовлення" },
            { id: "opt-15-stage", label: "Сценічна присутність" },
        ],
    },
    {
        id: 16,
        ...getServiceAuthor(15),
        serviceImage: "/services.jpg",
        title: "Підготовка акторських self-tape",
        slug: "pidhotovka-aktorskykh-self-tape",
        description: "Допомагаю акторам підготувати self-tape для кастингів: розбір сцени, партнерство в кадрі, запис і первинний монтаж. Фокус на точній подачі персонажа та технічно чистій картинці. За потреби можу підготувати кілька версій сцени для різних заявок.",
        artSubCategory: "acting",
        location: "Кропивницький",
        priceNegotiable: true,
        options: [
            { id: "opt-16-scene", label: "Розбір сцени для self-tape" },
            { id: "opt-16-record", label: "Запис 2 дублів" },
            { id: "opt-16-edit", label: "Базовий монтаж відео" },
        ],
    },
    // teams
    {
        id: 17,
        ...getTeamServiceAuthor(1),
        serviceImage: "/services.jpg",
        title: "Комплексна рекламна кампанія для події",
        slug: "kompleksna-reklamna-kampaniya-dlya-podiyi",
        description: "Команда бере на себе розробку та запуск рекламної кампанії для культурних подій: креатив, банери, відеооголошення та адаптація під соцмережі. Працюємо з єдиною візуальною концепцією і тримаємо фокус на охопленні та конверсії.",
        artSubCategory: "graphics",
        location: "Київ",
        priceNegotiable: true,
        options: [
            { id: "opt-17-strategy", label: "Рекламна стратегія кампанії" },
            { id: "opt-17-creatives", label: "Комплект креативів" },
            { id: "opt-17-launch", label: "Запуск і моніторинг" },
        ],
    },
    {
        id: 18,
        ...getTeamServiceAuthor(2),
        serviceImage: "/services.jpg",
        title: "Живий музичний сет для фестивалів",
        slug: "zhyvyy-muzychnyy-set-dlya-festyvaliv",
        description: "Гурт готує повноцінний live-сет під формат події: від камерного виступу до великої сцени. У вартість входить узгодження програми, техрайдер та саундчек перед виступом.",
        artSubCategory: "music",
        location: "Львів",
        price: 120000,
        currency: "UAH",
        priceNegotiable: false,
        options: [
            { id: "opt-18-setlist", label: "Індивідуальний сетлист" },
            { id: "opt-18-stage", label: "Виступ на великій сцені" },
            { id: "opt-18-rider", label: "Підготовка техрайдера" },
        ],
    },
    {
        id: 19,
        ...getTeamServiceAuthor(3),
        serviceImage: "/services.jpg",
        title: "Імерсивна театральна постановка",
        slug: "imersyvna-teatralna-postanovka",
        description: "Театральна команда створює постановку під ваш простір і аудиторію: драматургія, режисура, акторський склад і репетиційний процес. Підходить для фестивалів, освітніх програм і корпоративних культурних ініціатив.",
        artSubCategory: "acting",
        location: "Одеса",
        priceNegotiable: true,
        options: [
            { id: "opt-19-script", label: "Адаптація сценарію під простір" },
            { id: "opt-19-cast", label: "Підбір акторського складу" },
            { id: "opt-19-rehearsal", label: "Репетиційний супровід" },
        ],
    },
    {
        id: 20,
        ...getTeamServiceAuthor(4),
        serviceImage: "/services.jpg",
        title: "Документальний відеопортрет бренду",
        slug: "dokumentalnyy-videoportret-brendu",
        description: "Команда знімає короткий документальний фільм про бренд або проєкт: інтерв'ю, зйомка процесів, монтаж і кольорокорекція. На виході ви отримуєте основну версію та адаптації для соцмереж.",
        artSubCategory: "video-editing",
        location: "Харків",
        price: 3500,
        currency: "USD",
        priceNegotiable: false,
        options: [
            { id: "opt-20-interview", label: "Інтерв'ю та бекстейдж-зйомка" },
            { id: "opt-20-film", label: "Основний фільм до 3 хв" },
            { id: "opt-20-cuts", label: "Короткі версії для соцмереж" },
        ],
    },
];

export interface MyServiceCard {
    id: number;
    slug: string;
    image: string;
    buttonLabel: string;
    title: string;
}

const formatServicePrice = (service: ServiceItemData): string => {
    if (service.priceNegotiable || typeof service.price !== "number" || !service.currency) {
        return "Ціна договірна";
    }

    return `Від ${service.price.toLocaleString("uk-UA")} ${service.currency}`;
};

export const getServicesByAuthorId = (authorId: number): ServiceItemData[] =>
    servicesData.filter(
        (service) => service.performerType === "artist" && service.authorId === authorId
    );

export const getMyServicesByAuthorId = (authorId: number): MyServiceCard[] =>
    getServicesByAuthorId(authorId).map((service) => ({
        id: service.id,
        slug: service.slug,
        image: service.serviceImage,
        buttonLabel: formatServicePrice(service),
        title: service.title,
    }));

export const getMyServicesByTeamName = (teamName: string): MyServiceCard[] =>
    servicesData
        .filter(
            (service) => service.performerType === "team" && service.authorName === teamName
        )
        .map((service) => ({
            id: service.id,
            slug: service.slug,
            image: service.serviceImage,
            buttonLabel: formatServicePrice(service),
            title: service.title,
        }));

export const getServiceById = (serviceId: number): ServiceItemData | undefined =>
    servicesData.find((service) => service.id === serviceId);

export const getServiceBySlug = (serviceSlug: string): ServiceItemData | undefined =>
    servicesData.find((service) => service.slug === serviceSlug);

export const getServicePageData = (serviceSlug?: string): ServicePageData => {
    const fallbackService = servicesData[0];
    const selectedService = (serviceSlug && getServiceBySlug(serviceSlug)) || fallbackService;

    return {
        photo: selectedService.serviceImage,
        breadcrumb: {
            authorName: selectedService.authorName,
            section: "Послуги",
        },
        title: selectedService.title,
        priceLabel: formatServicePrice(selectedService),
        description: [selectedService.description],
        options: selectedService.options,
        formFields: SERVICE_FORM_FIELDS.map((field) => ({ ...field })),
        submitButtonLabel: "Відправити запит",
    };
};

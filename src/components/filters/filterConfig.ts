// Filter data structure
export interface FilterItem {
    id: string;
    label: string;
    type: 'checkbox' | 'checkmark';
}

export interface FilterSubsection {
    id: string;
    title: string;
    items: FilterItem[];
}

export interface FilterSection {
    id: string;
    title: string;
    type: 'simple' | 'nested';
    items?: FilterItem[];
    subsections?: FilterSubsection[];
}

// Authors page filters
export const authorsFilters: FilterSection[] = [
    {
        id: 'platform-participants',
        title: 'Учасники платформи',
        type: 'simple',
        items: [
            { id: 'all', label: 'Усі', type: 'checkbox' },
            { id: 'artists', label: 'Митці', type: 'checkbox' },
            { id: 'organizations', label: 'Організації', type: 'checkbox' },
            { id: 'teams', label: 'Команди', type: 'checkbox' },
        ]
    },
    {
        id: 'art-fields',
        title: 'Галузі мистецтва',
        type: 'nested',
        subsections: [
            {
                id: 'stage-art',
                title: 'Сценічне мистецтво',
                items: [
                    { id: 'directing', label: 'Режисура', type: 'checkmark' },
                    { id: 'acting', label: 'Акторське мистецтво', type: 'checkmark' },
                    { id: 'music', label: 'Музичне мистецтво', type: 'checkmark' },
                    { id: 'choreography', label: 'Хореографічне мистецтво', type: 'checkmark' },
                    { id: 'original-genre', label: 'Оригінальний жанр', type: 'checkmark' },
                ]
            },
            {
                id: 'visual-art',
                title: 'Візуальне мистецтво',
                items: [
                    { id: 'art-photography', label: 'Художня фотографія', type: 'checkmark' },
                    { id: 'video-editing', label: 'Відеозйомка та монтаж', type: 'checkmark' },
                    { id: 'cinema', label: 'Повнометражний кінематограф', type: 'checkmark' },
                    { id: 'ar', label: 'Доповнена реальність', type: 'checkmark' },
                ]
            },
            {
                id: 'fine-art',
                title: 'Образотворче мистецтво',
                items: [
                    { id: 'painting', label: 'Живопис', type: 'checkmark' },
                    { id: 'sculpture', label: 'Скульптура', type: 'checkmark' },
                    { id: 'graphics', label: 'Графіка', type: 'checkmark' },
                ]
            },
            {
                id: 'literature',
                title: 'Література',
                items: [
                    { id: 'poetry', label: 'Поезія', type: 'checkmark' },
                    { id: 'prose', label: 'Проза', type: 'checkmark' },
                ]
            }
        ]
    }
];

// Catalogs page filters
export const catalogsFilters: FilterSection[] = [
    {
        id: 'art-fields',
        title: 'Галузі мистецтва',
        type: 'nested',
        subsections: [
            {
                id: 'stage-art',
                title: 'Сценічне мистецтво',
                items: [
                    { id: 'directing', label: 'Режисура', type: 'checkmark' },
                    { id: 'acting', label: 'Акторське мистецтво', type: 'checkmark' },
                    { id: 'music', label: 'Музичне мистецтво', type: 'checkmark' },
                    { id: 'choreography', label: 'Хореографічне мистецтво', type: 'checkmark' },
                    { id: 'original-genre', label: 'Оригінальний жанр', type: 'checkmark' },
                ]
            },
            {
                id: 'visual-art',
                title: 'Візуальне мистецтво',
                items: [
                    { id: 'art-photography', label: 'Художня фотографія', type: 'checkmark' },
                    { id: 'video-editing', label: 'Відеозйомка та монтаж', type: 'checkmark' },
                    { id: 'cinema', label: 'Повнометражний кінематограф', type: 'checkmark' },
                    { id: 'ar', label: 'Доповнена реальність', type: 'checkmark' },
                ]
            },
            {
                id: 'fine-art',
                title: 'Образотворче мистецтво',
                items: [
                    { id: 'painting', label: 'Живопис', type: 'checkmark' },
                    { id: 'sculpture', label: 'Скульптура', type: 'checkmark' },
                    { id: 'graphics', label: 'Графіка', type: 'checkmark' },
                ]
            },
            {
                id: 'literature',
                title: 'Література',
                items: [
                    { id: 'poetry', label: 'Поезія', type: 'checkmark' },
                    { id: 'prose', label: 'Проза', type: 'checkmark' },
                ]
            }
        ]
    }
];

// Projects page filters
export const projectsFilters: FilterSection[] = [
    {
        id: 'art-fields',
        title: 'Галузі мистецтва',
        type: 'nested',
        subsections: [
            {
                id: 'stage-art',
                title: 'Сценічне мистецтво',
                items: [
                    { id: 'directing', label: 'Режисура', type: 'checkmark' },
                    { id: 'acting', label: 'Акторське мистецтво', type: 'checkmark' },
                    { id: 'music', label: 'Музичне мистецтво', type: 'checkmark' },
                    { id: 'choreography', label: 'Хореографічне мистецтво', type: 'checkmark' },
                    { id: 'original-genre', label: 'Оригінальний жанр', type: 'checkmark' },
                ]
            },
            {
                id: 'visual-art',
                title: 'Візуальне мистецтво',
                items: [
                    { id: 'art-photography', label: 'Художня фотографія', type: 'checkmark' },
                    { id: 'video-editing', label: 'Відеозйомка та монтаж', type: 'checkmark' },
                    { id: 'cinema', label: 'Повнометражний кінематограф', type: 'checkmark' },
                    { id: 'ar', label: 'Доповнена реальність', type: 'checkmark' },
                ]
            },
            {
                id: 'fine-art',
                title: 'Образотворче мистецтво',
                items: [
                    { id: 'painting', label: 'Живопис', type: 'checkmark' },
                    { id: 'sculpture', label: 'Скульптура', type: 'checkmark' },
                    { id: 'graphics', label: 'Графіка', type: 'checkmark' },
                ]
            },
            {
                id: 'literature',
                title: 'Література',
                items: [
                    { id: 'poetry', label: 'Поезія', type: 'checkmark' },
                    { id: 'prose', label: 'Проза', type: 'checkmark' },
                ]
            }
        ]
    },
    {
        id: 'sales',
        title: 'Продаж',
        type: 'simple',
        items: [
            { id: 'all', label: 'Усі', type: 'checkbox' },
            { id: 'for-sale', label: 'Для продажу', type: 'checkbox' },
            { id: 'sold', label: 'Продані', type: 'checkbox' },
            { id: 'reserved', label: 'Зарезервовані', type: 'checkbox' },
        ]
    }
];

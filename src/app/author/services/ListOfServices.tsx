"use client";

import Service from "./Service";

const servicesData = [
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
export default function ListOfServices() {
    return (
        <section className="w-full bg-[#414141] py-8 md:py-12 lg:py-16">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-4 lg:gap-8 px-4 md:px-[30px] lg:pl-[75px] lg:pr-[75px]">
                {servicesData.map((service) => (
                    <Service
                        key={service.id}
                        image={service.image}
                        buttonLabel={service.buttonLabel}
                        title={service.title}
                    />
                ))}
            </div>
        </section>
    );
}
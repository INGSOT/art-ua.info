"use client";

export default function ServiceDescription() {
    return (
        <div className="w-full bg-[#FFFCF5] p-8 lg:p-12">
            {/* Breadcrumb */}
            <div className="flex items-center gap-2 mb-6 text-sm">
                <span className="text-black">Ім'я Прізвище</span>
                <span className="text-black">/</span>
                <span className="text-black">Послуги</span>
            </div>

            {/* Title */}
            <h1 className="text-black font-bold text-[40px] leading-tight mb-6" style={{ fontWeight: 600 }}>
                Повна назва послуги
            </h1>

            {/* Price Button */}
            <button className="bg-[#FECC39] text-black font-bold px-6 py-3 mb-6 flex items-center justify-center whitespace-nowrap" style={{ width: '197px', height: '48px', fontWeight: 600 }}>
                Ціна договірна
            </button>

            {/* Description */}
            <div className="text-black space-y-4">
                <p>Текст опису.</p>
                <p>Культурна спадщина України в контексті нових історичних подій набула особливої актуальності та нових змістів.</p>
                <p>Саме зараз настає його час - аби уберегти наступні покоління від руїн, транслюючи біль крізь художні образи.</p>
            </div>
        </div>
    );
}

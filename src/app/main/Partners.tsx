import { Card, CardContent } from "../../components/ui/card";
import { ScrollArea, ScrollBar } from "../../components/ui/scroll-area";
import { homeAPI } from "../../lib/api/home";

export default async function Partners() {
  let partners: Awaited<ReturnType<typeof homeAPI.getPartners>> = { title: "Партнери", items: [] };
  try {
    partners = await homeAPI.getPartners();
  } catch (error) {
    console.error("Failed to load partners:", error);
  }

    return (
    <section className="flex flex-col items-center gap-[30px] px-4 py-10 md:py-20 w-full bg-[#414141]">
      <h2 className="text-white text-[32px] md:text-[48px] lg:text-[60px] font-bold font-[700] leading-[var(--h2-line-height)] tracking-[var(--h2-letter-spacing)]">
        {partners.title}
      </h2>

      <ScrollArea className="w-full max-w-[1440px]">
        <div className="flex items-start gap-10 pb-6">
          {partners.items.map((partner, index) => (
            <Card
              key={index}
              className="flex-shrink-0 w-[400px] h-[400px] bg-[#343434] border-0 rounded-none"
            >
              <CardContent className="flex flex-col gap-5 p-5 h-full">
                {partner.logo && (
                  <img
                    className="h-[100px] w-auto max-w-[323px] object-contain"
                    alt={partner.name}
                    src={partner.logo}
                  />
                )}

                <div className="flex flex-col justify-end gap-2 flex-1 w-full text-left">
                  <h6 className="font-h6 font-bold font-[700] text-white text-[length:var(--h6-font-size)] tracking-[var(--h6-letter-spacing)] leading-[var(--h6-line-height)] [font-style:var(--h6-font-style)]">
                    {partner.name}
                  </h6>

                  <div className="font-wix font-p2 font-[number:var(--p2-font-weight)] text-white text-[length:var(--p2-font-size)] tracking-[var(--p2-letter-spacing)] leading-[var(--p2-line-height)] [font-style:var(--p2-font-style)]">
                    {partner.description}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>

      <div className="flex w-full max-w-[1440px] items-start p-px bg-id-7 rounded-[5px] overflow-hidden">
        <div className="w-[690px] h-2 bg-id-5 rounded" />
      </div>
    </section>
    );
}
import { useTranslations } from "next-intl";
import { TermsSection } from "../../../lib/api/terms";

interface TermsContentProps {
  sections: TermsSection[];
}

function splitLines(value: string | null): string[] {
  return value ? value.split("\n").filter(Boolean) : [];
}

export default function TermsContent({ sections }: TermsContentProps) {
  const t = useTranslations("Terms");
  if (sections.length === 0) {
    return (
      <div className="w-full bg-[#343434] border border-solid border-[#272727] p-6">
        <p className="text-white font-p1">{t("empty")}</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8 w-full">
      {sections.map((section) => (
        <div key={section.id} className="flex flex-col gap-4 w-full">
          {section.heading && (
            <h2 className="font-h5 font-bold text-white text-[length:var(--h5-font-size)] tracking-[var(--h5-letter-spacing)] leading-[var(--h5-line-height)] [font-style:var(--h5-font-style)]">
              {section.heading}
            </h2>
          )}

          {section.date && (
            <p className="font-p2 font-[number:var(--p2-font-weight)] text-[#FECC39] text-[length:var(--p2-font-size)] tracking-[var(--p2-letter-spacing)] leading-[var(--p2-line-height)] [font-style:var(--p2-font-style)]">
              {section.date}
            </p>
          )}

          {section.blocks.map((block) => {
            const paragraphs = splitLines(block.paragraphs);
            const listItems = splitLines(block.list?.items ?? null);

            return (
              <div
                key={block.id}
                className="flex flex-col gap-3 w-full bg-[#343434] border border-solid border-[#272727] p-6"
              >
                {block.heading && (
                  <h3 className="font-h6 font-bold text-white text-[length:var(--h6-font-size)] tracking-[var(--h6-letter-spacing)] leading-[var(--h6-line-height)] [font-style:var(--h6-font-style)]">
                    {block.heading}
                  </h3>
                )}

                {paragraphs.map((paragraph, index) => (
                  <p
                    key={index}
                    className="font-p1 font-[number:var(--p1-font-weight)] text-white text-[length:var(--p1-font-size)] tracking-[var(--p1-letter-spacing)] leading-[var(--p1-line-height)] [font-style:var(--p1-font-style)]"
                  >
                    {paragraph}
                  </p>
                ))}

                {block.list && listItems.length > 0 && (
                  block.list.type === "ordered" ? (
                    <ol className="list-decimal list-inside flex flex-col gap-2">
                      {listItems.map((item, index) => (
                        <li
                          key={index}
                          className="font-p1 font-[number:var(--p1-font-weight)] text-white text-[length:var(--p1-font-size)] tracking-[var(--p1-letter-spacing)] leading-[var(--p1-line-height)] [font-style:var(--p1-font-style)]"
                        >
                          {item}
                        </li>
                      ))}
                    </ol>
                  ) : (
                    <ul className="list-disc list-inside flex flex-col gap-2">
                      {listItems.map((item, index) => (
                        <li
                          key={index}
                          className="font-p1 font-[number:var(--p1-font-weight)] text-white text-[length:var(--p1-font-size)] tracking-[var(--p1-letter-spacing)] leading-[var(--p1-line-height)] [font-style:var(--p1-font-style)]"
                        >
                          {item}
                        </li>
                      ))}
                    </ul>
                  )
                )}
              </div>
            );
          })}
        </div>
      ))}
    </div>
  );
}

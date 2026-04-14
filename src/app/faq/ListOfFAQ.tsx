import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../../components/ui/accordion";
import { FAQItem } from "../../data/faqData";

interface ListOfFAQProps {
  items: FAQItem[];
}

export default function ListOfFAQ({ items }: ListOfFAQProps) {
  if (items.length === 0) {
    return (
      <div className="w-full bg-[#343434] border border-solid border-[#272727] p-6">
        <p className="text-white font-p1">
          За обраною категорією поки немає запитань.
        </p>
      </div>
    );
  }

  return (
    <Accordion
      type="single"
      collapsible
      defaultValue={items[0]?.id}
      className="w-full flex flex-col bg-[#343434]"
    >
      {items.map((faq) => (
        <AccordionItem key={faq.id} value={faq.id} className="border-none">
          <div className="flex flex-col w-full bg-[#343434] border border-solid border-[#272727]">
            <div className="flex items-stretch w-full border-b border-[#272727]">
              <div className="flex items-center gap-3 p-3 flex-1 bg-[#343434]">
                <img
                  className="w-6 h-6"
                  alt="Question icon"
                  src="/question.svg"
                />
                <h3 className="flex-1 font-h6 font-bold text-white text-[length:var(--h6-font-size)] tracking-[var(--h6-letter-spacing)] leading-[var(--h6-line-height)] [font-style:var(--h6-font-style)]">
                  {faq.question}
                </h3>
              </div>

              <AccordionTrigger className="flex items-center justify-center p-3 bg-[#343434] hover:no-underline group border-l border-[#272727]">
                <div className="w-[60px] h-[60px] bg-transparent group-hover:bg-[#FECC39] group-data-[state=open]:bg-[#FECC39] flex items-center justify-center transition-colors">
                  <img className="w-6 h-6 block group-hover:hidden group-data-[state=open]:hidden" alt="Toggle icon" src="/yellow_triangle_up.svg" />
                  <img className="w-6 h-6 hidden group-hover:block group-data-[state=open]:hidden" alt="Toggle icon hover" src="/grey_triangle_up.svg" />
                  <img className="w-6 h-6 hidden group-data-[state=open]:block" alt="Toggle icon open" src="/grey_triangle_down.svg" />
                </div>
              </AccordionTrigger>
            </div>

            {faq.answer.length > 0 && (
              <AccordionContent className="flex items-start gap-3 p-[30px] w-full border-t border-[#272727] bg-[#272727]">
                <div className="flex flex-col items-start gap-3">
                  {faq.answer.map((paragraph, index) => (
                    <p
                      key={index}
                      className="font-p1 font-[number:var(--p1-font-weight)] text-white text-[length:var(--p1-font-size)] tracking-[var(--p1-letter-spacing)] leading-[var(--p1-line-height)] [font-style:var(--p1-font-style)]"
                    >
                      {paragraph}
                    </p>
                  ))}
                </div>
              </AccordionContent>
            )}
          </div>
        </AccordionItem>
      ))}
    </Accordion>
  );
}

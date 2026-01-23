import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../../components/ui/accordion";
import { Button } from "../../components/ui/button";

const faqData = [
  {
    id: "item-1",
    question: "Текст питання",
    answer: [
      "Текст відповіді Р1.",
      "We generate revenue by facilitating successful transactions between our users. The primary objective of everything we do – every new feature, policy, and campaign – is to maximize the number of users searching, interacting, and, ultimately, transacting through our platform.",
    ],
    isOpen: true,
  },
  {
    id: "item-2",
    question: "Текст питання",
    answer: [
      "Текст відповіді Р1.",
      "We generate revenue by facilitating successful transactions between our users. The primary objective of everything we do – every new feature, policy, and campaign – is to maximize the number of users searching, interacting, and, ultimately, transacting through our platform.",
    ],
    isOpen: false,
  },
  {
    id: "item-3",
    question: "Текст питання",
    answer: [
      "Текст відповіді Р1.",
      "We generate revenue by facilitating successful transactions between our users. The primary objective of everything we do – every new feature, policy, and campaign – is to maximize the number of users searching, interacting, and, ultimately, transacting through our platform.",
    ],
    isOpen: false,
  },
  {
    id: "item-4",
    question: "Текст питання",
    answer: [
      "Текст відповіді Р1.",
      "We generate revenue by facilitating successful transactions between our users. The primary objective of everything we do – every new feature, policy, and campaign – is to maximize the number of users searching, interacting, and, ultimately, transacting through our platform.",
    ],
    isOpen: false,
  },
  {
    id: "item-5",
    question: "Текст питання",
    answer: [
      "Текст відповіді Р1.",
      "We generate revenue by facilitating successful transactions between our users. The primary objective of everything we do – every new feature, policy, and campaign – is to maximize the number of users searching, interacting, and, ultimately, transacting through our platform.",
    ],
    isOpen: false,
  },
];

export default function FAQ() {
  return (
    <section className="flex flex-col items-center gap-[30px] px-4 py-10 md:py-20 w-full bg-[#414141] border-b border-solid border-[#343434]">
      <div className="w-full max-w-[1440px] flex flex-col gap-[30px]">
        <h4 className="self-start max-w-[600px] font-h4 font-bold text-white text-left text-[24px] md:text-[32px] lg:text-[40px] tracking-[var(--h4-letter-spacing)] leading-[var(--h4-line-height)] [font-style:var(--h4-font-style)">
          Часті питання
        </h4>

        <Accordion
          type="single"
          collapsible
          defaultValue="item-1"
          className="w-full flex flex-col bg-[#343434]"
        >
        {faqData.map((faq) => (
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
      </div>

      <Button
        variant="ghost"
        className="w-[300px] h-[60px] p-3 bg-[#FFFCF5] hover:bg-[#FECC39] rounded-none font-button font-bold text-[#343434] text-[length:var(--button-font-size)] tracking-[var(--button-letter-spacing)] leading-[var(--button-line-height)] [font-style:var(--button-font-style)]"
      >
        Усі питання
      </Button>
    </section>
  );
}
import { platformFeaturesData } from "../../data/mainData";

export default function PlatformFeatures() {
    return (
    <section className="flex flex-col md:flex-row items-start gap-6 md:gap-[60px] p-4 md:p-10 lg:p-20 w-full bg-[#FECC39]">
      {platformFeaturesData.map((feature, index) => (
        <div key={index} className="flex flex-col items-start gap-5 flex-1">
          <h6 className="self-stretch text-black text-[18px] font-semibold font-[family-name:var(--font-unbounded)]">
            {feature.title}
          </h6>
          <p className="self-stretch font-p1 font-[number:var(--p1-font-weight)] text-black text-[length:var(--p1-font-size)] tracking-[var(--p1-letter-spacing)] leading-[var(--p1-line-height)] [font-style:var(--p1-font-style)]">
            {feature.description}
          </p>
        </div>
      ))}
    </section>
    )
}
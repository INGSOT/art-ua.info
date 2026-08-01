import { platformFeaturesData } from "../../data/mainData";
import { homeAPI } from "../../lib/api/home";

export default async function PlatformFeatures() {
  let features: { title: string; description: string }[] = platformFeaturesData;

  try {
    const loaded = await homeAPI.getPlatformFeatures();
    if (loaded.length) {
      features = loaded;
    }
  } catch (error) {
    console.error("Failed to load platform features:", error);
  }

  return (
    <section className="flex flex-col md:flex-row items-start gap-6 md:gap-[60px] p-4 md:p-10 lg:p-20 w-full bg-[#FECC39]">
      {features.map((feature, index) => (
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
  );
}

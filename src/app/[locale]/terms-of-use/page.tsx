"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import Header from "../../../components/Header";
import TermsContent from "./TermsContent";
import { termsAPI, TermsSection } from "../../../lib/api/terms";

export default function TermsOfUsePage() {
    const t = useTranslations("Terms");
    const [sections, setSections] = useState<TermsSection[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        let isMounted = true;

        termsAPI
            .list()
            .then((data) => {
                if (isMounted) {
                    setSections(data);
                }
            })
            .catch((error) => {
                console.error("Failed to load terms of use:", error);
            })
            .finally(() => {
                if (isMounted) {
                    setIsLoading(false);
                }
            });

        return () => {
            isMounted = false;
        };
    }, []);

    return (
        <>
            <Header isHomePage={false} />

            <section className="w-full bg-[#414141] py-8 px-4 sm:px-6 md:px-10 lg:px-20">
                <div className="mb-6 md:mb-8">
                    <h1 className="text-white font-bold text-2xl sm:text-3xl md:text-[40px] leading-tight" style={{ fontWeight: 600 }}>
                        {t("title")}
                    </h1>
                </div>

                {isLoading ? (
                    <div className="w-full bg-[#343434] border border-solid border-[#272727] p-6">
                        <p className="text-white font-p1">{t("loading")}</p>
                    </div>
                ) : (
                    <TermsContent sections={sections} />
                )}
            </section>
        </>
    );
}

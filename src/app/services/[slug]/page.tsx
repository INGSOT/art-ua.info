"use client";

import Header from "../../../components/Header";
import { AuthorProfileProvider } from "../../author/AuthorProfileContext";
import Photo from "../../author/[slug]/services/service/Photo";
import ServiceDescription from "../../author/[slug]/services/service/ServiceDescription";
import OrderForm from "../../author/[slug]/services/service/OrderForm";

export default function ServicePage() {
  return (
    <AuthorProfileProvider>
      <>
        <Header isHomePage={false} />
        <div className="flex flex-col lg:flex-row w-full">
          <Photo />
          <div className="w-full lg:w-1/2 flex flex-col">
            <ServiceDescription />
            <OrderForm />
          </div>
        </div>
      </>
    </AuthorProfileProvider>
  );
}

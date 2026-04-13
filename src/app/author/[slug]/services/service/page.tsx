"use client";

import Header from "../../../../../components/Header";
import Photo from "./Photo";
import ServiceDescription from "./ServiceDescription";
import OrderForm from "./OrderForm";

export default function ServicePage() {
    return (
        <>
            <Header isHomePage={false} />
            {/* Main Content - Two Column Layout */}
                <div className="flex flex-col lg:flex-row w-full">
                    {/* Left Side - Photo Section */}
                    <Photo />
                            
                    {/* Right Side - Service Description and Order Form */}
                    <div className="w-full lg:w-1/2 flex flex-col">
                        <ServiceDescription />
                        <OrderForm />
                    </div>
                </div>
        </>
    );
}
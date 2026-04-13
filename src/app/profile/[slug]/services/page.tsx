import Header from "../../../../components/Header";
import AboutMe from "../../AboutMe";
import Menu from "../../Menu";
import Services from "./Services";

export default function ServicesPage() {
  return (
    <>
      <Header isHomePage={false} />
      <AboutMe />
      <Menu activeItem="services" />
      <Services />
    </>
  );
}
import Catalogs from "./Catalogs";
import Header from "../../../../components/Header";
import AboutMe from "../../AboutMe";
import Menu from "../../Menu";

export default function CatalogsPage() {
  return (
    <>
      <Header isHomePage={false} />
      <AboutMe />
      <Menu activeItem="catalogs" />
      <Catalogs />
    </>
  );
}

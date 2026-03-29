import Ubication from "../../components/Ubication";
import PlanesDePrecios from "../../components/PlanesDePrecios";
import SeccionTestimonios from "../../components/SeccionTestimonios";
import HeroSection from "../../components/HeroSection";
import FeaturesSection from "../../components/FeaturesSection";
import EntranamientosAdaptan from "../../components/EntranamientosAdaptan";
import Banner from "../../components/Banner";

const Home = () => {
  return (
    <div className="bg-gray-900 text-white">
      <HeroSection />
      <Banner />
      <EntranamientosAdaptan />
      <Banner
        altura="h-[270px] md:h-[320px] lg:h-[350px]"
        texto_1="text-2xl md:text-3xl lg:text-4xl"
        texto_2="text-2xl md:text-2xl lg:text-3xl"
      />
      <FeaturesSection />
      <Banner
        altura="h-[270px] md:h-[320px] lg:h-[350px]"
        texto_1="text-2xl md:text-3xl lg:text-4xl"
        texto_2="text-2xl md:text-2xl lg:text-3xl"
      />

      <PlanesDePrecios />
      <Banner
        altura="h-[270px] md:h-[320px] lg:h-[350px]"
        texto_1="text-2xl md:text-3xl lg:text-4xl"
        texto_2="text-2xl md:text-2xl lg:text-3xl"
      />
      <SeccionTestimonios />
      <Ubication />
    </div>
  );
};

export default Home;

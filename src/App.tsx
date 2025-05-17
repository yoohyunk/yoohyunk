import NavBar from "./components/NavBar";
import { Element } from "react-scroll";
import HeroSection from "./pages/HeroSection";
import AboutSection from "./pages/AboutSection";
import ProjectsSection from "./pages/ProjectsSection";
import SkillsSection from "./pages/SkillsSection";
import ContactSection from "./pages/ContactSection";

export default function App() {
  return (
    <div className="bg-gray-50 max-w-7xl mx-auto">
      <NavBar />
      <main className="pt-16 ">
        <Element name="hero">
          <HeroSection />
        </Element>
        <Element name="about">
          <AboutSection />
        </Element>
        <Element name="projects">
          <ProjectsSection />
        </Element>
        <Element name="skills">
          <SkillsSection />
        </Element>
        <Element name="contact">
          <ContactSection />
        </Element>
      </main>
    </div>
  );
}

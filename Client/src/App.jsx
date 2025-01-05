import "./App.css";
import FooterSection from "./components/footer/FooterSection";
import HeroSection from "./components/hero/HeroSection";
import MainSection from "./components/main/MainSection";

function App() {
  return (
    <>
      <div className="container">
        <HeroSection />
        <MainSection />
        <FooterSection />
      </div>
    </>
  );
}

export default App;

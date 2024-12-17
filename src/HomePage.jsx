import './App.css';
import Features from './homepagecomponents/Features';
import LampDemo from './homepagecomponents/LampDemo';
import BackgroundBeamsWithCollisionDemo from './homepagecomponents/Beam';
import HeroScrollDemo from './homepagecomponents/Home';
import FloatingNavDemo from './homepagecomponents/Navbar';

function HomePage() {
  return (
    <div>
          <div className="bg-black min-h-screen w-full">

      {/* Navbar */}
      <FloatingNavDemo />

      {/* Hero Section */}
      <HeroScrollDemo />

      {/* Lamp Demo Section */}
      <div id="lamp">
        <LampDemo />
      </div>


      {/* Features Section */}
      <Features />

      {/* Cover Section */}
      <div id="beam">
      <BackgroundBeamsWithCollisionDemo />
      </div>

    </div>
    </div>
  )
}

export default HomePage

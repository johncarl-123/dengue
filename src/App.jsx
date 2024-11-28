import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { About, Contact, Experience, Feedbacks, Hero, Navbar, Tech, Works, StarsCanvas } from './components/components';
import Predict from './components/components/Predict';
import HeatMap from './components/components/HeatMap';
import ResultPage from './components/components/ResultPage';

const App = () => {
  return (
    <BrowserRouter>
      <div className="relative z-0 bg-primary">
        <Navbar />
        <Routes>
          <Route 
            path="/" 
            element={
              <>
                <div className="bg-hero-pattern bg-cover bg-no-repeat bg-center">
                  <Hero />
                </div>
                <About />
                <Experience />
                <Works />
                <div className="relative z-0">
                  <Contact />
                </div>
              </>
            } 
          />
          <Route path="/predict" element={<Predict />} />
          <Route path="/heatmap" element={<HeatMap />} />
          <Route path="/result" element={<ResultPage />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
};

export default App;

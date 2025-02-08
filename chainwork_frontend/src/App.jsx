import React, { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { MainLayout } from "./Layouts/MainLayout";
import { Home } from "./Pages/Home";
import { Tasks } from "./Pages/Tasks";
import { SubmitTask } from "./Pages/SubmitTask";
import { ReviewSubmission } from "./Pages/ReviewSubmission";
import { CreateTask } from "./Pages/CreateTask";
import { Profile } from "./Pages/Profile";
import About from "./Pages/About";
import Services from "./Pages/Services";
import Contact from "./Pages/Contact";
import GigDetails from "./Pages/GigDetails";  
import FreelancerProfile from "./Pages/FreelancerProfile"; 
import { useTheme } from "./context/ThemeContext"; 

function App() {
  const { theme } = useTheme(); 

  useEffect(() => {
    document.documentElement.classList.remove("light", "dark");
    document.documentElement.classList.add(theme);
  }, [theme]);

  return (
    <Router>
      <MainLayout>
        <div className="min-h-screen bg-gray-100 dark:bg-gray-900 transition-colors duration-300">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/tasks" element={<Tasks />} />
            <Route path="/submit-task" element={<SubmitTask />} />
            <Route path="/review-submission/:id" element={<ReviewSubmission />} />
            <Route path="/create-task" element={<CreateTask />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/about" element={<About />} />
            <Route path="/services" element={<Services />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/gig/:id" element={<GigDetails />} />  
            <Route path="/freelancer/:id" element={<FreelancerProfile />} /> 
          </Routes>
        </div>
      </MainLayout>
    </Router>
  );
}

export default App;

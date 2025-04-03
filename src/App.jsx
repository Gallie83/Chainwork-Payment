import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { MainLayout } from './Layouts/MainLayout';
import { Home } from './Pages/Home';
import { Tasks } from './Pages/Tasks';
import { SubmitTask } from './Pages/SubmitTask';
import { ReviewSubmission } from './Pages/ReviewSubmission';
import { CreateTask } from './Pages/CreateTask';
import { Profile } from './Pages/Profile';
import { PaymentProvider } from './Context/PaymentContext';

function App() {
  return (
    <PaymentProvider>
      <Router>
        <MainLayout>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/tasks" element={<Tasks />} />
            <Route path="/submit-task" element={<SubmitTask />} />
            <Route path="/review-submission/:id" element={<ReviewSubmission />} />
            <Route path="/create-task" element={<CreateTask />} />
            <Route path="/profile" element={<Profile />} />
          </Routes>
        </MainLayout>
      </Router>
    </PaymentProvider>
  );
}

export default App;
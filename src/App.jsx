import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider, useApp } from './context/AppContext';
import Layout from './components/Layout';
import Onboarding from './components/Onboarding';
import QuizHome from './pages/Quiz/QuizHome';
import FlashcardMode from './pages/Quiz/FlashcardMode';
import MultipleChoice from './pages/Quiz/MultipleChoice';
import TasksPage from './pages/Tasks/TasksPage';
import SchedulePage from './pages/Schedule/SchedulePage';
import PetPage from './pages/Pet/PetPage';
import ProfilePage from './pages/Profile/ProfilePage';

function AppRoutes() {
  const { state } = useApp();

  if (!state.profile) {
    return <Onboarding />;
  }

  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/quiz" element={<QuizHome />} />
        <Route path="/quiz/flashcards/:listId" element={<FlashcardMode />} />
        <Route path="/quiz/multiple-choice/:listId" element={<MultipleChoice />} />
        <Route path="/tasks" element={<TasksPage />} />
        <Route path="/schedule" element={<SchedulePage />} />
        <Route path="/pet" element={<PetPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="*" element={<Navigate to="/quiz" replace />} />
      </Route>
    </Routes>
  );
}

export default function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </AppProvider>
  );
}

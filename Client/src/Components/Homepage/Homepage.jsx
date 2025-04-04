import React, { useState, useEffect } from 'react';
import { DailyTasks } from './components/DailyTasks';
import { CustomTaskCards } from './components/CustomTaskCards';
import { Calendar } from './components/Calendar';
import { PerformanceAnalytics } from '../Performacne/PerformanceAnalytics';
import Sidebar from './components/Sidebar';
import { DigitalClock } from './components/DigitalClock';
import { useAuth } from '../../Context/AuthContext';
import { useLevel } from '../../Context/LevelContext';
import '../Login_page/Login.css';
import './components/Homepage.css';
import LevelPopup from './components/LevelPopup';
import XpPopup from './components/XpPopup';
import LevelDetails from './components/LevelDetails';
import { TaskFocus } from './components/TaskFocus';
import TaskSuggestions from './components/TaskSuggestions';

// New popup notification component
const AIUnavailableNotification = ({ onClose }) => {
  return (
    <div className="fixed inset-x-0 top-20 mx-auto z-50 max-w-md">
      <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 shadow-lg rounded-md">
        <div className="flex items-start">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-yellow-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3">
            <p className="text-sm">
              The AI chatbot and Task suggestion features will not work in this guest version as the backend services are not configured.
            </p>
          </div>
          <div className="ml-auto pl-3">
            <div className="-mx-1.5 -my-1.5">
              <button
                onClick={onClose}
                className="inline-flex rounded-md p-1.5 text-yellow-500 hover:bg-yellow-200 focus:outline-none"
              >
                <span className="sr-only">Dismiss</span>
                <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

function Homepage({ initialTab, toggleSidebar, isSidebarOpen }) {
  const [activeTab, setActiveTab] = useState(initialTab || 'daily');
  const { user } = useAuth();
  const { xpGained, showXpPopup, closeXpPopup } = useLevel();
  const [showAINotification, setShowAINotification] = useState(true);

  useEffect(() => {
    if (initialTab) {
      setActiveTab(initialTab);
    }
  }, [initialTab]);

  const [calendarTasks, setCalendarTasks] = useState({});
  const [deletedCalendarTaskIds, setDeletedCalendarTaskIds] = useState([]);
  const [dailyTasks, setDailyTasks] = useState([]);
  const [customCards, setCustomCards] = useState([]);
  const [error, setError] = useState(null);
  const [showFocusMode, setShowFocusMode] = useState(false);

  useEffect(() => {
    loadLocalStorageData();
  }, []);

  const loadLocalStorageData = () => {
    try {
      const storedCalendarTasks = localStorage.getItem('calendarTasks');
      if (storedCalendarTasks) {
        try {
          const parsedCalendarTasks = JSON.parse(storedCalendarTasks);
          setCalendarTasks(parsedCalendarTasks);
        } catch (error) {
          setCalendarTasks({});
        }
      }

      const storedDailyTasks = localStorage.getItem('dailyTasks');
      if (storedDailyTasks) {
        try {
          const parsedDailyTasks = JSON.parse(storedDailyTasks);
          setDailyTasks(parsedDailyTasks);
        } catch (error) {
          setDailyTasks([]);
        }
      }

      const storedCustomCards = localStorage.getItem('taskCards');
      if (storedCustomCards) {
        try {
          const parsedCustomCards = JSON.parse(storedCustomCards);
          setCustomCards(parsedCustomCards);
        } catch (error) {
          setCustomCards([]);
        }
      }

      const storedDeletedIds = localStorage.getItem('deletedCalendarTaskIds');
      if (storedDeletedIds) {
        try {
          const parsedDeletedIds = JSON.parse(storedDeletedIds);
          setDeletedCalendarTaskIds(parsedDeletedIds);
        } catch (error) {
          setDeletedCalendarTaskIds([]);
        }
      }
    } catch (error) {
      console.error('Error loading data from localStorage', error);
    }
  };

  useEffect(() => {
    if (Object.keys(calendarTasks).length > 0) {
      localStorage.setItem('calendarTasks', JSON.stringify(calendarTasks));
    }
  }, [calendarTasks]);

  useEffect(() => {
    if (customCards.length > 0) {
      localStorage.setItem('taskCards', JSON.stringify(customCards));
    }
  }, [customCards]);

  useEffect(() => {
    if (dailyTasks.length > 0) {
      localStorage.setItem('dailyTasks', JSON.stringify(dailyTasks));
    }
  }, [dailyTasks]);

  useEffect(() => {
    if (deletedCalendarTaskIds.length > 0) {
      localStorage.setItem('deletedCalendarTaskIds', JSON.stringify(deletedCalendarTaskIds));
    }
  }, [deletedCalendarTaskIds]);

  const handleCalendarTasksChange = (updatedTasks) => {
    try {
      setCalendarTasks(updatedTasks);
    } catch (err) {
    }
  };

  const handleCustomCardsChange = (updatedCards) => {
    try {
      setCustomCards(updatedCards);
    } catch (err) {
    }
  };

  const handleDailyTasksChange = (updatedTasks) => {
    try {
      setDailyTasks(updatedTasks);
    } catch (err) {
    }
  };

  const handleTaskCardDelete = (cardId) => {
    try {
      const updatedCards = customCards.filter(card => card.id !== cardId);
      setCustomCards(updatedCards);
    } catch (err) {
    }
  };

  const toggleFocusMode = () => {
    setShowFocusMode(!showFocusMode);
  };

  const handleAddSuggestedTask = (taskTitle) => {
    if (!taskTitle || !taskTitle.trim()) return;
    
    const newTask = {
      id: Date.now(),
      title: taskTitle,
      completed: false,
      createdAt: new Date().toISOString()
    };
    
    const updatedTasks = [...dailyTasks, newTask];
    setDailyTasks(updatedTasks);
    
    if (localStorage) {
      localStorage.setItem('dailyTasks', JSON.stringify(updatedTasks));
    }
  };

  return (
    <div className="homepage-container">
      <div className="animated-background"></div>

      <LevelPopup />

      <XpPopup xpAmount={xpGained} visible={showXpPopup} onClose={closeXpPopup} />

      {showAINotification && (
        <AIUnavailableNotification onClose={() => setShowAINotification(false)} />
      )}

      {showFocusMode && <TaskFocus onClose={toggleFocusMode} />}
      
      <TaskSuggestions tasks={dailyTasks} onAddTask={handleAddSuggestedTask} />

      <div className="main-content pt-16">
        {error ? (
          <div className="bg-red-500 bg-opacity-20 border border-red-500 text-white px-4 py-3 rounded mx-4 my-4">
            {error}
          </div>
        ) : (
          <>
            <div className="time-header felx justify-between">
              <div className="flex">
                <h2 className="time-ticking-text">Time is ticking...</h2>
                <div className="time-header-right ml-2">
                  <DigitalClock />
                </div>
              </div>
              <div>
                <button className="focus-mode-button flex border-2 border-purple-300 rounded-full p-2 gap-3 items-center" onClick={toggleFocusMode}>
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Focus Mode
                </button>
              </div>
            </div>

            <div className="content-area">
              <div className="tabs-container">
                <button
                  className={`tab ${activeTab === 'daily' ? 'active' : ''}`}
                  onClick={() => setActiveTab('daily')}
                >
                  Daily Tasks
                </button>
                <button
                  className={`tab ${activeTab === 'custom' ? 'active' : ''}`}
                  onClick={() => setActiveTab('custom')}
                >
                  Custom Tasks
                </button>
                <button
                  className={`tab ${activeTab === 'calendar' ? 'active' : ''}`}
                  onClick={() => setActiveTab('calendar')}
                >
                  Calendar
                </button>
                <button
                  className={`tab ${activeTab === 'performance' ? 'active' : ''}`}
                  onClick={() => setActiveTab('performance')}
                >
                  Performance
                </button>
              </div>

              <div className="tab-content mt-4">
                {activeTab === 'daily' && (
                  <div className="daily-view">
                    <DailyTasks
                      tasks={dailyTasks}
                      onTasksChange={handleDailyTasksChange}
                      onDeleteTask={handleTaskCardDelete}
                    />
                  </div>
                )}

                {activeTab === 'custom' && (
                  <div className="custom-view">
                    <CustomTaskCards
                      cards={customCards}
                      calendarTasks={calendarTasks}
                      onCardsChange={handleCustomCardsChange}
                      onDeleteCard={handleTaskCardDelete}
                    />
                  </div>
                )}

                {activeTab === 'calendar' && (
                  <div className="calendar-view">
                    <Calendar
                      initialTasks={calendarTasks}
                      onTasksChange={handleCalendarTasksChange}
                      onDeleteTask={handleTaskCardDelete}
                    />
                  </div>
                )}

                {activeTab === 'performance' && (
                  <div className="performance-view">
                    <PerformanceAnalytics
                      dailyTasks={dailyTasks}
                      customCards={customCards}
                      calendarTasks={calendarTasks}
                    />
                  </div>
                )}
              </div>
            </div>
          </>
        )}
      </div>

      <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
    </div>
  );
}

export default Homepage; 
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

function Homepage({ initialTab, toggleSidebar, isSidebarOpen }) {
  const [activeTab, setActiveTab] = useState(initialTab || 'daily');
  const { user } = useAuth();
  const { xpGained, showXpPopup, closeXpPopup } = useLevel();

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
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../Context/AuthContext';
import { useLevel } from '../../Context/LevelContext';
import ProfileDropdown from '../Homepage/components/ProfileDropdown';
import { SidebarToggle } from '../Homepage/components/Sidebar';
import LevelDetailsPopup from '../Homepage/components/LevelDetailsPopup';

const LevelProgressRing = ({ level, progress, showDetails, setShowDetails }) => {
  const size = 36;
  const strokeWidth = 3;
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const progressOffset = circumference - progress * circumference;
  
  return (
    <div 
      className="relative inline-flex items-center justify-center mr-2 cursor-pointer"
      onMouseEnter={() => setShowDetails(true)}
      onMouseLeave={() => setShowDetails(false)}
    >
      <svg width={size} height={size} className="transform -rotate-90">
        {/* Background circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          strokeWidth={strokeWidth}
          stroke="rgba(255, 255, 255, 0.2)"
          fill="transparent"
        />
        
        {/* Progress circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          strokeWidth={strokeWidth}
          stroke="#5D1BE3"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={progressOffset}
          fill="transparent"
        />
      </svg>
      <span className="absolute text-white text-xs font-bold">{level}</span>
      
      {showDetails && (
        <div className="absolute right-0 top-10 z-50">
          <LevelDetailsPopup />
        </div>
      )}
    </div>
  );
};

const Navbar = ({ toggleSidebar, isSidebarOpen }) => {
  const { user } = useAuth();
  const { level, progress } = useLevel();
  const [showLevelDetails, setShowLevelDetails] = useState(false);

  return (
    <nav className="bg-[#362f2f57] backdrop-blur-md border-b border-[#ffffff20] shadow-lg z-50 fixed top-0 left-0 right-0">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo and sidebar toggle */}
          <div className="flex items-center">
            <SidebarToggle isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
            <Link to="/home" className="flex items-center ml-4">
              <span className="gradient-text text-xl font-bold">Level UP</span>
            </Link>
          </div>

          {/* Desktop menu */}
          <div className="hidden md:flex md:items-center">
            <div className="ml-10 flex items-center space-x-4">
              <LevelProgressRing 
                level={level} 
                progress={progress} 
                showDetails={showLevelDetails}
                setShowDetails={setShowLevelDetails}
              />
              
              <span className="text-white font-medium mr-2">
                {user?.name || 'Guest User'}
              </span>
              <div className="ml-2">
                <ProfileDropdown />
              </div>
            </div>
          </div>

          {/* Mobile menu */}
          <div className="md:hidden flex items-center">
            <div className="flex items-center">
              <LevelProgressRing 
                level={level} 
                progress={progress} 
                showDetails={showLevelDetails}
                setShowDetails={setShowLevelDetails}
              />
              
              <span className="text-white text-sm mr-2">
                {user?.name || 'Guest User'}
              </span>
              <ProfileDropdown />
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar; 
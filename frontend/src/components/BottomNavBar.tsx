import React from 'react';
import {
  Home,
  Compass,
  Navigation,
  Bell,
  User,
  ShieldAlert
} from 'lucide-react';

export type MainNavTab = 'home' | 'explore' | 'navigation' | 'alerts' | 'profile';

interface BottomNavBarProps {
  activeTab: MainNavTab;
  onSelectTab: (tab: MainNavTab) => void;
  alertCount: number;
  isJourneyActive?: boolean;
}

export const BottomNavBar: React.FC<BottomNavBarProps> = ({
  activeTab,
  onSelectTab,
  alertCount,
  isJourneyActive = false
}) => {
  return (
    <nav className="px-2 py-1.5 bg-white dark:bg-[#070E1A] border-t border-slate-200/80 dark:border-slate-800/80 sticky bottom-0 z-40 transition-colors duration-300 shadow-[0_-2px_10px_rgba(0,0,0,0.03)]">
      <div className="flex items-center justify-around">
        {/* 1. Home (Map & Route Planner) */}
        <button
          onClick={() => onSelectTab('home')}
          className={`flex flex-col items-center gap-0.5 py-1 px-3 rounded-xl transition-all ${
            activeTab === 'home'
              ? 'text-emerald-600 dark:text-emerald-400 font-extrabold'
              : 'text-slate-400 dark:text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
          }`}
        >
          <Home className={`w-5 h-5 ${activeTab === 'home' ? 'stroke-[2.5]' : 'stroke-[1.75]'}`} />
          <span className="text-[10px] font-medium">Home</span>
          {activeTab === 'home' && (
            <span className="w-1 h-1 rounded-full bg-emerald-500 mt-0.5" />
          )}
        </button>

        {/* 2. Explore / Search POIs */}
        <button
          onClick={() => onSelectTab('explore')}
          className={`flex flex-col items-center gap-0.5 py-1 px-3 rounded-xl transition-all ${
            activeTab === 'explore'
              ? 'text-emerald-600 dark:text-emerald-400 font-extrabold'
              : 'text-slate-400 dark:text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
          }`}
        >
          <Compass className={`w-5 h-5 ${activeTab === 'explore' ? 'stroke-[2.5]' : 'stroke-[1.75]'}`} />
          <span className="text-[10px] font-medium">Explore</span>
          {activeTab === 'explore' && (
            <span className="w-1 h-1 rounded-full bg-emerald-500 mt-0.5" />
          )}
        </button>

        {/* 3. Navigation (Center Elevated Guidance) */}
        <div className="-mt-4 flex flex-col items-center">
          <button
            onClick={() => onSelectTab('navigation')}
            className={`w-12 h-12 rounded-full p-0.5 transition-all shadow-lg active:scale-95 flex items-center justify-center ${
              isJourneyActive || activeTab === 'navigation'
                ? 'bg-gradient-to-tr from-emerald-600 to-teal-500 shadow-emerald-500/40 ring-4 ring-emerald-500/20'
                : 'bg-gradient-to-tr from-slate-200 to-slate-300 dark:from-slate-800 dark:to-slate-700 shadow-slate-900/10'
            }`}
            title="Active Navigation Guidance"
          >
            <div className="w-full h-full rounded-full bg-emerald-600 flex items-center justify-center">
              <Navigation className="w-5 h-5 text-white fill-white" />
            </div>
          </button>
          <span className={`text-[9px] font-bold mt-0.5 ${
            activeTab === 'navigation' ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-500'
          }`}>
            Nav
          </span>
        </div>

        {/* 4. Alerts / Safety Hub */}
        <button
          onClick={() => onSelectTab('alerts')}
          className={`flex flex-col items-center gap-0.5 py-1 px-3 rounded-xl transition-all relative ${
            activeTab === 'alerts'
              ? 'text-emerald-600 dark:text-emerald-400 font-extrabold'
              : 'text-slate-400 dark:text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
          }`}
        >
          <div className="relative">
            <Bell className={`w-5 h-5 ${activeTab === 'alerts' ? 'stroke-[2.5]' : 'stroke-[1.75]'}`} />
            {alertCount > 0 && (
              <span className="absolute -top-1 -right-1.5 w-3.5 h-3.5 rounded-full bg-rose-500 text-[9px] font-bold text-white flex items-center justify-center">
                {alertCount}
              </span>
            )}
          </div>
          <span className="text-[10px] font-medium">Alerts</span>
          {activeTab === 'alerts' && (
            <span className="w-1 h-1 rounded-full bg-emerald-500 mt-0.5" />
          )}
        </button>

        {/* 5. Profile & Settings */}
        <button
          onClick={() => onSelectTab('profile')}
          className={`flex flex-col items-center gap-0.5 py-1 px-3 rounded-xl transition-all ${
            activeTab === 'profile'
              ? 'text-emerald-600 dark:text-emerald-400 font-extrabold'
              : 'text-slate-400 dark:text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
          }`}
        >
          <User className={`w-5 h-5 ${activeTab === 'profile' ? 'stroke-[2.5]' : 'stroke-[1.75]'}`} />
          <span className="text-[10px] font-medium">Profile</span>
          {activeTab === 'profile' && (
            <span className="w-1 h-1 rounded-full bg-emerald-500 mt-0.5" />
          )}
        </button>
      </div>
    </nav>
  );
};

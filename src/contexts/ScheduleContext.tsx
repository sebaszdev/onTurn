
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export interface Schedule {
  id: number;
  client: string;
  service: string;
  date: string;
  time: string;
  duration: number;
  status: 'confirmed' | 'pending' | 'completed' | 'cancelled';
}

interface ScheduleContextType {
  schedules: Schedule[];
  addSchedule: (schedule: Omit<Schedule, 'id'>) => void;
  updateSchedule: (id: number, schedule: Partial<Schedule>) => void;
  deleteSchedule: (id: number) => void;
}

const ScheduleContext = createContext<ScheduleContextType | undefined>(undefined);

const STORAGE_KEY = 'appointments_schedules';

export const ScheduleProvider = ({ children }: { children: ReactNode }) => {
  const [schedules, setSchedules] = useState<Schedule[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        setSchedules(JSON.parse(stored));
      } catch (error) {
        console.error('Error parsing stored schedules:', error);
        setSchedules([]);
      }
    } else {
      setSchedules([]);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(schedules));
  }, [schedules]);

  const addSchedule = (schedule: Omit<Schedule, 'id'>) => {
    const newId = schedules.length > 0 ? Math.max(...schedules.map(s => s.id)) + 1 : 1;
    const newSchedule = { ...schedule, id: newId };
    setSchedules(prev => [...prev, newSchedule]);
  };

  const updateSchedule = (id: number, updatedSchedule: Partial<Schedule>) => {
    setSchedules(prev => 
      prev.map(schedule => 
        schedule.id === id ? { ...schedule, ...updatedSchedule } : schedule
      )
    );
  };

  const deleteSchedule = (id: number) => {
    setSchedules(prev => prev.filter(schedule => schedule.id !== id));
  };

  return (
    <ScheduleContext.Provider value={{
      schedules,
      addSchedule,
      updateSchedule,
      deleteSchedule
    }}>
      {children}
    </ScheduleContext.Provider>
  );
};

export const useSchedules = () => {
  const context = useContext(ScheduleContext);
  if (context === undefined) {
    throw new Error('useSchedules must be used within a ScheduleProvider');
  }
  return context;
};

import React, { createContext, useContext, useReducer } from 'react';

const ExerciseContext = createContext();

const initialState = {
  schedule: {
    شنبه: ['پرس سینه - 3×12', 'جلو بازو - 4×10', 'زیر بغل - 3×12'],
    یکشنبه: ['اسکوات - 4×10', 'جلو پا - 3×12', 'ساق پا - 4×15'],
    دوشنبه: ['شنا - 3×15', 'پشت بازو - 4×12', 'سرشانه - 3×12'],
    سه‌شنبه: ['ددلیفت - 3×10', 'پشت پا - 4×12', 'ساق پا - 3×15'],
    چهارشنبه: ['پرس سینه - 4×10', 'سرشانه - 3×12', 'جلو بازو - 3×12'],
    پنج‌شنبه: ['اسکوات - 3×12', 'پشت پا - 4×10', 'ساق پا - 4×15'],
    جمعه: ['استراحت']
  },
  todos: [
    { text: 'تمرین سینه و جلو بازو', completed: false },
    { text: 'تمرین پا', completed: true },
    { text: '45 دقیقه کاردیو', completed: false }
  ],
  stats: {
    weeklyMinutes: 280,
    totalExercises: 145,
    streak: 12
  }
};

const exerciseReducer = (state, action) => {
  switch (action.type) {
    case 'SET_SCHEDULE':
      return { ...state, schedule: action.payload };
    case 'SET_TODOS':
      return { ...state, todos: action.payload };
    case 'SET_STATS':
      return { ...state, stats: action.payload };
    default:
      return state;
  }
};

export const ExerciseProvider = ({ children }) => {
  const [state, dispatch] = useReducer(exerciseReducer, initialState);

  return (
    <ExerciseContext.Provider value={{ state, dispatch }}>
      {children}
    </ExerciseContext.Provider>
  );
};

export const useExercise = () => {
  const context = useContext(ExerciseContext);
  if (!context) {
    throw new Error('useExercise must be used within an ExerciseProvider');
  }
  return context;
};
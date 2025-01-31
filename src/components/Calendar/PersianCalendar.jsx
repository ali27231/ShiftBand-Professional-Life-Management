import React, { useState, useEffect } from 'react';
import moment from 'moment-jalaali';
import './PersianCalendar.css';

const PersianCalendar = ({ onShiftSelect, onSave }) => {
  const [currentDate] = useState(moment());
  const [daysInMonth, setDaysInMonth] = useState([]);
  const [selectedShifts, setSelectedShifts] = useState({});

  const shifts = [
    { id: 'morning', label: 'صبح', color: '#4CAF50' },
    { id: 'afternoon', label: 'ظهر', color: '#FFC107' },
    { id: 'night', label: 'شب', color: '#2196F3' },
    { id: 'off', label: 'مرخصی', color: '#F44336' }
  ];

  const getRemainingDays = () => {
    const today = currentDate.jDate();
    const daysInCurrentMonth = moment.jDaysInMonth(
      currentDate.jYear(),
      currentDate.jMonth()
    );

    return Array.from(
      { length: daysInCurrentMonth - today + 1 },
      (_, index) => {
        const day = today + index;
        const date = moment(currentDate)
          .jDate(day)
          .format('jYYYY/jMM/jDD');

        return {
          day,
          date,
          dayOfWeek: moment(currentDate).jDate(day).format('dddd')
        };
      }
    );
  };

  useEffect(() => {
    setDaysInMonth(getRemainingDays());
  }, []);

  const handleShiftSelect = (date, shiftId) => {
    setSelectedShifts(prev => ({
      ...prev,
      [date]: shiftId
    }));
    onShiftSelect?.(date, shiftId);
  };

  return (
    <div className="persian-calendar">
      <div className="calendar-header">
        <h2>{currentDate.format('jMMMM jYYYY')}</h2>
      </div>

      <div className="calendar-body">
        {daysInMonth.map(day => (
          <div key={day.date} className="day-container">
            <div className="day-header">
              <span className="day-number">{day.day}</span>
              <span className="day-name">{day.dayOfWeek}</span>
            </div>
            <div className="shifts-container">
              {shifts.map(shift => (
                <button
                  key={shift.id}
                  className={`shift-button ${
                    selectedShifts[day.date] === shift.id ? 'selected' : ''
                  }`}
                  style={{
                    '--shift-color': shift.color
                  }}
                  onClick={() => handleShiftSelect(day.date, shift.id)}
                >
                  {shift.label}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="calendar-footer">
        <button
          className="save-button"
          onClick={() => onSave?.(selectedShifts)}
        >
          ذخیره برنامه شیفت
        </button>
      </div>
    </div>
  );
};

export default PersianCalendar;
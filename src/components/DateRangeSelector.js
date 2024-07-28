import React, { useState, useEffect } from 'react';

const DateRangeSelector = ({ punishmentsData, violationsData, onDateRangeChange }) => {
  const [availableDates, setAvailableDates] = useState([]);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  useEffect(() => {
    if (punishmentsData || violationsData) {
      const punishmentDates = punishmentsData ? Object.keys(punishmentsData.punishmentsByDate) : [];
      const violationDates = violationsData ? Object.keys(violationsData.violationsByDate) : [];
      const allDates = [...new Set([...punishmentDates, ...violationDates])];
      
      // Standardize and sort dates
      const standardizedDates = allDates.map(date => {
        // Check if the date is already in MM-DD-YYYY format
        if (/^\d{2}-\d{2}-\d{4}$/.test(date)) {
          return date;
        }
        // If it's in YYYY-MM-DD format, convert to MM-DD-YYYY
        const [year, month, day] = date.split('-');
        return `${month}-${day}-${year}`;
      }).sort((a, b) => new Date(a) - new Date(b));

      setAvailableDates(standardizedDates);
      setStartDate(standardizedDates[0]);
      setEndDate(standardizedDates[standardizedDates.length - 1]);
    }
  }, [punishmentsData, violationsData]);

  useEffect(() => {
    if (startDate && endDate) {
      onDateRangeChange(startDate, endDate);
    }
  }, [startDate, endDate, onDateRangeChange]);

  const handleStartDateChange = (e) => {
    const newStartDate = e.target.value;
    setStartDate(newStartDate);
    if (new Date(newStartDate) > new Date(endDate)) {
      setEndDate(newStartDate);
    }
  };

  const handleEndDateChange = (e) => {
    const newEndDate = e.target.value;
    setEndDate(newEndDate);
    if (new Date(newEndDate) < new Date(startDate)) {
      setStartDate(newEndDate);
    }
  };

  return (
    <div className="mt-4 flex flex-col sm:flex-row sm:space-x-4">
      <div className="mb-4 sm:mb-0">
        <label htmlFor="start-date" className="block text-sm font-medium text-gray-700">Start Date</label>
        <select
          id="start-date"
          value={startDate}
          onChange={handleStartDateChange}
          className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
        >
          {availableDates.map((date) => (
            <option key={date} value={date}>{date}</option>
          ))}
        </select>
      </div>
      <div>
        <label htmlFor="end-date" className="block text-sm font-medium text-gray-700">End Date</label>
        <select
          id="end-date"
          value={endDate}
          onChange={handleEndDateChange}
          className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
        >
          {availableDates.map((date) => (
            <option key={date} value={date}>{date}</option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default DateRangeSelector;
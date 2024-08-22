import React, { useState, useCallback } from 'react';
import FileUpload from './components/FileUpload';
import PunishmentsAnalysis from './components/PunishmentsAnalysis';
import ViolationsAnalysis from './components/ViolationsAnalysis';
import PlayerSearch from './components/PlayerSearch';
import DateRangeSelector from './components/DateRangeSelector';
import { parsePunishments, parseViolations, filterDataByDateRange } from './utils/logParser';

const App = () => {
  const [punishmentsData, setPunishmentsData] = useState(null);
  const [violationsData, setViolationsData] = useState(null);
  const [filteredPunishmentsData, setFilteredPunishmentsData] = useState(null);
  const [filteredViolationsData, setFilteredViolationsData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [uploadedFiles, setUploadedFiles] = useState({
    punishments: null,
    violations: null
  });

  const handleFileUpload = async (file, fileType) => {
    setIsLoading(true);
    setError(null);
    try {
      const content = await file.text();
      if (fileType === 'punishments') {
        const data = parsePunishments(content);
        setPunishmentsData(data);
        setFilteredPunishmentsData(data);
        setUploadedFiles(prev => ({ ...prev, punishments: file.name }));
      } else if (fileType === 'violations') {
        const data = parseViolations(content);
        setViolationsData(data);
        setFilteredViolationsData(data);
        setUploadedFiles(prev => ({ ...prev, violations: file.name }));
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRemoveFile = (fileType) => {
    if (fileType === 'punishments') {
      setPunishmentsData(null);
      setFilteredPunishmentsData(null);
      setUploadedFiles(prev => ({ ...prev, punishments: null }));
    } else if (fileType === 'violations') {
      setViolationsData(null);
      setFilteredViolationsData(null);
      setUploadedFiles(prev => ({ ...prev, violations: null }));
    }
  };

  const handleDateRangeChange = useCallback((startDate, endDate) => {
    if (punishmentsData) {
      setFilteredPunishmentsData(filterDataByDateRange(punishmentsData, startDate, endDate));
    }
    if (violationsData) {
      setFilteredViolationsData(filterDataByDateRange(violationsData, startDate, endDate));
    }
  }, [punishmentsData, violationsData]);

  return (
    <div className="min-h-screen bg-gray-100 py-6 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white shadow-xl rounded-3xl overflow-hidden">
          <div className="bg-gradient-to-r from-[#2461f1] to-[#8044f6] px-6 py-8 sm:px-12 sm:py-12 text-center">
            <h1 className="text-5xl font-bold text-white">Vulcan Anticheat Analysis</h1>
          </div>
          <div className="px-6 py-8 sm:px-12">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FileUpload 
                onFileUpload={(file) => handleFileUpload(file, 'punishments')} 
                fileType="punishments"
                uploadedFile={uploadedFiles.punishments}
                onRemoveFile={() => handleRemoveFile('punishments')}
              />
              <FileUpload 
                onFileUpload={(file) => handleFileUpload(file, 'violations')} 
                fileType="violations"
                uploadedFile={uploadedFiles.violations}
                onRemoveFile={() => handleRemoveFile('violations')}
              />
            </div>
            {isLoading && (
              <div className="mt-4 text-center">
                <p className="text-lg">Analyzing data...</p>
              </div>
            )}
            {error && (
              <div className="mt-4 text-center text-red-600">
                <p>{error}</p>
              </div>
            )}
            {(punishmentsData || violationsData) && (
              <DateRangeSelector
                punishmentsData={punishmentsData}
                violationsData={violationsData}
                onDateRangeChange={handleDateRangeChange}
              />
            )}
            {filteredPunishmentsData && <PunishmentsAnalysis data={filteredPunishmentsData} />}
            {filteredViolationsData && <ViolationsAnalysis data={filteredViolationsData} />}
            {(filteredPunishmentsData || filteredViolationsData) && (
              <PlayerSearch 
                punishmentsData={filteredPunishmentsData} 
                violationsData={filteredViolationsData} 
              />
            )}
          </div>
        </div>
      </div>
      <footer className="mt-8 text-center text-sm text-gray-500">
        <p>
          Developed by{' '}
          <a
            href="https://github.com/Kaludii"
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-500 hover:text-blue-600 transition-colors"
            title="Visit Kaludi's GitHub profile"
          >
            Kaludi
          </a>{' '}
          | Made for Vulcan Anticheat Analytics
        </p>
      </footer>
    </div>
  );
};

export default App;
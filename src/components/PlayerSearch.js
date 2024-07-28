import React, { useState } from 'react';
import { searchPlayerPunishments, searchPlayerViolations } from '../utils/logParser';

const PlayerSearch = ({ punishmentsData, violationsData }) => {
  const [playerName, setPlayerName] = useState('');
  const [searchResults, setSearchResults] = useState(null);
  const [error, setError] = useState(null);

  const handleSearch = () => {
    if (playerName) {
      const punishmentResults = punishmentsData ? searchPlayerPunishments(punishmentsData, playerName) : null;
      const violationResults = violationsData ? searchPlayerViolations(violationsData, playerName) : null;

      console.log('Punishment Results:', punishmentResults);
      console.log('Violation Results:', violationResults);

      if ((!punishmentResults || punishmentResults.totalPunishments === 0) && 
          (!violationResults || violationResults.totalViolations === 0)) {
        setError(`No data found for player: ${playerName}`);
        setSearchResults(null);
      } else {
        setSearchResults({ punishments: punishmentResults, violations: violationResults });
        setError(null);
      }
    } else {
      setError("Please enter a player name");
      setSearchResults(null);
    }
  };

  return (
    <div className="mt-8 bg-white p-6 rounded-lg shadow">
      <h2 className="text-2xl font-bold mb-4">Player Search</h2>
      <div className="flex space-x-2 mb-4">
        <input
          type="text"
          value={playerName}
          onChange={(e) => setPlayerName(e.target.value)}
          placeholder="Enter player name"
          className="flex-grow px-3 py-2 border border-gray-300 rounded-md"
        />
        <button
          onClick={handleSearch}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          Search
        </button>
      </div>
      {error && (
        <div className="text-red-600 mb-4">{error}</div>
      )}
      {searchResults && (
        <div>
          <h3 className="text-xl font-semibold mb-2">Results for {playerName}</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {searchResults.punishments && searchResults.punishments.totalPunishments > 0 ? (
              <div>
                <h4 className="text-lg font-semibold">Punishments</h4>
                <p>Total: {searchResults.punishments.totalPunishments}</p>
                <h5 className="font-semibold mt-2">By Type:</h5>
                <ul>
                  {Object.entries(searchResults.punishments.punishmentsByType).map(([type, count]) => (
                    <li key={type}>{type}: {count}</li>
                  ))}
                </ul>
                <h5 className="font-semibold mt-2">By World:</h5>
                <ul>
                  {Object.entries(searchResults.punishments.punishmentsByWorld).map(([world, count]) => (
                    <li key={world}>{world}: {count}</li>
                  ))}
                </ul>
                <h5 className="font-semibold mt-2">Recent Punishments:</h5>
                <ul>
                  {searchResults.punishments.recentPunishments.map((p, index) => (
                    <li key={index}>{p.date}: {p.type} in {p.world || 'Unknown World'}</li>
                  ))}
                </ul>
              </div>
            ) : (
              <div>
                <h4 className="text-lg font-semibold">Punishments</h4>
                <p>No punishments found for this player.</p>
              </div>
            )}
            {searchResults.violations && searchResults.violations.totalViolations > 0 ? (
              <div>
                <h4 className="text-lg font-semibold">Violations</h4>
                <p>Total: {searchResults.violations.totalViolations}</p>
                <h5 className="font-semibold mt-2">By Type:</h5>
                <ul>
                  {Object.entries(searchResults.violations.violationsByType).map(([type, count]) => (
                    <li key={type}>{type}: {count}</li>
                  ))}
                </ul>
                <h5 className="font-semibold mt-2">By Version:</h5>
                <ul>
                  {Object.entries(searchResults.violations.violationsByVersion).map(([version, count]) => (
                    <li key={version}>Version {version}: {count}</li>
                  ))}
                </ul>
                <h5 className="font-semibold mt-2">Recent Violations:</h5>
                <ul>
                  {searchResults.violations.recentViolations.map((v, index) => (
                    <li key={index}>{v.date} {v.time}: {v.type} (VL: {v.vl})</li>
                  ))}
                </ul>
              </div>
            ) : (
              <div>
                <h4 className="text-lg font-semibold">Violations</h4>
                <p>No violations found for this player.</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default PlayerSearch;
// Helper function to format date to MM-DD-YYYY
const formatDate = (dateString) => {
  if (/^\d{2}-\d{2}-\d{4}$/.test(dateString)) return dateString;
  const [year, month, day] = dateString.split('-');
  return `${month.padStart(2, '0')}-${day.padStart(2, '0')}-${year}`;
};

// Helper function to parse MM-DD-YYYY to Date object
const parseDate = (dateString) => {
  const [month, day, year] = dateString.split('-');
  return new Date(year, month - 1, day);
};

export const parsePunishments = (content) => {
  const punishments = content.split('--------------[').filter(p => p.trim() !== '');

  let totalPunishments = 0;
  const punishmentsByType = {};
  const punishmentsByPlayer = {};
  const punishmentsByWorld = {};
  const punishmentsByDate = {};
  const playerPunishments = {};

  punishments.forEach(punishment => {
    const lines = punishment.trim().split('\n');
    if (lines.length > 1) {
      const headerMatch = lines[0].match(/(.*?) was punished for (.*?)\]-/);
      if (headerMatch) {
        totalPunishments++;
        const player = headerMatch[1].trim();
        const type = headerMatch[2].trim();
        
        punishmentsByType[type] = (punishmentsByType[type] || 0) + 1;
        punishmentsByPlayer[player] = (punishmentsByPlayer[player] || 0) + 1;

        let date = formatDate(new Date().toISOString().split('T')[0]); // Default to current date
        let world = 'Unknown';
        let uuid = '';

        lines.forEach(line => {
          if (line.includes('Date:')) {
            date = formatDate(line.split('Date:')[1].trim());
          } else if (line.includes('World:')) {
            world = line.split('World:')[1].trim();
          } else if (line.includes('UUID:')) {
            uuid = line.split('UUID:')[1].trim();
          }
        });

        punishmentsByDate[date] = (punishmentsByDate[date] || 0) + 1;
        punishmentsByWorld[world] = (punishmentsByWorld[world] || 0) + 1;

        if (!playerPunishments[player]) {
          playerPunishments[player] = [];
        }
        playerPunishments[player].push({ type, date, world, uuid });

        console.log(`Parsed punishment for player: ${player}, type: ${type}, date: ${date}, world: ${world}`);
      }
    }
  });

  console.log('Parsed Punishments:', { totalPunishments, punishmentsByPlayer, playerPunishments });

  return {
    totalPunishments,
    punishmentsByType,
    punishmentsByPlayer,
    punishmentsByWorld,
    punishmentsByDate,
    playerPunishments
  };
};

export const parseViolations = (content) => {
  const lines = content.split('\n');

  let totalViolations = 0;
  const violationsByType = {};
  const violationsByPlayer = {};
  const violationsByDate = {};
  const violationsByVersion = {};
  const violationsByPing = {};
  const playerViolations = {};

  lines.forEach(line => {
    const match = line.match(/\[(.*?)\] \[(.*?)\] (.*?) failed (.*?) \[VL: (\d+)\] \[Ping: (\d+)\] \[TPS: [\d.]+\] \[Version: ([\d.]+)\]/);
    if (match) {
      totalViolations++;
      const [, rawDate, time, player, type, vl, ping, version] = match;
      const date = formatDate(rawDate);
      
      violationsByType[type] = (violationsByType[type] || 0) + 1;
      violationsByPlayer[player] = (violationsByPlayer[player] || 0) + 1;
      
      violationsByDate[date] = (violationsByDate[date] || 0) + 1;
      violationsByVersion[version] = (violationsByVersion[version] || 0) + 1;

      const pingRange = Math.floor(parseInt(ping) / 50) * 50;
      const pingKey = `${pingRange}-${pingRange + 49}ms`;
      violationsByPing[pingKey] = (violationsByPing[pingKey] || 0) + 1;

      if (!playerViolations[player]) {
        playerViolations[player] = [];
      }
      playerViolations[player].push({ date, time, type, vl, ping, version });

      console.log(`Parsed violation for player: ${player}, type: ${type}, date: ${date}, time: ${time}`);
    }
  });

  console.log('Parsed Violations:', { totalViolations, violationsByPlayer, playerViolations });

  return {
    totalViolations,
    violationsByType,
    violationsByPlayer,
    violationsByDate,
    violationsByVersion,
    violationsByPing,
    playerViolations
  };
};

export const searchPlayerPunishments = (punishmentsData, playerName) => {
  const normalizedPlayerName = playerName.toLowerCase();
  const playerPunishments = punishmentsData.playerPunishments[playerName] || 
                            Object.entries(punishmentsData.playerPunishments).find(
                              ([name, _]) => name.toLowerCase() === normalizedPlayerName
                            )?.[1] || [];

  console.log('Searching punishments for:', playerName);
  console.log('Player Punishments:', playerPunishments);

  return {
    totalPunishments: playerPunishments.length,
    punishmentsByType: playerPunishments.reduce((acc, p) => {
      acc[p.type] = (acc[p.type] || 0) + 1;
      return acc;
    }, {}),
    punishmentsByWorld: playerPunishments.reduce((acc, p) => {
      if (p.world) {
        acc[p.world] = (acc[p.world] || 0) + 1;
      }
      return acc;
    }, {}),
    punishmentsByDate: playerPunishments.reduce((acc, p) => {
      if (p.date) {
        acc[p.date] = (acc[p.date] || 0) + 1;
      }
      return acc;
    }, {}),
    recentPunishments: playerPunishments.slice(-10).reverse() // Get the 10 most recent punishments
  };
};

export const searchPlayerViolations = (violationsData, playerName) => {
  const normalizedPlayerName = playerName.toLowerCase();
  const playerViolations = violationsData.playerViolations[playerName] || 
                           Object.entries(violationsData.playerViolations).find(
                             ([name, _]) => name.toLowerCase() === normalizedPlayerName
                           )?.[1] || [];

  console.log('Searching violations for:', playerName);
  console.log('Player Violations:', playerViolations);

  return {
    totalViolations: playerViolations.length,
    violationsByType: playerViolations.reduce((acc, v) => {
      acc[v.type] = (acc[v.type] || 0) + 1;
      return acc;
    }, {}),
    violationsByDate: playerViolations.reduce((acc, v) => {
      acc[v.date] = (acc[v.date] || 0) + 1;
      return acc;
    }, {}),
    violationsByVersion: playerViolations.reduce((acc, v) => {
      acc[v.version] = (acc[v.version] || 0) + 1;
      return acc;
    }, {}),
    recentViolations: playerViolations.slice(-10).reverse() // Get the 10 most recent violations
  };
};

export const filterDataByDateRange = (data, startDate, endDate) => {
  const start = parseDate(startDate);
  const end = parseDate(endDate);

  const filteredPlayerData = Object.fromEntries(
    Object.entries(data.playerPunishments || data.playerViolations).map(([player, records]) => [
      player,
      records.filter(r => {
        const recordDate = parseDate(r.date);
        return recordDate >= start && recordDate <= end;
      })
    ])
  );

  const filteredDateData = Object.fromEntries(
    Object.entries(data.punishmentsByDate || data.violationsByDate).filter(([date]) => {
      const currentDate = parseDate(date);
      return currentDate >= start && currentDate <= end;
    })
  );

  const totalCount = Object.values(filteredDateData).reduce((sum, count) => sum + count, 0);

  const filteredTypeData = Object.entries(filteredPlayerData).reduce((acc, [player, records]) => {
    records.forEach(record => {
      acc[record.type] = (acc[record.type] || 0) + 1;
    });
    return acc;
  }, {});

  const filteredPlayerCounts = Object.entries(filteredPlayerData).reduce((acc, [player, records]) => {
    acc[player] = records.length;
    return acc;
  }, {});

  console.log('Filtered Data:', {
    startDate,
    endDate,
    filteredPlayerData,
    filteredDateData,
    filteredTypeData,
    filteredPlayerCounts,
    totalCount
  });

  return {
    ...data,
    [data.playerPunishments ? 'playerPunishments' : 'playerViolations']: filteredPlayerData,
    [data.punishmentsByDate ? 'punishmentsByDate' : 'violationsByDate']: filteredDateData,
    [data.punishmentsByType ? 'punishmentsByType' : 'violationsByType']: filteredTypeData,
    [data.punishmentsByPlayer ? 'punishmentsByPlayer' : 'violationsByPlayer']: filteredPlayerCounts,
    [data.totalPunishments ? 'totalPunishments' : 'totalViolations']: totalCount
  };
};
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line } from 'recharts';

const ViolationsAnalysis = ({ data }) => {
  const { totalViolations, violationsByType, violationsByPlayer, violationsByDate } = data;

  const violationTypeData = Object.entries(violationsByType).map(([type, count]) => ({ type, count }));

  const topPlayers = Object.entries(violationsByPlayer)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
    .map(([player, count], index) => ({ player, count, rank: index + 1 }));

  // Ensure there are always 10 entries
  while (topPlayers.length < 10) {
    topPlayers.push({ player: `-`, count: 0, rank: topPlayers.length + 1 });
  }

  const violationTrendData = Object.entries(violationsByDate).map(([date, count]) => ({ date, count }));

  return (
    <div className="mt-8 space-y-8">
      <h2 className="text-2xl font-bold">Violations Analysis</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-2">Total Violations</h3>
          <p className="text-3xl font-bold">{totalViolations}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-2">Violations by Type</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={violationTypeData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="type" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="count" fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-2">Top 10 Violating Players</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={topPlayers} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" />
              <YAxis dataKey="player" type="category" width={150} />
              <Tooltip />
              <Legend />
              <Bar dataKey="count" fill="#82ca9d" />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-2">Violations Trend</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={violationTrendData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="count" stroke="#8884d8" name="Violations" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default ViolationsAnalysis;
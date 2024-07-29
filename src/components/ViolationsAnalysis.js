import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';

const colors = [
  '#FF6633', '#FF33FF', '#00B3E6', '#E6B333', '#3366E6', '#999966', '#99FF99', '#B34D4D',
  '#80B300', '#809900', '#E6B3B3', '#6680B3', '#66991A', '#FF99E6', '#FF1A66', '#E6331A', '#33FFCC',
  '#66994D', '#B366CC', '#4D8000', '#B33300', '#CC80CC', '#66664D', '#991AFF', '#E666FF', '#4DB3FF', '#1AB399',
  '#E666B3', '#33991A', '#CC9999', '#B3B31A', '#00E680', '#4D8066', '#809980', '#1AFF33', '#999933',
  '#FF3380', '#66E64D', '#4D80CC', '#9900B3', '#E64D66', '#4DB380', '#FF4D4D', '#99E6E6', '#6666FF'
];

const ViolationsAnalysis = ({ data }) => {
  const { totalViolations, violationsByType, violationsByPlayer, violationsByDate } = data;

  const violationTypeData = Object.entries(violationsByType)
    .map(([type, count], index) => ({ 
      type, 
      count,
      fill: colors[index % colors.length]
    }))
    .sort((a, b) => b.count - a.count);

  const topPlayers = Object.entries(violationsByPlayer)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
    .map(([player, count], index) => ({ player, count, rank: index + 1 }));

  // Ensure there are always 10 entries
  while (topPlayers.length < 10) {
    topPlayers.push({ player: `-`, count: 0, rank: topPlayers.length + 1 });
  }

  const violationTrendData = Object.entries(violationsByDate)
    .map(([date, count]) => ({ date, count }))
    .sort((a, b) => new Date(a.date) - new Date(b.date));

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-2 border border-gray-300 shadow-md">
          <p className="font-bold">{payload[0].payload.type}</p>
          <p>Count: {payload[0].value}</p>
        </div>
      );
    }
    return null;
  };

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
            <BarChart data={violationTypeData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="type" tick={false} />
              <YAxis />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="count" fill={(entry) => entry.fill} />
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
              <Line type="monotone" dataKey="count" stroke="#8884d8" name="Violations" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default ViolationsAnalysis;
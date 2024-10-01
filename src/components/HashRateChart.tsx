"use client"

import { useState, useEffect } from 'react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

interface ChartData {
  name: string
  hashrate: string
}

interface HashRateChartProps {
  initialHashrate: string
}

async function fetchHashrate() {
  const response = await fetch('/api/hashrate')
  const data = await response.json()
  return data.hashrate1d
}

const HashRateChart: React.FC<HashRateChartProps> = ({ initialHashrate }) => {
  const [chartData, setChartData] = useState<ChartData[]>([])

  useEffect(() => {
    const updateChart = async () => {
      const newHashrate = await fetchHashrate()
      const now = new Date()
      setChartData(prevData => {
        const newData = [
          ...prevData,
          { name: now.toLocaleTimeString(), hashrate: newHashrate }
        ].slice(-14) // Keep only the last 14 data points (7 hours)
        return newData
      })
    }

    // Initialize chart data
    setChartData([{ name: new Date().toLocaleTimeString(), hashrate: initialHashrate }])

    // Update every 10 minutes
    const intervalId = setInterval(updateChart, 10 * 60 * 1000)

    return () => clearInterval(intervalId)
  }, [initialHashrate])

  const parseHashrate = (value: string): number => {
    const multipliers: { [key: string]: number } = { 'K': 1e3, 'M': 1e6, 'G': 1e9, 'T': 1e12, 'P': 1e15, 'E': 1e18 }
    const match = value.match(/^(\d+(?:\.\d+)?)\s*([KMGTPE])?/)
    if (match) {
      const [, num, unit] = match
      return parseFloat(num) * (unit ? multipliers[unit] : 1)
    }
    return 0
  }

  const formatHashrate = (value: string): string => {
    const numValue = parseHashrate(value)
    if (numValue >= 1e18) return `${(numValue / 1e18).toFixed(2)}E`
    if (numValue >= 1e15) return `${(numValue / 1e15).toFixed(2)}P`
    if (numValue >= 1e12) return `${(numValue / 1e12).toFixed(2)}T`
    if (numValue >= 1e9) return `${(numValue / 1e9).toFixed(2)}G`
    if (numValue >= 1e6) return `${(numValue / 1e6).toFixed(2)}M`
    if (numValue >= 1e3) return `${(numValue / 1e3).toFixed(2)}K`
    return numValue.toFixed(2)
  }

  return (
    <div className="h-[300px]">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" stroke="#444" />
          <XAxis dataKey="name" stroke="#888" />
          <YAxis 
            stroke="#888" 
            tickFormatter={(value) => formatHashrate(value.toString())}
            label={{ value: 'Hashrate', angle: -90, position: 'insideLeft', fill: '#888'}} 
          />
          <Tooltip 
            contentStyle={{ backgroundColor: '#333', border: 'none' }}
            formatter={(value: string) => [formatHashrate(value), 'Hashrate']}
          />
          <Line type="monotone" dataKey="hashrate" stroke="#4ade80" strokeWidth={2} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}

export default HashRateChart
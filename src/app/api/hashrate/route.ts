import { NextResponse } from 'next/server'

interface PoolData {
  // First object
  runtime: number;
  lastupdate: number;
  Users: number;
  Workers: number;
  Idle: number;
  Disconnected: number;

  // Second object
  hashrate1m: string;
  hashrate5m: string;
  hashrate15m: string;
  hashrate1hr: string;
  hashrate6hr: string;
  hashrate1d: string;
  hashrate7d: string;

  // Third object
  diff: number;
  accepted: number;
  rejected: number;
  bestshare: number;
  SPS1m: number;
  SPS5m: number;
  SPS15m: number;
  SPS1h: number;
}

async function getPoolData(): Promise<PoolData> {
  const response = await fetch('https://solo.ckpool.org/pool/pool.status', { next: { revalidate: 60 } })
  const text = await response.text()
  const objects = text.split('\n').filter(line => line.trim() !== '').map(line => JSON.parse(line))
  
  // Merge all objects into one
  const poolData = objects.reduce((acc, obj) => ({ ...acc, ...obj }), {}) as PoolData

  if (!poolData.hashrate1d) {
    throw new Error('Invalid pool data: hashrate1d is missing')
  }
  
  return poolData
}

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const poolData = await getPoolData()
    return NextResponse.json({ 
      hashrate1d: poolData.hashrate1d,
      hashrate7d: poolData.hashrate7d
    })
  } catch (error) {
    console.error('Error fetching pool data:', error)
    return NextResponse.json({ error: 'Failed to fetch pool data' }, { status: 500 })
  }
}
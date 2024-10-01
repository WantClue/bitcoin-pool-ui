import { NextResponse } from 'next/server'

async function getPoolData() {
  const response = await fetch('https://solo.ckpool.org/pool/pool.status', { cache: 'no-store' })
  const text = await response.text()
  const lines = text.split('\n').filter(line => line.trim() !== '')
  return lines.reduce((acc, line) => ({ ...acc, ...JSON.parse(line) }), {})
}

export async function GET() {
  const poolData = await getPoolData()
  return NextResponse.json({ hashrate7d: poolData.hashrate1d })
}
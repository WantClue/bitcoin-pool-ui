import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Bitcoin, Users, Cpu, Clock } from 'lucide-react'
import dynamic from 'next/dynamic'
import { Suspense } from 'react'

const HashRateChart = dynamic(() => import('../components/HashRateChart'), { ssr: false })
const UserStatsForm = dynamic(() => import('../components/UserStatsForm'), { ssr: false })

interface PoolData {
  Users?: number;
  Workers?: number;
  hashrate1m?: string;
  hashrate1d?: string;
  runtime?: number;
}

async function getPoolData(): Promise<PoolData> {
  const response = await fetch('https://solo.ckpool.org/pool/pool.status', { cache: 'no-store' })
  const text = await response.text()
  const lines = text.split('\n').filter(line => line.trim() !== '')
  return lines.reduce((acc, line) => ({ ...acc, ...JSON.parse(line) }), {}) as PoolData
}

export default async function Home() {
  const poolData = await getPoolData()

  const uptimeInSeconds = poolData.runtime || 0
  const uptimeDays = Math.floor(uptimeInSeconds / 86400)
  const uptimeHours = Math.floor((uptimeInSeconds % 86400) / 3600)
  const uptimeMinutes = Math.floor((uptimeInSeconds % 3600) / 60)

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100">
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold mb-8 text-center text-green-400">Solo.Ckpool.org</h1>
        <p className="text-1xl font-bold mb-8 text-center text-green-400">To connect simply use: stratum+tcp://solo.ckpool.org:3333</p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="bg-gray-800 border-green-500">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Users</CardTitle>
              <Users className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{poolData?.Users || 0}</div>
            </CardContent>
          </Card>
          <Card className="bg-gray-800 border-green-500">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Workers</CardTitle>
              <Cpu className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{poolData?.Workers || 0}</div>
            </CardContent>
          </Card>
          <Card className="bg-gray-800 border-green-500">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Current Hashrate</CardTitle>
              <Bitcoin className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{poolData?.hashrate1m || '0'}</div>
            </CardContent>
          </Card>
          <Card className="bg-gray-800 border-green-500">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Uptime</CardTitle>
              <Clock className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {uptimeDays}d {uptimeHours}h {uptimeMinutes}m
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="bg-gray-800 border-green-500 mb-8">
          <CardHeader>
            <CardTitle>Hashrate Over Time</CardTitle>
          </CardHeader>
          <CardContent>
            <HashRateChart initialHashrate={poolData.hashrate1d || '0'} />
          </CardContent>
        </Card>

        <Card className="bg-gray-800 border-green-500">
          <CardHeader>
            <CardTitle>Check Your Stats</CardTitle>
          </CardHeader>
          <CardContent>
            <Suspense fallback={<div>Loading...</div>}>
              <UserStatsForm />
            </Suspense>
          </CardContent>
        </Card>
      </main>

      <footer>
        
      </footer>
    </div>
  )
}
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Bitcoin, Clock, Award } from 'lucide-react'
import dynamic from 'next/dynamic'

const HashRateChart = dynamic(() => import('@/components/HashRateChart'), { ssr: false })

interface WorkerData {
  workername: string;
  hashrate1hr: string;
  shares: number;
  bestshare: number;
}

interface UserData {
  hashrate1m: string;
  hashrate1d: string;
  lastshare: number;
  bestshare: number;
  worker: WorkerData[];
}

async function getUserData(address: string): Promise<UserData> {
  const response = await fetch(`https://solo.ckpool.org/users/${address}`, { next: { revalidate: 60 } })
  return response.json()
}

export default async function UserStats({ params }: { params: { address: string } }) {
  const userData = await getUserData(params.address)

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100">
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold mb-8 text-center text-green-400">User Statistics</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="bg-gray-800 border-green-500">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Current Hashrate</CardTitle>
              <Bitcoin className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{userData.hashrate1m || '0'}</div>
            </CardContent>
          </Card>
          <Card className="bg-gray-800 border-green-500">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Last Share</CardTitle>
              <Clock className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {new Date(userData.lastshare * 1000).toLocaleString()}
              </div>
            </CardContent>
          </Card>
          <Card className="bg-gray-800 border-green-500">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Best Share</CardTitle>
              <Award className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{userData.bestshare.toFixed(2)}</div>
            </CardContent>
          </Card>
        </div>

        <Card className="bg-gray-800 border-green-500 mb-8">
          <CardHeader>
            <CardTitle>Hashrate Over Time</CardTitle>
          </CardHeader>
          <CardContent>
            <HashRateChart initialHashrate={userData.hashrate1d || '0'} />
          </CardContent>
        </Card>

        <Card className="bg-gray-800 border-green-500">
          <CardHeader>
            <CardTitle>Worker Details</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left border-b border-gray-700">
                    <th className="pb-2">Worker Name</th>
                    <th className="pb-2">Hashrate (1h)</th>
                    <th className="pb-2">Shares</th>
                    <th className="pb-2">Best Share</th>
                  </tr>
                </thead>
                <tbody>
                  {userData.worker.map((worker: WorkerData, index: number) => (
                    <tr key={index} className="border-b border-gray-700">
                      <td className="py-2">{worker.workername}</td>
                      <td className="py-2">{worker.hashrate1hr}</td>
                      <td className="py-2">{worker.shares}</td>
                      <td className="py-2">{worker.bestshare.toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
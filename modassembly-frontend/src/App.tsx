import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { Code2, Cpu, Loader2 } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'
import { Toaster } from '@/components/ui/toaster'
import { DependencyGraph } from '@/components/DependencyGraph'

const API_URL = '/api/create-architecture'

interface ArchitectureResponse {
  architecture: Array<{
    type: string
    name: string
    purpose: string
    uses: string[]
    pypi_packages: string[]
    is_endpoint: boolean
  }>
  external_infrastructure: string[]
}

function App() {
  const [appName, setAppName] = useState('')
  const [systemDescription, setSystemDescription] = useState('')
  const [loading, setLoading] = useState(false)
  const [architectureData, setArchitectureData] = useState<ArchitectureResponse | null>(null)

  const { toast } = useToast()
  
  const handleSubmit = async () => {
    if (!appName || !systemDescription) {
      toast({
        title: "Missing Information",
        description: "Please provide both the application name and system description.",
        variant: "destructive"
      })
      return
    }

    setLoading(true)
    try {
      console.log('Sending request with payload:', {
        app_name: appName,
        system_description: systemDescription
      })
      
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'accept': 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          app_name: appName,
          system_description: systemDescription
        })
      })

      console.log('Response status:', response.status)
      
      if (!response.ok) {
        const errorText = await response.text()
        console.error('Error response:', errorText)
        throw new Error('Failed to generate architecture')
      }

      const data: ArchitectureResponse = await response.json()
      console.log('Architecture data:', data)
      setArchitectureData(data)
      toast({
        title: "Success!",
        description: "Architecture generated successfully.",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to generate architecture. Please try again.",
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <div className="min-h-screen bg-black text-white flex flex-col items-center p-4 gap-8">
        <Card className="w-full max-w-2xl bg-zinc-900 border-zinc-800">
          <CardHeader className="space-y-4 text-center">
            <div className="mx-auto p-4 rounded-full bg-zinc-800 inline-block">
              <Cpu className="w-8 h-8 text-white" />
            </div>
            <CardTitle className="text-3xl font-light tracking-tight">
              System Architecture Generator
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-zinc-400">
                Application Name
              </label>
              <Input
                placeholder="Enter application name"
                value={appName}
                onChange={(e) => setAppName(e.target.value)}
                className="bg-zinc-800 border-zinc-700 text-white"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-zinc-400">
                System Description
              </label>
              <Textarea
                placeholder="Describe what the system should do..."
                value={systemDescription}
                onChange={(e) => setSystemDescription(e.target.value)}
                className="bg-zinc-800 border-zinc-700 text-white min-h-32"
              />
            </div>
            <Button 
              className="w-full bg-white text-black hover:bg-zinc-200 transition-colors"
              size="lg"
              onClick={handleSubmit}
              disabled={loading}
            >
              {loading ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Code2 className="mr-2 w-4 h-4" />
              )}
              {loading ? 'Generating...' : 'Generate Architecture'}
            </Button>
          </CardContent>
        </Card>
        
        {architectureData && (
          <div className="w-full max-w-4xl aspect-square bg-zinc-900 border border-zinc-800 rounded-lg overflow-hidden">
            <DependencyGraph
              width={800}
              height={800}
              architecture={architectureData.architecture}
            />
          </div>
        )}
      </div>
      <Toaster />
    </>
  )
}

export default App

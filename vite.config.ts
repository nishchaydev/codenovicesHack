import { defineConfig, loadEnv, type Plugin } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { GET as getMarketData } from './app/api/market-data/route.ts'
import { POST as generateImpactGraph } from './app/api/generate-impact-graph/route.ts'

function apiRoutesPlugin(env: Record<string, string>): Plugin {
  // Populate process.env for Node server routes
  Object.assign(process.env, env)

  return {
    name: 'api-routes-plugin',
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        if (!req.url) return next()

        // 1. /api/market-data
        if (req.url.startsWith('/api/market-data')) {
          try {
            const fullUrl = `http://${req.headers.host || 'localhost'}${req.url}`
            const request = new Request(fullUrl, {
              method: req.method,
              headers: req.headers as unknown as Headers,
            })
            const response = await getMarketData(request)
            res.statusCode = response.status
            res.setHeader('Content-Type', 'application/json')
            const body = await response.text()
            res.end(body)
            return
          } catch (e: any) {
            res.statusCode = 500
            res.end(JSON.stringify({ error: e.message }))
            return
          }
        }

        // 2. /api/generate-impact-graph
        if (req.url.startsWith('/api/generate-impact-graph') && req.method === 'POST') {
          try {
            const chunks: Uint8Array[] = []
            for await (const chunk of req) {
              chunks.push(typeof chunk === 'string' ? Buffer.from(chunk) : chunk)
            }
            const bodyBuffer = Buffer.concat(chunks).toString('utf8')
            const fullUrl = `http://${req.headers.host || 'localhost'}${req.url}`
            const request = new Request(fullUrl, {
              method: req.method,
              headers: req.headers as unknown as Headers,
              body: bodyBuffer,
            })
            const response = await generateImpactGraph(request)
            res.statusCode = response.status
            res.setHeader('Content-Type', 'application/json')
            const body = await response.text()
            res.end(body)
            return
          } catch (e: any) {
            res.statusCode = 500
            res.end(JSON.stringify({ error: e.message }))
            return
          }
        }

        next()
      })
    },
  }
}

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  return {
    plugins: [react(), tailwindcss(), apiRoutesPlugin(env)],
  }
})

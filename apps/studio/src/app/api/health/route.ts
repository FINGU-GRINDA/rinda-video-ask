import { NextResponse } from 'next/server'

/**
 * Health check endpoint for Docker/Kubernetes deployments
 * Used by load balancers and container orchestrators to verify service health
 */
export async function GET() {
  return NextResponse.json(
    {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      version: process.env.npm_package_version || '0.1.0',
    },
    { status: 200 }
  )
}

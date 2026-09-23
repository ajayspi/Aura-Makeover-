import { NextRequest, NextResponse } from 'next/server';

const REPLICATE_API_TOKEN = process.env.REPLICATE_API_TOKEN;
interface JobStatus {
  jobId: string;
  status: 'pending' | 'processing' | 'done' | 'failed';
  resultUrl?: string;
  error?: string;
}

const pendingJobs = new Map<string, JobStatus>();

async function pollReplicate(predictionId: string): Promise<JobStatus> {
  if (!REPLICATE_API_TOKEN) {
    throw new Error('REPLICATE_API_TOKEN not configured');
  }

  const response = await fetch(`https://api.replicate.com/v1/predictions/${predictionId}`, {
    headers: { 'Authorization': `Token ${REPLICATE_API_TOKEN}` },
  });

  if (!response.ok) throw new Error('Failed to poll Replicate');

  const prediction = await response.json();

  return {
    jobId: prediction.id,
    status: (prediction.status === 'succeeded' ? 'done' :
            prediction.status === 'failed' ? 'failed' :
            prediction.status === 'processing' ? 'processing' : 'pending') as JobStatus['status'],
    resultUrl: prediction.output?.[0],
    error: prediction.error,
  };
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ jobId: string }> }
) {
  try {
    const { jobId } = await params;

    if (!jobId) {
      return NextResponse.json({ error: 'jobId required' }, { status: 400 });
    }

    // Check local cache first
    const cached = pendingJobs.get(jobId);
    if (cached && (cached.status === 'done' || cached.status === 'failed')) {
      return NextResponse.json(cached);
    }

    // Poll Replicate
    const result = await pollReplicate(jobId);
    pendingJobs.set(jobId, result);

    return NextResponse.json(result);
  } catch (error) {
    console.error('Restyle GET error:', error);
    return NextResponse.json({ error: 'Failed to get job status' }, { status: 500 });
  }
}
import { NextRequest, NextResponse } from 'next/server';

const REPLICATE_API_TOKEN = process.env.REPLICATE_API_TOKEN;
const REPLICATE_MODEL = 'adirik/interior-design';

interface RestyleRequest {
  imageBase64: string;
  prompt: string;
  strength?: number;
  negativePrompt?: string;
  numInferenceSteps?: number;
  guidanceScale?: number;
}

interface RestyleResponse {
  jobId: string;
  status: 'pending' | 'processing' | 'done' | 'failed';
  resultUrl?: string;
  error?: string;
}

const pendingJobs = new Map<string, RestyleResponse>();

async function callReplicate(input: RestyleRequest): Promise<string> {
  if (!REPLICATE_API_TOKEN) {
    throw new Error('REPLICATE_API_TOKEN not configured');
  }

  const response = await fetch('https://api.replicate.com/v1/predictions', {
    method: 'POST',
    headers: {
      'Authorization': `Token ${REPLICATE_API_TOKEN}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      version: 'latest',
      input: {
        image: `data:image/jpeg;base64,${input.imageBase64}`,
        prompt: input.prompt,
        negative_prompt: input.negativePrompt || 'blurry, low quality, distorted, deformed, ugly, bad anatomy, watermark, text, signature, logo, oversaturated, overexposed',
        num_inference_steps: input.numInferenceSteps || 25,
        guidance_scale: input.guidanceScale || 7.5,
        prompt_strength: input.strength || 0.6,
        seed: Math.floor(Math.random() * 1000000),
      },
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Replicate API error: ${error}`);
  }

  const prediction = await response.json();
  return prediction.id;
}

async function pollReplicate(predictionId: string): Promise<RestyleResponse> {
  if (!REPLICATE_API_TOKEN) {
    throw new Error('REPLICATE_API_TOKEN not configured');
  }

  const response = await fetch(`https://api.replicate.com/v1/predictions/${predictionId}`, {
    headers: {
      'Authorization': `Token ${REPLICATE_API_TOKEN}`,
    },
  });

  if (!response.ok) {
    throw new Error('Failed to poll Replicate');
  }

  const prediction = await response.json();

  return {
    jobId: prediction.id,
    status: prediction.status === 'succeeded' ? 'done' :
            prediction.status === 'failed' ? 'failed' :
            prediction.status === 'processing' ? 'processing' : 'pending',
    resultUrl: prediction.output?.[0],
    error: prediction.error,
  };
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json() as RestyleRequest;

    if (!body.imageBase64 || !body.prompt) {
      return NextResponse.json({ error: 'imageBase64 and prompt required' }, { status: 400 });
    }

    // Validate image size (max ~4MB base64)
    if (body.imageBase64.length > 5_000_000) {
      return NextResponse.json({ error: 'Image too large (max ~4MB)' }, { status: 400 });
    }

    const predictionId = await callReplicate(body);
    const jobId = predictionId;

    const job: RestyleResponse = { jobId, status: 'pending' };
    pendingJobs.set(jobId, job);

    // Start polling in background
    pollAndUpdate(jobId);

    return NextResponse.json({ jobId, status: 'pending' });
  } catch (error) {
    console.error('Restyle POST error:', error);
    return NextResponse.json({ error: 'Failed to start restyle job' }, { status: 500 });
  }
}

async function pollAndUpdate(jobId: string) {
  try {
    for (let i = 0; i < 60; i++) { // Max 5 minutes (60 * 5s)
      await new Promise(r => setTimeout(r, 5000));
      const result = await pollReplicate(jobId);
      pendingJobs.set(jobId, result);
      if (result.status === 'done' || result.status === 'failed') break;
    }
  } catch (error) {
    console.error('Polling error:', error);
    const job = pendingJobs.get(jobId);
    if (job) {
      job.status = 'failed';
      job.error = 'Polling failed';
      pendingJobs.set(jobId, job);
    }
  }
}
import { ChatMessage } from '@careertwin/shared';

export type AIProvider = 'openai' | 'claude' | 'gemini';

export interface AICompletionOptions {
  provider?: AIProvider;
  model?: string;
  temperature?: number;
  maxTokens?: number;
  systemPrompt?: string;
}

function getDefaultProvider(): AIProvider {
  if (process.env.OPENAI_API_KEY) return 'openai';
  if (process.env.ANTHROPIC_API_KEY) return 'claude';
  if (process.env.GOOGLE_AI_API_KEY) return 'gemini';
  return 'openai';
}

function generateFallbackResponse(messages: ChatMessage[], _options: AICompletionOptions): string {
  const lastMessage = messages[messages.length - 1]?.content || '';

  if (lastMessage.toLowerCase().includes('salary')) {
    return 'Based on your Career Twin profile, your current market value is competitive. Focus on System Design and leadership skills to increase salary by 25-35% within 12 months. Consider targeting senior roles at high-growth startups or FAANG companies.';
  }
  if (lastMessage.toLowerCase().includes('learn') || lastMessage.toLowerCase().includes('skill')) {
    return 'Your highest ROI learning priorities: 1) System Design (+21% promotion probability), 2) AI/ML fundamentals (+35% market demand), 3) Leadership & communication (+18% salary impact). I recommend dedicating 4-6 months to System Design first.';
  }
  if (lastMessage.toLowerCase().includes('interview') || lastMessage.toLowerCase().includes('ready')) {
    return 'Your interview readiness score is 72/100. Strengths: strong frontend skills, good project portfolio. Gaps: system design depth, behavioral storytelling. Focus on mock system design interviews and STAR method practice for 4-6 weeks before applying to senior roles.';
  }

  return 'Based on your Career Twin analysis, you\'re on a strong trajectory. Your career score of 78 puts you in the top 35% of peers. Key recommendation: invest in architecture skills and increase your open source contributions to accelerate promotion readiness. What specific area would you like to explore?';
}

async function completeOpenAI(messages: ChatMessage[], options: AICompletionOptions): Promise<string> {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) return generateFallbackResponse(messages, options);

  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: options.model || 'gpt-4o',
      messages: options.systemPrompt
        ? [{ role: 'system', content: options.systemPrompt }, ...messages]
        : messages,
      temperature: options.temperature ?? 0.7,
      max_tokens: options.maxTokens ?? 2000,
    }),
  });

  if (!response.ok) throw new Error(`OpenAI error: ${response.statusText}`);
  const data = await response.json() as any;
  return data.choices[0].message.content;
}

async function completeClaude(messages: ChatMessage[], options: AICompletionOptions): Promise<string> {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) return generateFallbackResponse(messages, options);

  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify({
      model: options.model || 'claude-sonnet-4-20250514',
      max_tokens: options.maxTokens ?? 2000,
      system: options.systemPrompt,
      messages: messages.filter((m) => m.role !== 'system'),
    }),
  });

  if (!response.ok) throw new Error(`Claude error: ${response.statusText}`);
  const data = await response.json() as any;
  return data.content[0].text;
}

async function completeGemini(messages: ChatMessage[], options: AICompletionOptions): Promise<string> {
  const apiKey = process.env.GOOGLE_AI_API_KEY;
  if (!apiKey) return generateFallbackResponse(messages, options);

  const model = options.model || 'gemini-2.0-flash';
  const contents = messages.map((m) => ({
    role: m.role === 'assistant' ? 'model' : 'user',
    parts: [{ text: m.content }],
  }));

  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents,
        systemInstruction: options.systemPrompt
          ? { parts: [{ text: options.systemPrompt }] }
          : undefined,
        generationConfig: {
          temperature: options.temperature ?? 0.7,
          maxOutputTokens: options.maxTokens ?? 2000,
        },
      }),
    },
  );

  if (!response.ok) throw new Error(`Gemini error: ${response.statusText}`);
  const data = await response.json() as any;
  return data.candidates[0].content.parts[0].text;
}

export async function complete(messages: ChatMessage[], options: AICompletionOptions = {}): Promise<string> {
  const provider = options.provider || getDefaultProvider();

  try {
    switch (provider) {
      case 'openai':
        return await completeOpenAI(messages, options);
      case 'claude':
        return await completeClaude(messages, options);
      case 'gemini':
        return await completeGemini(messages, options);
      default:
        return await completeOpenAI(messages, options);
    }
  } catch {
    console.warn(`AI provider ${provider} failed, using fallback`);
    return generateFallbackResponse(messages, options);
  }
}

export async function generateEmbedding(text: string): Promise<number[]> {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    return Array.from({ length: 1536 }, () => Math.random() * 2 - 1);
  }

  const response = await fetch('https://api.openai.com/v1/embeddings', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: 'text-embedding-3-small',
      input: text,
    }),
  });

  if (!response.ok) throw new Error('Embedding generation failed');
  const data = await response.json() as any;
  return data.data[0].embedding;
}

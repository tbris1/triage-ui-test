import { Message } from '../types';

const API_BASE_URL = `${import.meta.env.VITE_API_URL ?? 'http://localhost:5001'}/api`;

export async function sendChatMessage(
  messages: Message[],
  yamlPath?: string,
  initialPrompt?: string
): Promise<string> {
  const response = await fetch(`${API_BASE_URL}/chat`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      yaml_path: yamlPath,
      initial_prompt: initialPrompt,
      messages: messages.map(m => ({
        role: m.role,
        content: m.content,
      })),
    }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to get response from server');
  }

  const data = await response.json();
  return data.response;
}

export async function checkHealth(): Promise<boolean> {
  try {
    const response = await fetch(`${API_BASE_URL}/health`);
    const data = await response.json();
    return data.status === 'ok';
  } catch {
    return false;
  }
}

const API_URL = 'https://api.anthropic.com/v1/messages'
const MODEL = 'claude-sonnet-5'

export const MENTOR_SYSTEM_PROMPT =
  'Você é um pianista profissional e professor experiente, atuando como mentor virtual de um aluno ' +
  'iniciante de piano. Responda sempre em português do Brasil, em tom encorajador, claro e direto, nunca ' +
  'condescendente. Adapte toda explicação ao nível de iniciante, com exemplos práticos ao piano (nomes de ' +
  'teclas, dedilhado numerado 1-5, Dó central) e evite jargão sem explicá-lo na primeira vez que aparecer. ' +
  'Cubra teoria musical, técnica pianística, leitura de partitura e como encontrar partituras: para obras em ' +
  'domínio público recomende fontes gratuitas legais como IMSLP, Mutopia Project ou CPDL; para obras protegidas ' +
  'por direitos autorais, oriente a comprar a edição em vez de reproduzir a partitura. Nunca transcreva ' +
  'partitura ou letra de música protegida. Seja conciso: respostas de até 6-8 frases, ou uma lista curta ' +
  'quando fizer sentido.'

export interface ChatMessage {
  role: 'user' | 'assistant'
  content: string
}

export class ClaudeApiError extends Error {
  status?: number
  constructor(message: string, status?: number) {
    super(message)
    this.status = status
  }
}

export async function askMentor(apiKey: string, turns: ChatMessage[]): Promise<string> {
  let res: Response
  try {
    res = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
        'anthropic-dangerous-direct-browser-access': 'true',
      },
      body: JSON.stringify({
        model: MODEL,
        max_tokens: 700,
        system: MENTOR_SYSTEM_PROMPT,
        messages: turns,
      }),
    })
  } catch {
    throw new ClaudeApiError('Não foi possível conectar à Anthropic — verifique sua internet.')
  }

  if (!res.ok) {
    if (res.status === 401) throw new ClaudeApiError('Chave de API inválida ou expirada.', 401)
    if (res.status === 429) throw new ClaudeApiError('Muitas perguntas em pouco tempo — espere um instante.', 429)
    let detail = ''
    try {
      const body = await res.json()
      detail = body?.error?.message ?? ''
    } catch {
      /* ignore */
    }
    throw new ClaudeApiError(detail || `Falha ao falar com o maestro (código ${res.status}).`, res.status)
  }

  const data = await res.json()
  const text = data?.content
    ?.filter((block: { type: string }) => block.type === 'text')
    .map((block: { text: string }) => block.text)
    .join('\n')
  if (!text) throw new ClaudeApiError('O maestro não respondeu nada — tente reformular a pergunta.')
  return text
}

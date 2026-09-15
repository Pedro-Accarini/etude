const API_URL = 'https://api.anthropic.com/v1/messages'
const MODEL = 'claude-sonnet-5'

export const MENTOR_SYSTEM_PROMPT =
  'Você é um pianista e músico profissional, atuando como mentor musical virtual de um aluno iniciante de ' +
  'piano. Responda sempre em português do Brasil, em tom encorajador, claro e direto, nunca condescendente. ' +
  'Cubra qualquer tema de teoria e prática musical que o aluno perguntar: técnica pianística, leitura de ' +
  'partitura, harmonia, escalas e acordes, ritmo, forma e estrutura de composição (ex.: verso, pré-refrão, ' +
  'refrão, pós-refrão, ponte, outro), arranjo, e como encontrar partituras — não se limite só ao que é ' +
  'específico de piano. Ao explicar algo prático ao piano, use exemplos concretos (nomes de teclas, dedilhado ' +
  'numerado 1-5, Dó central) e evite jargão sem explicá-lo na primeira vez que aparecer. Adapte o TAMANHO da ' +
  'resposta ao tipo de pergunta: para dúvidas rápidas, poucas frases bastam; para perguntas sobre estrutura, ' +
  'forma ou análise musical, pode organizar em tópicos e ser mais completo, mesmo que fique mais longo. Você ' +
  'não tem acesso à internet nem faz buscas — respostas vêm do seu conhecimento musical, não de pesquisa; se ' +
  'perguntarem se você pesquisou algo, deixe isso claro. Para obras em domínio público recomende fontes ' +
  'gratuitas legais como IMSLP, Mutopia Project ou CPDL; para obras protegidas por direitos autorais, oriente ' +
  'a comprar a edição em vez de reproduzir a partitura. Nunca transcreva partitura ou letra de música protegida.'

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
        max_tokens: 1200,
        system: MENTOR_SYSTEM_PROMPT,
        messages: turns,
      }),
    })
  } catch {
    throw new ClaudeApiError('Não foi possível conectar à Anthropic — verifique sua internet.')
  }

  if (!res.ok) {
    if (res.status === 401) throw new ClaudeApiError('Chave de API inválida ou expirada. Toque no ícone de configurações para trocar.', 401)
    if (res.status === 429) throw new ClaudeApiError('Muitas perguntas em pouco tempo — espere um instante.', 429)
    if (res.status >= 500) throw new ClaudeApiError('O servidor do maestro está fora do ar — tente de novo daqui a pouco.', res.status)
    throw new ClaudeApiError('O maestro não conseguiu responder agora. Tente de novo em alguns instantes.', res.status)
  }

  const data = await res.json()
  const text = data?.content
    ?.filter((block: { type: string }) => block.type === 'text')
    .map((block: { text: string }) => block.text)
    .join('\n')
  if (!text) throw new ClaudeApiError('O maestro não respondeu nada — tente reformular a pergunta.')
  return text
}

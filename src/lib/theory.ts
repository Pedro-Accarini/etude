export const CLEF_LINES = [
  { clef: 'Clave de Sol', lines: 'Mi · Sol · Si · Ré · Fá', spaces: 'Fá · Lá · Dó · Mi' },
  { clef: 'Clave de Fá', lines: 'Sol · Si · Ré · Fá · Lá', spaces: 'Lá · Dó · Mi · Sol' },
]

export const INTERVALS = [
  { name: '2ª menor', semitones: 1, example: 'Dó–Réb' },
  { name: '2ª maior', semitones: 2, example: 'Dó–Ré' },
  { name: '3ª menor', semitones: 3, example: 'Dó–Mib' },
  { name: '3ª maior', semitones: 4, example: 'Dó–Mi' },
  { name: '4ª justa', semitones: 5, example: 'Dó–Fá' },
  { name: 'Trítono', semitones: 6, example: 'Dó–Fá♯' },
  { name: '5ª justa', semitones: 7, example: 'Dó–Sol' },
  { name: '6ª menor', semitones: 8, example: 'Dó–Láb' },
  { name: '6ª maior', semitones: 9, example: 'Dó–Lá' },
  { name: '7ª menor', semitones: 10, example: 'Dó–Sib' },
  { name: '7ª maior', semitones: 11, example: 'Dó–Si' },
  { name: 'Oitava', semitones: 12, example: 'Dó–Dó' },
]

export const CHORD_FORMULAS = [
  { name: 'Maior', formula: '1 – 3 – 5' },
  { name: 'Menor', formula: '1 – b3 – 5' },
  { name: 'Diminuto', formula: '1 – b3 – b5' },
  { name: 'Aumentado', formula: '1 – 3 – #5' },
  { name: 'Maior com 7ª', formula: '1 – 3 – 5 – 7' },
  { name: 'Dominante 7', formula: '1 – 3 – 5 – b7' },
  { name: 'Menor com 7ª', formula: '1 – b3 – 5 – b7' },
  { name: 'Meio-diminuto', formula: '1 – b3 – b5 – b7' },
]

export const CADENCES = [
  { name: 'V → I', label: 'Autêntica', desc: 'O fechamento mais forte — "resolve" a frase.' },
  { name: 'IV → I', label: 'Plagal', desc: 'O "amém" dos hinos, mais suave que a autêntica.' },
  { name: 'V → vi', label: 'De engano', desc: 'Engana o ouvido: esperava I e vem vi.' },
  { name: '… → V', label: 'Semicadência', desc: 'Pausa em suspenso, pede continuação.' },
]

export const CIRCLE_MAJORS = ['C', 'G', 'D', 'A', 'E', 'B', 'F♯/G♭', 'D♭', 'A♭', 'E♭', 'B♭', 'F']
export const CIRCLE_MINORS = ['Am', 'Em', 'Bm', 'F♯m', 'C♯m', 'G♯m', 'D♯m/E♭m', 'B♭m', 'Fm', 'Cm', 'Gm', 'Dm']

export const FINGERING_C_MAJOR = {
  right: '1 · 2 · 3 · 1 · 2 · 3 · 4 · 5',
  left: '5 · 4 · 3 · 2 · 1 · 3 · 2 · 1',
}

export const SCORE_SOURCES = [
  { name: 'IMSLP / Petrucci Library', url: 'https://imslp.org', desc: 'O maior acervo de partituras em domínio público — a maior parte do repertório clássico está aqui, de graça.' },
  { name: 'Mutopia Project', url: 'https://www.mutopiaproject.org', desc: 'Partituras de domínio público em formato editável, boas para imprimir com clareza.' },
  { name: 'CPDL', url: 'https://www.cpdl.org', desc: 'Focado em música coral, mas útil para acompanhamentos e reduções de piano.' },
  { name: '8Notes', url: 'https://www.8notes.com', desc: 'Seção gratuita com arranjos simplificados — bom para iniciante.' },
  { name: 'MuseScore.com', url: 'https://musescore.com', desc: 'Partituras da comunidade — qualidade varia, confira a licença antes de usar.' },
  { name: 'Sheet Music Plus / Musicnotes', url: 'https://www.sheetmusicplus.com', desc: 'Para obras protegidas: comprar a edição oficial é o caminho correto.' },
]

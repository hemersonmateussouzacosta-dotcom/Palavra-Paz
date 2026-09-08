import { DailyVerse } from '../types';

const CUSTOM_VERSES_KEY = 'palavra_paz_custom_verses';

export const BASE_DAILY_VERSES: DailyVerse[] = [
  {
    id: 'v-1',
    date: '2026-09-08',
    reference: 'Salmos 46:10',
    text: 'Aquietai-vos e sabei que eu sou Deus; serei exaltado sobre as nações; serei exaltado sobre a terra.',
    reflection: 'Em meio ao turbilhão de pensamentos, obrigações e ansiedades sobre o futuro, a ordem divina hoje é simples e profunda: aquietai-vos. Silenciar a mente não é inércia, é um ato de confiança corajosa de que o Senhor está no controle soberano.',
    actionPrompt: 'Respire fundo três vezes agora. Entregue em oração a maior preocupação do seu dia e confie no cuidado do Pai.',
    theme: 'Paz Interior & Confiança'
  },
  {
    id: 'v-2',
    date: '2026-09-09',
    reference: 'Filipenses 4:6-7',
    text: 'Não andeis ansiosos de coisa alguma; em tudo, porém, sejam conhecidas diante de Deus as vossas petições, pela oração e pela súplica, com ações de graças. E a paz de Deus, que excede todo o entendimento, guardará o vosso coração e a vossa mente em Cristo Jesus.',
    reflection: 'A cura para a ansiedade não é o controle das circunstâncias externas, mas a entrega sincera em oração acompanhada de gratidão. A paz de Deus age como uma sentinela celestial guardando os seus pensamentos.',
    actionPrompt: 'Agradeça a Deus por 3 coisas que Ele já fez antes de pedir algo hoje.',
    theme: 'Alívio da Ansiedade'
  },
  {
    id: 'v-3',
    date: '2026-09-10',
    reference: 'Salmos 23:1-3',
    text: 'O Senhor é o meu pastor; nada me faltará. Ele me faz repousar em pastos verdejantes; leva-me para junto das águas de descanso; refrigera a minha alma.',
    reflection: 'O Bom Pastor não nos promete ausência de vales escuros, mas garante Sua presença protetora e refrigério contínuo para o nosso espírito cansado.',
    actionPrompt: 'Permita-se 5 minutos de pausa no meio da tarde para descansar na presença do Pastor das nossas almas.',
    theme: 'Cuidado Divino'
  },
  {
    id: 'v-4',
    date: '2026-09-11',
    reference: 'Isaías 40:29-31',
    text: 'Ele dá força ao cansado e multiplica as forças ao que não tem nenhum vigor... mas os que esperam no Senhor renovam as suas forças, sobem com asas como águias, correm e não se cansam, caminham e não se fatigam.',
    reflection: 'Quando as forças humanas se esgotam, a graça do Senhor se manifesta. A verdadeira renovação vem da espera contemplativa diante de Deus.',
    actionPrompt: 'Reconheça suas limitações em oração e peça forças renovadas ao Espírito Santo.',
    theme: 'Renovação Espiritual'
  },
  {
    id: 'v-5',
    date: '2026-09-12',
    reference: 'Mateus 11:28-29',
    text: 'Vinde a mim, todos os que estais cansados e sobrecarregados, e eu vos aliviarei. Tomai sobre vós o meu jugo e aprendei de mim, porque sou manso e humilde de coração; e achareis descanso para as vossas almas.',
    reflection: 'Jesus não impõe pesos impossíveis; Ele oferece descanso genuíno. O convite é para caminhar em Seu compasso suave de amor e humildade.',
    actionPrompt: 'Escreva mentalmente aquilo que está pesando no seu peito e deposite nas mãos de Jesus.',
    theme: 'Descanso da Alma'
  },
  {
    id: 'v-6',
    date: '2026-09-13',
    reference: 'Salmos 91:1-2',
    text: 'Aquele que habita no esconderijo do Altíssimo, à sombra do Onipotente descansará. Direi do Senhor: Ele é o meu refúgio e a minha fortaleza, o meu Deus, em quem confio.',
    reflection: 'Habitar no esconderijo é fazer da presença de Deus a sua morada diária contínua, e não apenas uma visita rápida em momentos de aperto.',
    actionPrompt: 'Declare hoje ao sair de casa: O Senhor é o meu refúgio e fortaleza inabalável.',
    theme: 'Proteção Sobrenatural'
  },
  {
    id: 'v-7',
    date: '2026-09-14',
    reference: 'Provérbios 3:5-6',
    text: 'Confia no Senhor de todo o teu coração e não te estribes no teu próprio entendimento. Reconhece-o em todos os teus caminhos, e ele endireitará as tuas veredas.',
    reflection: 'Nossa visão humana é limitada pelo tempo e pelas aparências; a sabedoria divina enxerga o horizonte eterno. Confiar é soltar o leme nas mãos de Deus.',
    actionPrompt: 'Antes de tomar qualquer decisão importante hoje, peça a direção do Senhor em uma breve oração.',
    theme: 'Direção e Sabedoria'
  },
  {
    id: 'v-8',
    date: '2026-09-15',
    reference: 'Romanos 8:28',
    text: 'Sabemos que todas as coisas cooperam para o bem daqueles que amam a Deus, daqueles que são chamados segundo o seu propósito.',
    reflection: 'Mesmo as dores e os contratempos que não compreendemos agora estão sendo tecidos pelo Senhor para gerar propósito, maturidade e vitória futura.',
    actionPrompt: 'Olhe para uma dificuldade recente e declare: Deus fará isso cooperar para o meu bem.',
    theme: 'Propósito Soberano'
  },
  {
    id: 'v-9',
    date: '2026-09-16',
    reference: 'Jeremias 29:11',
    text: 'Porque eu bem sei os pensamentos que penso de vós, diz o Senhor; pensamentos de paz e não de mal, para vos dar um fim e uma esperança.',
    reflection: 'Deus não planeja destruição para sua vida; os planos dEle são de prosperidade espiritual, paz e um futuro abençoado firmado na fidelidade dEle.',
    actionPrompt: 'Rejeite pensamentos de desânimo sobre o amanhã. O futuro pertence a Deus.',
    theme: 'Esperança Viva'
  },
  {
    id: 'v-10',
    date: '2026-09-17',
    reference: 'Josué 1:9',
    text: 'Não to mandei eu? Sê forte e corajoso; não temas, nem te espantes, porque o Senhor, teu Deus, é contigo por onde quer que andares.',
    reflection: 'A coragem bíblica não é ausência de medo, mas a decisão firme de avançar mesmo tremendo, apoiado na certeza absoluta da presença de Deus.',
    actionPrompt: 'Enfrente com serenidade a conversa ou tarefa desafiadora que você estava adiando.',
    theme: 'Coragem e Fé'
  },
  {
    id: 'v-11',
    date: '2026-09-18',
    reference: 'Lamentações 3:22-23',
    text: 'As misericórdias do Senhor são a causa de não sermos consumidos; porque as suas misericórdias não têm fim; renovam-se cada manhã; grande é a tua fidelidade.',
    reflection: 'Cada amanhecer traz uma cota fresca e abundante de misericórdia divina. O que passou ontem foi perdoado; hoje é uma página em branco com Cristo.',
    actionPrompt: 'Ao abrir os olhos pela manhã, diga: Senhor, obrigado por tuas novas misericórdias para o meu dia.',
    theme: 'Graça Renovada'
  },
  {
    id: 'v-12',
    date: '2026-09-19',
    reference: 'Salmos 121:1-2',
    text: 'Elevo os meus olhos para os montes: de onde me virá o socorro? O meu socorro vem do Senhor, que fez os céus e a terra.',
    reflection: 'Não olhe para a magnitude dos problemas nem para a fragilidade dos homens. Olhe para cima: o Criador do universo é quem cuida de você.',
    actionPrompt: 'Olhe para o céu por alguns segundos e lembre-se da grandeza infinita de quem te guarda.',
    theme: 'Socorro Presente'
  },
  {
    id: 'v-13',
    date: '2026-09-20',
    reference: '2 Coríntios 12:9',
    text: 'E disse-me: A minha graça te basta, porque o meu poder se aperfeiçoa na fraqueza. De boa vontade, pois, me gloriarei nas minhas fraquezas, para que em mim habite o poder de Cristo.',
    reflection: 'Sua vulnerabilidade não afasta a Deus; pelo contrário, atrai o poder de Cristo para agir onde as forças humanas falham.',
    actionPrompt: 'Em vez de se culpar por não ser perfeito, agradeça a Deus pela suficiência da graça dEle.',
    theme: 'Graça Suficiente'
  },
  {
    id: 'v-14',
    date: '2026-09-21',
    reference: 'Salmos 119:105',
    text: 'Lâmpada para os meus pés é a tua palavra e luz, para o meu caminho.',
    reflection: 'A Bíblia não é apenas um livro de histórias antigas; é o mapa vivo e a tocha que ilumina cada próximo passo na escuridão deste mundo.',
    actionPrompt: 'Dedique hoje pelo menos 10 minutos para meditar atentamente em um capítulo da Escritura.',
    theme: 'Luz da Palavra'
  },
  {
    id: 'v-15',
    date: '2026-09-22',
    reference: '1 Tessalonicenses 5:16-18',
    text: 'Regozijai-vos sempre. Orai sem cessar. Em tudo dai graças, porque esta é a vontade de Deus em Cristo Jesus para convosco.',
    reflection: 'A oração contínua é manter um diálogo interior ininterrupto com o Espírito Santo durante as atividades normais do dia a dia.',
    actionPrompt: 'Transforme pequenos momentos do trânsito ou afazeres domésticos em sussurros de oração e louvor.',
    theme: 'Oração Constante'
  },
  {
    id: 'v-16',
    date: '2026-09-23',
    reference: 'Efésios 6:10-11',
    text: 'No demais, irmãos meus, fortalecei-vos no Senhor e na força do seu poder. Revesti-vos de toda a armadura de Deus, para que possais estar firmes contra as astutas ciladas do diabo.',
    reflection: 'A armadura de Deus (verdade, justiça, evangelho da paz, fé, salvação e a espada do Espírito) é a vestimenta espiritual indispensável para vencer o dia.',
    actionPrompt: 'Em oração matinal, imagine-se vestindo espiritualmente a verdade e a couraça da justiça de Deus.',
    theme: 'Armadura Espiritual'
  },
  {
    id: 'v-17',
    date: '2026-09-24',
    reference: 'Salmos 103:1-3',
    text: 'Bendize, ó minha alma, ao Senhor, e tudo o que há em mim bendiga o seu santo nome. Bendize, ó minha alma, ao Senhor, e não te esqueças de nenhum de seus benefícios.',
    reflection: 'A alma tende a ser ingrata e focada no que ainda falta. Cultivar memória santa de tudo que Deus já fez acende o fogo da gratidão.',
    actionPrompt: 'Liste em um papel ou mentalmente 5 bênçãos concretas recebidas nesta semana.',
    theme: 'Coração Grato'
  },
  {
    id: 'v-18',
    date: '2026-09-25',
    reference: 'João 14:27',
    text: 'Deixo-vos a paz, a minha paz vos dou; não vo-la dou como o mundo a dá. Não se turbe o vosso coração, nem se atemorize.',
    reflection: 'A paz do mundo depende de conta bancária farta e ausência de problemas; a paz de Cristo floresce mesmo no meio da tempestade marítima.',
    actionPrompt: 'Quando sentir o peito apertar hoje, feche os olhos e repita: A paz de Cristo guarda o meu coração.',
    theme: 'Paz de Cristo'
  },
  {
    id: 'v-19',
    date: '2026-09-26',
    reference: 'Gálatas 5:22-23',
    text: 'Mas o fruto do Espírito é: amor, gozo, paz, longanimidade, benignidade, bondade, fé, mansidão, temperança. Contra estas coisas não há lei.',
    reflection: 'O fruto do Espírito não é produzido por mero esforço próprio, mas pelo fluxo de seiva da Videira Verdadeira correndo no galho que permanece nEle.',
    actionPrompt: 'Escolha responder com brandura e paciência à próxima pessoa que testar seu humor hoje.',
    theme: 'Fruto do Espírito'
  },
  {
    id: 'v-20',
    date: '2026-09-27',
    reference: 'Hebreus 11:1',
    text: 'Ora, a fé é o firme fundamento das coisas que se esperam e a prova das coisas que se não veem.',
    reflection: 'A fé vê o invisível, crê no inacreditável e recebe o impossível. Ela é a âncora da alma quando o mar da vida se agita.',
    actionPrompt: 'Ore com autoridade por aquela causa impossível aos olhos dos homens.',
    theme: 'Fé Inabalável'
  },
  {
    id: 'v-21',
    date: '2026-09-28',
    reference: 'Colossenses 3:12-14',
    text: 'Revesti-vos, pois, como eleitos de Deus, santos e amados, de entranhas de misericórdia, de benignidade, humildade, mansidão, longanimidade, perdoando-vos uns aos outros... e, sobre tudo isto, revesti-vos de caridade, que é o vínculo da perfeição.',
    reflection: 'O perdão é a chave que abre a prisão do ressentimento. Perdoar não é esquecer magicamente, é decidir não cobrar a dívida com amargura.',
    actionPrompt: 'Libere perdão sincero em oração para alguém que te feriu.',
    theme: 'Amor & Perdão'
  },
  {
    id: 'v-22',
    date: '2026-09-29',
    reference: 'Salmos 37:4-5',
    text: 'Deleita-te também no Senhor, e ele te concederá os desejos do teu coração. Entrega o teu caminho ao Senhor; confia nele, e ele tudo fará.',
    reflection: 'Deleitar-se em Deus é encontrar a maior alegria na presença dEle. Quando Deus é nosso deleite supremo, os desejos do coração se alinham aos dEle.',
    actionPrompt: 'Dedique um momento para louvar a Deus simplesmente por quem Ele é, e não pelo que pode te dar.',
    theme: 'Entrega e Deleite'
  },
  {
    id: 'v-23',
    date: '2026-09-30',
    reference: 'Malaquias 4:2',
    text: 'Mas para vós que temeis o meu nome nascerá o sol da justiça, trazendo cura em suas asas; e saireis e saltareis como bezerros soltos da estrebaria.',
    reflection: 'Assim como os raios do sol matinal dissipam o nevoeiro gelado, a presença viva de Jesus dissipa as trevas da alma e traz restauração plena.',
    actionPrompt: 'Abra a janela da sua casa ou quarto, sinta a claridade do sol e receba a bênção do Pai.',
    theme: 'Cura e Restauração'
  },
  {
    id: 'v-24',
    date: '2026-10-01',
    reference: 'Salmos 27:1',
    text: 'O Senhor é a minha luz e a minha salvação; a quem temerei? O Senhor é a força da minha vida; de quem me recearei?',
    reflection: 'Quando o Deus todo-poderoso é a luz que ilumina sua jornada, nenhuma sombra do medo tem poder para paralisar seu destino.',
    actionPrompt: 'Rejeite todo espírito de medo declarando que o Senhor é a fortaleza da sua vida.',
    theme: 'Vitória sobre o Medo'
  },
  {
    id: 'v-25',
    date: '2026-10-02',
    reference: 'Tiago 1:5',
    text: 'E, se algum de vós tem falta de sabedoria, peça-a a Deus, que a todos dá liberalmente e o não lança em rosto; e ser-lhe-á dada.',
    reflection: 'Deus nunca despreza quem chega humilde pedindo discernimento. Ele abre as fontes da sabedoria do alto para guiar passos justos.',
    actionPrompt: 'Peça a sabedoria divina antes de responder àquela mensagem delicada de trabalho ou família.',
    theme: 'Sabedoria Divina'
  },
  {
    id: 'v-26',
    date: '2026-10-03',
    reference: 'Isaías 41:10',
    text: 'Não temas, porque eu sou contigo; não te assombres, porque eu sou o teu Deus; eu te fortaleço, e te ajudo, e te sustento com a destra da minha justiça.',
    reflection: 'A destra de Deus sustenta os mundos no espaço sideral. É essa mesma mão invencível que segura você hoje nos momentos difíceis.',
    actionPrompt: 'Sinta-se amparado pelas mãos invisíveis do Pai Celeste em cada passo deste dia.',
    theme: 'Amparo Inabalável'
  },
  {
    id: 'v-27',
    date: '2026-10-04',
    reference: 'Salmos 139:23-24',
    text: 'Sonda-me, ó Deus, e conhece o meu coração; prova-me e conhece os meus pensamentos. E vê se há em mim algum caminho mau e guia-me pelo caminho eterno.',
    reflection: 'A verdadeira oração contemplativa abre o peito sem máscaras diante do Criador, permitindo que a luz do Espírito purifique cada intenção.',
    actionPrompt: 'Faça um exame de consciência sincero e silencioso pedindo a purificação da mente.',
    theme: 'Sinceridade de Coração'
  },
  {
    id: 'v-28',
    date: '2026-10-05',
    reference: 'Romanos 12:2',
    text: 'E não vos conformeis com este século, mas transformai-vos pela renovação da vossa mente, para que experimenteis qual seja a boa, agradável e perfeita vontade de Deus.',
    reflection: 'A transformação de vida começa com a renovação dos pensamentos pela Palavra de Deus. Mude o que você consome e sua mente florescerá.',
    actionPrompt: 'Substitua 15 minutos de redes sociais por leitura da Bíblia ou oração hoje.',
    theme: 'Renovação da Mente'
  },
  {
    id: 'v-29',
    date: '2026-10-06',
    reference: 'Salmos 34:18',
    text: 'Perto está o Senhor dos que têm o coração quebrantado e salva os de espírito contrito.',
    reflection: 'Deus não se afasta quando estamos em pedaços; Ele se achega ainda mais perto. O coração ferido é o endereço preferido do Consolador.',
    actionPrompt: 'Se o coração estiver pesado, derrame lágrimas sinceras diante de Deus; Ele recolhe cada uma.',
    theme: 'Consolo aos Aflitos'
  },
  {
    id: 'v-30',
    date: '2026-10-07',
    reference: 'Salmos 19:14',
    text: 'Sejam agradáveis as palavras da minha boca e a meditação do meu coração perante a tua face, Senhor, rocha minha e libertador meu!',
    reflection: 'O que falamos reflete o que meditamos em segredo. Que as nossas palavras hoje edifiquem, tragam graça e abençoem quem nos ouve.',
    actionPrompt: 'Elogie e abençoe genuinamente pelo menos duas pessoas ao seu redor hoje.',
    theme: 'Palavras de Vida'
  }
];

/**
 * Obtém versículos personalizados salvos pelo administrador
 */
export function getCustomVerses(): DailyVerse[] {
  try {
    const raw = localStorage.getItem(CUSTOM_VERSES_KEY);
    if (raw) {
      return JSON.parse(raw);
    }
  } catch (e) {
    console.warn('Erro ao carregar versículos customizados:', e);
  }
  return [];
}

/**
 * Salva ou edita um versículo personalizado
 */
export function saveCustomVerse(verse: DailyVerse): void {
  try {
    const list = getCustomVerses();
    const existingIndex = list.findIndex((v) => v.id === verse.id || v.date === verse.date);
    if (existingIndex >= 0) {
      list[existingIndex] = verse;
    } else {
      list.push(verse);
    }
    localStorage.setItem(CUSTOM_VERSES_KEY, JSON.stringify(list));
  } catch (e) {
    console.error('Erro ao salvar versículo customizado:', e);
  }
}

/**
 * Remove um versículo customizado
 */
export function deleteCustomVerse(id: string): void {
  try {
    const list = getCustomVerses().filter((v) => v.id !== id);
    localStorage.setItem(CUSTOM_VERSES_KEY, JSON.stringify(list));
  } catch (e) {
    console.error('Erro ao deletar versículo:', e);
  }
}

/**
 * Algoritmo do Devocional 365 Dias:
 * Calcula o dia do ano (1 a 365) e garante um versículo diferente para cada dia do calendário.
 * Se houver um versículo customizado cadastrado pelo Administrador para a data, este terá prioridade.
 */
export function getTodayVerse(selectedDateStr?: string): DailyVerse {
  const targetDate = selectedDateStr ? new Date(selectedDateStr + 'T12:00:00') : new Date();
  const dateKey = targetDate.toISOString().split('T')[0];

  // 1. Verifica se o Administrador cadastrou um versículo para esta data específica
  const customList = getCustomVerses();
  const customMatch = customList.find((v) => v.date === dateKey);
  if (customMatch) {
    return customMatch;
  }

  // 2. Calcula o dia do ano (1 a 365)
  const startOfYear = new Date(targetDate.getFullYear(), 0, 0);
  const diff = targetDate.getTime() - startOfYear.getTime();
  const oneDay = 1000 * 60 * 60 * 24;
  const dayOfYear = Math.max(1, Math.floor(diff / oneDay));

  // 3. Seleciona a partir da biblioteca de 30 versículos ricos por rotação diária contínua
  const index = (dayOfYear - 1) % BASE_DAILY_VERSES.length;
  const baseVerse = BASE_DAILY_VERSES[index];

  return {
    ...baseVerse,
    id: `v-day-${dayOfYear}`,
    date: dateKey
  };
}

/**
 * Lista todos os devocionais disponíveis para navegação ou gerenciamento do Administrador
 */
export function getAllAvailableVerses(): DailyVerse[] {
  const customList = getCustomVerses();
  const baseList = BASE_DAILY_VERSES;
  const combined = [...customList];

  for (const base of baseList) {
    if (!combined.some((c) => c.id === base.id || c.date === base.date)) {
      combined.push(base);
    }
  }
  return combined;
}

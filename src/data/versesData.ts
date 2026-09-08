import { DailyVerse } from '../types';

export const DAILY_VERSES: DailyVerse[] = [
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
  }
];

export function getTodayVerse(): DailyVerse {
  const dayOfYear = Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 1000 / 60 / 60 / 24);
  const index = dayOfYear % DAILY_VERSES.length;
  return DAILY_VERSES[index];
}

import { GuidedMeditation } from '../types';

export const GUIDED_MEDITATIONS: GuidedMeditation[] = [
  {
    id: 'med-1',
    title: 'Silenciando a Mente em Deus',
    durationMinutes: 5,
    theme: 'Paz Interior & Desaceleração',
    description: 'Uma pausa consciente baseada no Salmo 46:10 para liberar a sobrecarga mental e ancorar a alma no amor divino.',
    isPremium: false, // Gratuito para degustação
    stages: [
      {
        title: 'Preparação e Postura Sagrada',
        guidance: 'Encontre uma posição confortável. Alinhe sua coluna suavemente. Feche os olhos devagar. Deixe os ombros caírem e relaxe a mandíbula. Respire fundo pelo nariz... e solte todo o ar pela boca.',
        seconds: 45
      },
      {
        title: 'Ciclo de Respiração e Entrega',
        guidance: 'Ao inspirar lentamente, receba a paz e a presença do Espírito Santo. Ao expirar, solte as tensões, os prazos e qualquer ansiedade que tentou dominar seus pensamentos hoje.',
        seconds: 75
      },
      {
        title: 'Ancoragem na Palavra de Deus',
        guidance: 'Medite no sussurro divino: "Aquietai-vos e sabei que Eu sou Deus". Não é pela sua força, mas pela graça soberana do Pai. Você está seguro.',
        seconds: 90
      },
      {
        title: 'Gratidão e Retorno Renovado',
        guidance: 'Agradeça pelo descanso do seu espírito. Abra os olhos devagar com um coração sereno e convicto de que o Senhor cuida de cada detalhe.',
        seconds: 60
      }
    ]
  },
  {
    id: 'med-2',
    title: 'Alívio Profundo da Ansiedade',
    durationMinutes: 8,
    theme: 'Cura Emocional & Confiança',
    description: 'Guia meditativo terapêutico baseado em Filipenses 4:6-7 com visualização das mãos do Pai acolhendo suas dores.',
    isPremium: true,
    stages: [
      {
        title: 'Reconhecimento sem Julgamento',
        guidance: 'Coloque uma das mãos sobre o coração e outra sobre o abdômen. Sinta as batidas da vida. Não tente lutar contra o que sente; apenas traga tudo à luz da graça.',
        seconds: 60
      },
      {
        title: 'A Paz que Excede o Entendimento',
        guidance: 'Imagine as mãos calejadas e acolhedoras de Jesus estendidas para você. Uma a uma, deposite nelas as incertezas financeiras, de saúde e familiares.',
        seconds: 120
      },
      {
        title: 'Respiração 4-7-8 com Versículo',
        guidance: 'Inspire contando até 4... retenha o fôlego contando até 7 agradecendo a Deus... e expire contando até 8 liberando todo medo acumulado.',
        seconds: 150
      },
      {
        title: 'Afirmação de Proteção Eterna',
        guidance: 'Declare em seu íntimo: "O Senhor é a minha luz e a minha salvação; a quem temerei?". Sinta o calor da paz envolvendo o seu peito.',
        seconds: 90
      }
    ]
  },
  {
    id: 'med-3',
    title: 'Renovação Matinal de Fé e Foco',
    durationMinutes: 6,
    theme: 'Clareza & Propósito',
    description: 'Consagração matinal para blindar as emoções contra distrações e estresse durante o dia.',
    isPremium: true,
    stages: [
      {
        title: 'Despertar Consciente',
        guidance: 'Agradeça pelo milagre deste novo dia. Sinta o ar entrando puro nos pulmões. O ontem já passou; a misericórdia de hoje é fresca e abundante.',
        seconds: 60
      },
      {
        title: 'Foco no Reino',
        guidance: 'Pergunte ao Senhor: "Como posso ser instrumento do Teu amor hoje?". Permita que a resposta venha no silêncio do seu coração.',
        seconds: 90
      },
      {
        title: 'Unção com Óleo de Alegria',
        guidance: 'Visualiza a graça de Deus ungindo sua mente para tomar decisões sábias, falar com amor e prosperar nas tarefas que virão.',
        seconds: 90
      }
    ]
  },
  {
    id: 'med-4',
    title: 'Sono Restaurador nos Braços do Pastor',
    durationMinutes: 10,
    theme: 'Descanso Noturno & Paz',
    description: 'Meditação noturna ao som de águas tranquilas para adormecer em paz, sem insônia.',
    isPremium: true,
    stages: [
      {
        title: 'Desconectando do Mundo',
        guidance: 'Deite-se confortavelmente. Solte o peso do corpo sobre o colchão. O dia foi encerrado. O que foi feito, foi feito. O que faltou, Deus guarda.',
        seconds: 90
      },
      {
        title: 'Águas de Descanso (Salmo 23)',
        guidance: 'Imagine-se caminhando à margem de um riacho sereno e límpido. O Bom Pastor caminha ao seu lado. O fardo foi retirado dos seus ombros.',
        seconds: 180
      },
      {
        title: 'Entrega do Subconsciente a Deus',
        guidance: 'Em paz me deito e logo adormeço, pois só Tu, Senhor, me fazes repousar em segurança. Deixe a respiração ficar cada vez mais lenta e suave...',
        seconds: 180
      }
    ]
  }
];

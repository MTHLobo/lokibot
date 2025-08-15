function shuffleOptions(question) {
    const correctAnswer = question.opcoes[question.resposta];
    const options = [...question.opcoes];
    
    // Algoritmo Fisher-Yates para embaralhar as opções
    for (let i = options.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [options[i], options[j]] = [options[j], options[i]];
    }
    
    // Encontrar nova posição da resposta correta
    const newCorrectIndex = options.indexOf(correctAnswer);
    
    return {
        pergunta: question.pergunta,
        opcoes: options,
        resposta: newCorrectIndex,
        consequencia: question.consequencia
    };
}

const cardsBase = {
    queimadas: [
        {
            pergunta: "Qual é o número correto para acionar os Bombeiros em caso de incêndio?",
            opcoes: ["193", "190", "192"],
            resposta: 0,
            consequencia: { acerto: 2, erro: -1 }
        },
        {
            pergunta: "Por que as queimadas prejudicam o solo?",
            opcoes: [
                "Destroem os nutrientes e microrganismos essenciais",
                "Apenas escurecem o solo",
                "Ajudam na fertilização do solo"
            ],
            resposta: 0,
            consequencia: { acerto: 2, erro: -1 }
        },
        {
            pergunta: "Como as queimadas afetam a saúde das pessoas?",
            opcoes: [
                "Causam problemas respiratórios e cardíacos",
                "Apenas irritam os olhos",
                "Não causam problemas de saúde"
            ],
            resposta: 0,
            consequencia: { acerto: 3, erro: -2 }
        },
        {
            pergunta: "O que fazer ao ver uma queimada?",
            opcoes: ["Ligar para os bombeiros", "Ignorar", "Tentar apagar sozinho"],
            resposta: 0,
            consequencia: {
                acerto: 2,
                erro: -1
            }
        },
        {
            pergunta: "Qual a principal causa de queimadas no Pantanal?",
            opcoes: ["Raios", "Ação humana", "Combustão espontânea"],
            resposta: 1,
            consequencia: {
                acerto: 2,
                erro: -1
            }
        },
        {
            pergunta: "O que NÃO devemos fazer em época de seca?",
            opcoes: ["Fazer fogueiras", "Regar plantas", "Economizar água"],
            resposta: 0,
            consequencia: {
                acerto: 3,
                erro: -2
            }
        },
        {
            pergunta: "Como prevenir queimadas em áreas rurais?",
            opcoes: [
                "Fazer aceiros",
                "Queimar durante a noite",
                "Esperar a chuva"
            ],
            resposta: 0,
            consequencia: { acerto: 3, erro: -2 }
        },
        {
            pergunta: "O que é um aceiro?",
            opcoes: [
                "Uma faixa sem vegetação que impede o avanço do fogo",
                "Um tipo de extintor de incêndio",
                "Uma ferramenta de combate ao fogo"
            ],
            resposta: 0,
            consequencia: { acerto: 2, erro: -1 }
        },
        {
            pergunta: "Qual é o período proibitivo de queimadas rurais?",
            opcoes: [
                "1º de julho a 31 de outubro",
                "1º de janeiro a 31 de março",
                "1º de dezembro a 28 de fevereiro"
            ],
            resposta: 0,
            consequencia: { acerto: 2, erro: -1 }
        },
        {
            pergunta: "É permitido fazer queimada no perímetro urbano?",
            opcoes: [
                "Não, é proibido durante todo o ano",
                "Sim, em qualquer época",
                "Apenas fora do período proibitivo"
            ],
            resposta: 0,
            consequencia: { acerto: 1, erro: -2 }
        },
        {
            pergunta: "A SEMA autoriza queimada controlada em APP e Reserva Legal?",
            opcoes: [
                "Não, pois são áreas de vegetação nativa protegidas",
                "Sim, com autorização especial",
                "Apenas em casos específicos"
            ],
            resposta: 0,
            consequencia: { acerto: 0, erro: -1 }
        }
    ],
    pesca: [
        {
            pergunta: "Qual é a importância da piracema?",
            opcoes: [
                "É o período essencial para a reprodução dos peixes",
                "É a melhor época para pescar",
                "É um festival de pesca"
            ],
            resposta: 0,
            consequencia: { acerto: 2, erro: -2 }
        },
        {
            pergunta: "Por que as bacias hidrográficas são importantes para os peixes?",
            opcoes: [
                "São caminhos naturais para migração e reprodução",
                "Servem apenas para navegação",
                "São barreiras naturais para os peixes"
            ],
            resposta: 0,
            consequencia: { acerto: 2, erro: -1 }
        },
        {
            pergunta: "Por que devemos respeitar o tamanho mínimo dos peixes?",
            opcoes: [
                "Para garantir que se reproduzam ao menos uma vez",
                "Porque peixes pequenos não são saborosos",
                "Para economizar isca"
            ],
            resposta: 0,
            consequencia: { acerto: 2, erro: -2 }
        },
        {
            pergunta: "Qual é o período de defeso?",
            opcoes: ["Durante a piracema", "Durante o verão", "Não existe período"],
            resposta: 0,
            consequencia: {
                acerto: 2,
                erro: -2
            }
        },
        {
            pergunta: "Por que é importante respeitar o período de defeso?",
            opcoes: [
                "Para preservar a reprodução dos peixes",
                "Para economizar combustível",
                "Porque os peixes ficam maiores"
            ],
            resposta: 0,
            consequencia: { acerto: 3, erro: -2 }
        },
        {
            pergunta: "Qual dessas práticas é ilegal na pesca?",
            opcoes: [
                "Usar rede de arrasto em rios",
                "Pescar com vara e anzol",
                "Respeitar o tamanho mínimo dos peixes"
            ],
            resposta: 0,
            consequencia: { acerto: 2, erro: -2 }
        },
        {
            pergunta: "Você fisga uma piraputanga de 25cm, o que deve fazer?",
            opcoes: [
                "Devolver imediatamente ao rio",
                "Levar para casa",
                "Vender no mercado"
            ],
            resposta: 0,
            consequencia: { acerto: 2, erro: -2 }
        },
        {
            pergunta: "Qual é a medida mínima para captura do cachara?",
            opcoes: [
                "80 centímetros",
                "60 centímetros",
                "40 centímetros"
            ],
            resposta: 0,
            consequencia: { acerto: 1, erro: 0 }
        },
        {
            pergunta: "É permitida a captura do dourado em Mato Grosso?",
            opcoes: [
                "Não, é proibida a captura",
                "Sim, sem restrições",
                "Apenas com licença especial"
            ],
            resposta: 0,
            consequencia: { acerto: 1, erro: -2 }
        }
    ],
    vegetacao: [
        {
            pergunta: "Qual é a função principal da mata ciliar?",
            opcoes: [
                "Proteger os rios, evitar erosão e servir de corredor ecológico",
                "Apenas fazer sombra nos rios",
                "Marcar os limites das propriedades"
            ],
            resposta: 0,
            consequencia: { acerto: 3, erro: -2 }
        },
        {
            pergunta: "Como as árvores contribuem para o ciclo da água?",
            opcoes: [
                "Pela transpiração e retenção de água no solo",
                "Apenas fazendo sombra",
                "Impedindo a passagem da chuva"
            ],
            resposta: 0,
            consequencia: { acerto: 2, erro: -1 }
        },
        {
            pergunta: "O que é um corredor ecológico?",
            opcoes: [
                "Área que liga fragmentos de vegetação permitindo o trânsito de animais",
                "Caminho para pessoas na floresta",
                "Área de plantio de árvores"
            ],
            resposta: 0,
            consequencia: { acerto: 2, erro: -1 }
        },
        {
            pergunta: "Por que não devemos cortar árvores nas margens dos rios?",
            opcoes: [
                "Para proteger as margens contra erosão",
                "Porque dá muito trabalho",
                "Para fazer sombra aos peixes"
            ],
            resposta: 0,
            consequencia: { acerto: 3, erro: -1 }
        },
        {
            pergunta: "O que é uma mata ciliar?",
            opcoes: [
                "Vegetação que protege os rios e córregos",
                "Um tipo de plantação",
                "Uma floresta distante da água"
            ],
            resposta: 0,
            consequencia: { acerto: 2, erro: -2 }
        },
        {
            pergunta: "Qual a importância do Pantanal?",
            opcoes: [
                "É um dos maiores biomas alagados do mundo",
                "É bom para pescar",
                "Tem muitos jacarés"
            ],
            resposta: 0,
            consequencia: { acerto: 3, erro: -1 }
        },
        {
            pergunta: "Qual o percentual de Reserva Legal em área de Cerrado?",
            opcoes: [
                "35% da área total",
                "20% da área total",
                "50% da área total"
            ],
            resposta: 0,
            consequencia: { acerto: 1, erro: 0 }
        },
        {
            pergunta: "É permitido construir aterros e barramentos no Pantanal?",
            opcoes: [
                "Não, pois interfere no fluxo natural das águas",
                "Sim, sem restrições",
                "Apenas com autorização"
            ],
            resposta: 0,
            consequencia: { acerto: 0, erro: -2 }
        }
    ],
    residuos: [
        {
            pergunta: "O que significam os 5Rs da sustentabilidade?",
            opcoes: [
                "Repensar, Recusar, Reduzir, Reutilizar e Reciclar",
                "Apenas Reciclar e Reutilizar",
                "Recolher, Remover, Reduzir, Reciclar e Reutilizar"
            ],
            resposta: 0,
            consequencia: { acerto: 3, erro: -2 }
        },
        {
            pergunta: "Qual é a importância da compostagem?",
            opcoes: [
                "Reduz o lixo orgânico e produz adubo natural",
                "Apenas ocupa espaço no jardim",
                "Serve apenas para decorar o jardim"
            ],
            resposta: 0,
            consequencia: { acerto: 2, erro: -1 }
        },
        {
            pergunta: "Como devemos descartar medicamentos vencidos?",
            opcoes: [
                "Em postos de coleta específicos",
                "No lixo comum",
                "No vaso sanitário"
            ],
            resposta: 0,
            consequencia: { acerto: 2, erro: -2 }
        },
        {
            pergunta: "Como o lixo eletrônico prejudica o meio ambiente?",
            opcoes: [
                "Contamina o solo e a água com metais pesados",
                "Não causa nenhum dano",
                "Apenas ocupa espaço nos aterros"
            ],
            resposta: 0,
            consequencia: { acerto: 3, erro: -2 }
        },
        {
            pergunta: "O que fazer com o lixo durante um passeio na natureza?",
            opcoes: [
                "Guardar e levar de volta",
                "Enterrar",
                "Queimar"
            ],
            resposta: 0,
            consequencia: { acerto: 2, erro: -2 }
        },
        {
            pergunta: "Qual o tempo de decomposição de uma garrafa PET?",
            opcoes: [
                "Mais de 400 anos",
                "1 ano",
                "10 anos"
            ],
            resposta: 0,
            consequencia: { acerto: 3, erro: -1 }
        },
        {
            pergunta: "Como separar corretamente o lixo reciclável?",
            opcoes: [
                "Limpar e separar por tipo de material",
                "Misturar tudo numa sacola",
                "Não precisa separar"
            ],
            resposta: 0,
            consequencia: { acerto: 2, erro: -2 }
        },
        {
            pergunta: "Caso meu município tenha coleta seletiva ou associação de catadores, como posso ajudar?",
            opcoes: [
                "Separar o lixo reciclável para a coleta seletiva",
                "Jogar tudo misturado",
                "Queimar o lixo"
            ],
            resposta: 0,
            consequencia: { acerto: 3, erro: -2 }
        },
        {
            pergunta: "Podemos jogar no lixo: pilhas, baterias, lâmpadas e aerossóis?",
            opcoes: [
                "Sim, não tem problema",
                "Não, pois contaminam solo e água",
                "Apenas se estiverem vazios"
            ],
            resposta: 1,
            consequencia: { acerto: 2, erro: -2 }
        },
        {
            pergunta: "Qual processo permite transformar resíduos orgânicos em adubo?",
            opcoes: [
                "Compostagem",
                "Reciclagem",
                "Incineração"
            ],
            resposta: 0,
            consequencia: { acerto: 2, erro: -1 }
        }
    ]
};

// Criar proxy para embaralhar as opções quando acessadas
const cards = new Proxy(cardsBase, {
    get: function(target, prop) {
        if (prop in target) {
            // Retorna uma nova array com as opções embaralhadas
            return target[prop].map(question => shuffleOptions(question));
        }
        return undefined;
    }
});

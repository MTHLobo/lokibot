import random
import os
import time

# --- Conteúdo extraído de cards.js ---
# As perguntas foram convertidas para um dicionário Python.
CARDS = {
    'queimadas': [
        {
            "pergunta": "Qual é o número correto para acionar os Bombeiros em caso de incêndio?",
            "opcoes": ["193", "190", "192"],
            "resposta": 0, # Índice da resposta correta (193)
            "consequencia": { "acerto": 2, "erro": -1 }
        },
        {
            "pergunta": "Como as queimadas afetam a saúde das pessoas?",
            "opcoes": [
                "Causam problemas respiratórios e cardíacos",
                "Apenas irritam os olhos",
                "Não causam problemas de saúde"
            ],
            "resposta": 0,
            "consequencia": { "acerto": 3, "erro": -2 }
        },
        {
            "pergunta": "Qual é o período proibitivo de queimadas rurais em Mato Grosso?",
            "opcoes": [
                "1º de julho a 31 de outubro",
                "1º de janeiro a 31 de março",
                "1º de dezembro a 28 de fevereiro"
            ],
            "resposta": 0,
            "consequencia": { "acerto": 2, "erro": -1 }
        },
    ],
    'pesca': [
        {
            "pergunta": "Qual é a importância da piracema?",
            "opcoes": [
                "É o período essencial para a reprodução dos peixes",
                "É a melhor época para pescar",
                "É um festival de pesca"
            ],
            "resposta": 0,
            "consequencia": { "acerto": 2, "erro": -2 }
        },
        {
            "pergunta": "Você fisga uma piraputanga de 25cm (o mínimo é 30cm). O que deve fazer?",
            "opcoes": [
                "Devolver imediatamente ao rio",
                "Levar para casa",
                "Vender no mercado"
            ],
            "resposta": 0,
            "consequencia": { "acerto": 2, "erro": -2 }
        },
         {
            "pergunta": "É permitida a captura do peixe Dourado em Mato Grosso?",
            "opcoes": [
                "Não, a captura, transporte e comercialização são proibidas",
                "Sim, sem restrições",
                "Apenas com licença especial"
            ],
            "resposta": 0,
            "consequencia": { "acerto": 1, "erro": -2 }
        }
    ],
    'vegetacao': [
        {
            "pergunta": "Qual é a função principal da mata ciliar (vegetação na margem dos rios)?",
            "opcoes": [
                "Proteger os rios, evitar erosão e servir de corredor ecológico",
                "Apenas fazer sombra nos rios",
                "Marcar os limites das propriedades"
            ],
            "resposta": 0,
            "consequencia": { "acerto": 3, "erro": -2 }
        },
        {
            "pergunta": "Em uma propriedade no cerrado de Mato Grosso, qual o percentual de Reserva Legal?",
            "opcoes": [
                "35% da área do imóvel",
                "20% da área do imóvel",
                "80% da área do imóvel"
            ],
            "resposta": 0,
            "consequencia": { "acerto": 1, "erro": 0 }
        },
    ],
    'residuos': [
        {
            "pergunta": "O que significam os 5Rs da sustentabilidade?",
            "opcoes": [
                "Repensar, Recusar, Reduzir, Reutilizar e Reciclar",
                "Apenas Reciclar e Reutilizar",
                "Recolher, Remover, Reduzir, Reciclar e Reutilizar"
            ],
            "resposta": 0,
            "consequencia": { "acerto": 3, "erro": -2 }
        },
        {
            "pergunta": "Como devemos descartar pilhas e baterias?",
            "opcoes": [
                "Em postos de coleta específicos, nunca no lixo comum",
                "No lixo comum",
                "No lixo reciclável"
            ],
            "resposta": 0,
            "consequencia": { "acerto": 2, "erro": -2 }
        },
    ]
}

# --- Configurações do Jogo (extraídas de game.js) ---
TOTAL_SPACES = 40
# Mapeamento das casas especiais para um tema
SPECIAL_SPACES = {
    3: 'pesca', 7: 'pesca', 10: 'pesca',
    13: 'queimadas', 16: 'queimadas', 19: 'queimadas',
    23: 'vegetacao', 26: 'vegetacao', 29: 'vegetacao',
    33: 'residuos', 36: 'residuos', 39: 'residuos'
}
# Emojis para os temas, para deixar o terminal mais visual
THEME_ICONS = {
    'pesca': '🐟',
    'queimadas': '🔥',
    'vegetacao': '🌳',
    'residuos': '♻️'
}

# --- Funções do Jogo ---

def clear_screen():
    """Limpa a tela do terminal para melhorar a visualização."""
    os.system('cls' if os.name == 'nt' else 'clear')

def setup_game():
    """Configura os jogadores no início do jogo."""
    clear_screen()
    print("==============================================")
    print("🌳 Fique Legal com o Meio Ambiente 🌳")
    print("==============================================")
    
    while True:
        try:
            num_players = int(input("Digite o número de jogadores (2-4): "))
            if 2 <= num_players <= 4:
                break
            else:
                print("Por favor, digite um número entre 2 e 4.")
        except ValueError:
            print("Entrada inválida. Digite um número.")

    players = []
    player_icons = ['PLAYER 1', 'PLAYER 2', 'PLAYER 3', 'PLAYER 4']
    for i in range(num_players):
        while True:
            name = input(f"Digite o nome do Jogador {i+1}: ").strip()
            if name:
                players.append({"name": name, "icon": player_icons[i], "position": 0})
                break
            else:
                print("O nome não pode ser vazio.")
    return players

def display_board(players):
    """Mostra o estado atual do tabuleiro de forma textual."""
    print("\n--- TABULEIRO (Casas 1 a 40) ---")
    
    # Cria uma representação para cada casa
    board_display = ["| _ " for _ in range(TOTAL_SPACES)]
    
    # Coloca os jogadores em suas posições
    for i, player in enumerate(players):
        # A posição 0 é o início, antes da casa 1
        if player['position'] > 0:
            # Posição no array é `posição do jogo - 1`
            pos_index = player['position'] - 1
            # Adiciona o ícone do jogador à casa
            board_display[pos_index] = f"| {i+1} "

    # Imprime o tabuleiro em linhas para melhor visualização
    # 10 casas por linha
    for i in range(0, TOTAL_SPACES, 10):
        print(" ".join(board_display[i:i+10]) + "|")

    print("\n--- POSIÇÃO DOS JOGADORES ---")
    for i, player in enumerate(players):
        # Mostra "INÍCIO" se estiver na posição 0
        pos_text = "INÍCIO" if player['position'] == 0 else f"Casa {player['position']}"
        print(f"Jogador {i+1} ({player['name']}): {pos_text}")
    print("-" * 30)


def show_card(theme):
    """Mostra uma carta do tema especificado e processa a resposta."""
    icon = THEME_ICONS.get(theme, '❓')
    print(f"\n{icon} CARTA ESPECIAL - TEMA: {theme.upper()} {icon}")

    # Seleciona uma carta aleatória do tema
    card = random.choice(CARDS[theme])
    
    # Embaralha as opções e a resposta correta juntas
    options = card['opcoes']
    correct_answer_text = options[card['resposta']]
    random.shuffle(options)
    new_correct_index = options.index(correct_answer_text)

    print("\nPergunta:", card['pergunta'])
    for i, option in enumerate(options):
        print(f"  {i+1}. {option}")

    while True:
        try:
            answer = int(input("\nDigite o número da sua resposta: "))
            if 1 <= answer <= len(options):
                # O índice do array é `resposta do usuário - 1`
                if (answer - 1) == new_correct_index:
                    print("\n✅ Resposta Correta!")
                    consequence = card['consequencia']['acerto']
                    print(f"Você avança {consequence} casas.")
                    return consequence
                else:
                    print("\n❌ Resposta Incorreta!")
                    consequence = card['consequencia']['erro']
                    if consequence < 0:
                        print(f"Você volta {abs(consequence)} casas.")
                    else:
                         print("Você fica no mesmo lugar.")
                    return consequence
                break
            else:
                print("Resposta inválida. Escolha um dos números das opções.")
        except ValueError:
            print("Entrada inválida. Por favor, digite um número.")


def main():
    """Função principal que executa o fluxo do jogo."""
    players = setup_game()
    current_player_index = 0
    winner = None

    while not winner:
        clear_screen()
        display_board(players)
        
        player = players[current_player_index]
        print(f"\n---> É a vez de {player['name']} (Jogador {current_player_index + 1})")
        input("Pressione Enter para jogar o dado...")

        dice_roll = random.randint(1, 6)
        print(f"\n🎲 Você tirou {dice_roll} no dado!")
        time.sleep(1)

        # Calcula a nova posição
        player['position'] += dice_roll

        # Verifica se o jogador venceu
        if player['position'] >= TOTAL_SPACES:
            player['position'] = TOTAL_SPACES
            winner = player
            print(f"\n{player['name']} chegou ao final do tabuleiro!")
            time.sleep(1)
            continue # Pula para a próxima iteração do loop para finalizar

        print(f"{player['name']} avançou para a casa {player['position']}.")
        time.sleep(1)

        # Verifica se caiu em uma casa especial
        if player['position'] in SPECIAL_SPACES:
            theme = SPECIAL_SPACES[player['position']]
            consequence = show_card(theme)
            
            player['position'] += consequence
            # Garante que a posição não seja negativa
            if player['position'] < 0:
                player['position'] = 0
            
            time.sleep(3) # Pausa para o jogador ler o resultado da carta

        # Passa a vez para o próximo jogador
        current_player_index = (current_player_index + 1) % len(players)

    # Fim de jogo
    clear_screen()
    print("===================================")
    print("🎉🏆 FIM DE JOGO! 🏆🎉")
    print("===================================")
    print(f"\nO grande vencedor é {winner['name']}!")
    print("\nParabéns por aprender mais sobre como preservar o meio ambiente!")
    
    print("\nPosições Finais:")
    display_board(players)


# Ponto de entrada do programa
if __name__ == "__main__":
    main()
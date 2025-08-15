#streamlit run jogo_streamlit.py
# jogo_streamlit.py

import jogo_streamlit as st
import random
import time

# --- Configurações Iniciais do Jogo ---
TOTAL_SPACES = 40
CARDS = {
    'queimadas': [{"pergunta": "Qual o número para acionar os Bombeiros?", "opcoes": ["193", "190", "192"], "resposta": 0, "consequencia": {"acerto": 2, "erro": -1}}],
    'pesca': [{"pergunta": "Qual a importância da piracema?", "opcoes": ["Reprodução dos peixes", "Melhor época para pescar", "Festival de pesca"], "resposta": 0, "consequencia": {"acerto": 2, "erro": -2}}],
    'vegetacao': [{"pergunta": "Qual a função da mata ciliar?", "opcoes": ["Proteger os rios", "Fazer sombra", "Marcar limites"], "resposta": 0, "consequencia": {"acerto": 3, "erro": -2}}],
    'residuos': [{"pergunta": "O que significam os 5Rs?", "opcoes": ["Repensar, Recusar, Reduzir...", "Apenas Reciclar", "Recolher, Remover..."], "resposta": 0, "consequencia": {"acerto": 3, "erro": -2}}]
}
SPECIAL_SPACES = {3: 'pesca', 7: 'pesca', 10: 'pesca', 13: 'queimadas', 16: 'queimadas', 19: 'queimadas', 23: 'vegetacao', 26: 'vegetacao', 29: 'vegetacao', 33: 'residuos', 36: 'residuos', 39: 'residuos'}
PLAYER_ICONS = ["👨‍🌾", "👩‍🔬", "🧑‍🏫", "👨‍🎨"]

# --- Inicialização do Estado do Jogo ---
# O st.session_state guarda a "memória" do jogo entre as interações.
if 'game_stage' not in st.session_state:
    st.session_state.game_stage = 'SETUP'
    st.session_state.players = [{"name": "Jogador 1", "position": 0, "icon": "👨‍🌾"}, {"name": "Jogador 2", "position": 0, "icon": "👩‍🔬"}]
    st.session_state.num_players = 2
    st.session_state.current_player_index = 0
    st.session_state.dice_roll = 0
    st.session_state.log = ["Bem-vindo ao Jogo!"]
    st.session_state.card_info = None
    st.session_state.winner = None

# --- Funções de Lógica do Jogo ---
def restart_game():
    """Reseta o estado do jogo para a tela de configuração."""
    st.session_state.game_stage = 'SETUP'
    st.session_state.players = [{"name": "Jogador 1", "position": 0, "icon": "👨‍🌾"}, {"name": "Jogador 2", "position": 0, "icon": "👩‍🔬"}]
    st.session_state.num_players = 2
    st.session_state.current_player_index = 0
    st.session_state.dice_roll = 0
    st.session_state.log = ["Bem-vindo ao Jogo!"]
    st.session_state.card_info = None
    st.session_state.winner = None

def play_turn():
    """Executa a jogada do jogador atual."""
    player = st.session_state.players[st.session_state.current_player_index]
    st.session_state.dice_roll = random.randint(1, 6)
    player['position'] += st.session_state.dice_roll
    
    st.session_state.log.append(f"{player['name']} tirou {st.session_state.dice_roll} e foi para a casa {player['position']}.")

    if player['position'] >= TOTAL_SPACES:
        player['position'] = TOTAL_SPACES
        st.session_state.winner = player['name']
        st.session_state.game_stage = 'GAMEOVER'
    elif player['position'] in SPECIAL_SPACES:
        theme = SPECIAL_SPACES[player['position']]
        card = random.choice(CARDS[theme])
        
        options = card['opcoes'][:]
        correct_answer_text = options[card['resposta']]
        random.shuffle(options)
        new_correct_index = options.index(correct_answer_text)
        
        st.session_state.card_info = {
            'theme': theme, 'question': card['pergunta'], 'options': options,
            'correct_index': new_correct_index, 'consequence': card['consequence']
        }
        st.session_state.game_stage = 'CARD'
    else:
        # Passa a vez para o próximo jogador
        st.session_state.current_player_index = (st.session_state.current_player_index + 1) % len(st.session_state.players)

def answer_card(was_correct):
    """Aplica a consequência da resposta da carta."""
    player = st.session_state.players[st.session_state.current_player_index]
    consequence = st.session_state.card_info['consequence']
    move = consequence['acerto'] if was_correct else consequence['erro']
    player['position'] += move
    if player['position'] < 0: player['position'] = 0
    
    msg = f"Resposta {'correta' if was_correct else 'incorreta'}. {player['name']} moveu {move} casas."
    st.session_state.log.append(msg)
    
    if player['position'] >= TOTAL_SPACES:
        player['position'] = TOTAL_SPACES
        st.session_state.winner = player['name']
        st.session_state.game_stage = 'GAMEOVER'
    else:
        st.session_state.game_stage = 'PLAYING'
        st.session_state.current_player_index = (st.session_state.current_player_index + 1) % len(st.session_state.players)
    
    st.session_state.card_info = None


# --- Interface Gráfica (Renderização da Página) ---

st.set_page_config(page_title="Jogo Ambiental", layout="wide")

st.title("🌳 Fique Legal com o Meio Ambiente 🌳")

# --- Tela de Configuração (SETUP) ---
if st.session_state.game_stage == 'SETUP':
    st.header("Configuração do Jogo")
    num = st.slider("Número de jogadores:", 2, 4, st.session_state.num_players)
    
    # Atualiza a lista de jogadores dinamicamente
    if num != st.session_state.num_players:
        st.session_state.num_players = num
        while len(st.session_state.players) < num:
            st.session_state.players.append({"name": f"Jogador {len(st.session_state.players) + 1}", "position": 0, "icon": PLAYER_ICONS[len(st.session_state.players)]})
        while len(st.session_state.players) > num:
            st.session_state.players.pop()
    
    for i in range(st.session_state.num_players):
        st.session_state.players[i]['name'] = st.text_input(f"Nome do Jogador {i+1}", st.session_state.players[i]['name'])
    
    if st.button("Começar Jogo"):
        st.session_state.game_stage = 'PLAYING'
        st.rerun()

# --- Telas do Jogo Principal ---
else:
    # --- Barra Lateral (Sidebar) com Informações ---
    st.sidebar.header("Status do Jogo")
    current_player = st.session_state.players[st.session_state.current_player_index]
    st.sidebar.write(f"**Vez de:** {current_player['name']} {current_player['icon']}")
    st.sidebar.write(f"**Dado rolado:** {st.session_state.dice_roll if st.session_state.dice_roll else '-'}")
    
    st.sidebar.subheader("Posições")
    for p in st.session_state.players:
        pos_text = "INÍCIO" if p['position'] == 0 else f"Casa {p['position']}"
        st.sidebar.markdown(f"- {p['name']} {p['icon']}: **{pos_text}**")
        
    st.sidebar.subheader("Histórico")
    st.sidebar.text_area("", value="\n".join(st.session_state.log), height=200, disabled=True)

    # --- Área Principal (Tabuleiro e Controles) ---
    st.subheader("Tabuleiro")
    
    # Desenha o tabuleiro com colunas
    board_cols = st.columns(10)
    for i in range(TOTAL_SPACES):
        col = board_cols[i % 10]
        with col:
            players_in_space = [p['icon'] for p in st.session_state.players if p['position'] == i + 1]
            display_text = " ".join(players_in_space) if players_in_space else ""
            
            if i + 1 in SPECIAL_SPACES:
                st.info(f"**{i+1}**\n{display_text}")
            else:
                st.container(height=62, border=True).write(f"**{i+1}**\n{display_text}")

    st.markdown("---")

    # --- Lógica de Interação ---
    if st.session_state.game_stage == 'PLAYING':
        if st.button("🎲 Jogar Dado", use_container_width=True):
            play_turn()
            st.rerun()

    elif st.session_state.game_stage == 'CARD':
        st.info(f"**CARTA ESPECIAL: {st.session_state.card_info['theme'].upper()}**")
        st.markdown(f"### {st.session_state.card_info['question']}")
        
        for i, option in enumerate(st.session_state.card_info['options']):
            if st.button(option, key=f"option_{i}", use_container_width=True):
                was_correct = (i == st.session_state.card_info['correct_index'])
                answer_card(was_correct)
                st.rerun()

    elif st.session_state.game_stage == 'GAMEOVER':
        st.balloons()
        st.success(f"🎉 **FIM DE JOGO! O vencedor é {st.session_state.winner}!** 🎉")
        if st.button("Jogar Novamente", use_container_width=True):
            restart_game()
            st.rerun()
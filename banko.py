import sqlite3
import hashlib
import re
import random
from datetime import datetime

def configurar_banco():
    """Configura o banco de dados SQLite e cria a tabela de contas, se não existir."""
    conexao = sqlite3.connect("banco.db")
    cursor = conexao.cursor()
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS contas (
            numero_conta TEXT PRIMARY KEY,
            nome TEXT NOT NULL,
            cpf TEXT NOT NULL UNIQUE,
            email TEXT NOT NULL,
            senha TEXT NOT NULL,
            saldo REAL NOT NULL,
            movimentacoes TEXT
        )
    """)
    conexao.commit()
    conexao.close()

def criptografar_senha(senha):
    return hashlib.sha256(senha.encode()).hexdigest()

def verificar_senha(senha_digitada, senha_criptografada):
    return criptografar_senha(senha_digitada) == senha_criptografada

def validar_cpf(cpf):
    cpf = ''.join(filter(str.isdigit, cpf))
    if len(cpf) != 11 or len(set(cpf)) == 1:
        return False
    soma = sum(int(cpf[i]) * (10 - i) for i in range(9))
    digito1 = 11 - (soma % 11)
    digito1 = 0 if digito1 > 9 else digito1
    soma = sum(int(cpf[i]) * (11 - i) for i in range(10))
    digito2 = 11 - (soma % 11)
    digito2 = 0 if digito2 > 9 else digito2
    return cpf[-2:] == f"{digito1}{digito2}"

def validar_email(email):
    padrao = r"^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$"
    return re.match(padrao, email) is not None

def gerar_numero_conta():
    return f"{random.randint(1000, 9999)}-5"

def salvar_conta(conta):
    conexao = sqlite3.connect("banco.db")
    cursor = conexao.cursor()
    movimentacoes = "\n".join(conta["movimentacoes"])
    cursor.execute("""
        INSERT INTO contas (numero_conta, nome, cpf, email, senha, saldo, movimentacoes)
        VALUES (?, ?, ?, ?, ?, ?, ?)
    """, (conta["numero_conta"], conta["nome"], conta["cpf"], conta["email"], conta["senha"], conta["saldo"], movimentacoes))
    conexao.commit()
    conexao.close()

def carregar_contas():
    conexao = sqlite3.connect("banco.db")
    cursor = conexao.cursor()
    cursor.execute("SELECT * FROM contas")
    contas = {}
    for row in cursor.fetchall():
        numero_conta, nome, cpf, email, senha, saldo, movimentacoes = row
        contas[numero_conta] = {
            "nome": nome,
            "cpf": cpf,
            "email": email,
            "senha": senha,
            "saldo": saldo,
            "movimentacoes": movimentacoes.split("\n") if movimentacoes else []
        }
    conexao.close()
    return contas

def atualizar_conta(numero_conta, conta):
    conexao = sqlite3.connect("banco.db")
    cursor = conexao.cursor()
    movimentacoes = "\n".join(conta["movimentacoes"])
    cursor.execute("""
        UPDATE contas
        SET nome = ?, cpf = ?, email = ?, senha = ?, saldo = ?, movimentacoes = ?
        WHERE numero_conta = ?
    """, (conta["nome"], conta["cpf"], conta["email"], conta["senha"], conta["saldo"], movimentacoes, numero_conta))
    conexao.commit()
    conexao.close()

def cadastrar_conta(contas):
    print("Cadastrando conta...")
    nome = input("Digite seu nome: ")
    cpf = input("Digite seu CPF: ")
    if not validar_cpf(cpf):
        print("CPF inválido!")
        return contas
    email = input("Digite seu e-mail: ")
    if not validar_email(email):
        print("Email inválido!")
        return contas
    senha = input("Digite sua senha: ")
    saldo = float(input("Digite o saldo inicial: "))
    numero_conta = gerar_numero_conta()
    conta = {
        "numero_conta": numero_conta,
        "nome": nome,
        "cpf": cpf,
        "email": email,
        "senha": criptografar_senha(senha),
        "saldo": saldo,
        "movimentacoes": []
    }
    salvar_conta(conta)
    contas[numero_conta] = conta
    print(f"Conta criada com sucesso! Número da conta: {numero_conta}")
    return contas

def depositar(contas):
    numero_conta = input("Digite o número da conta para depósito: ")
    if numero_conta in contas:
        valor = float(input("Digite o valor a ser depositado: "))
        contas[numero_conta]["saldo"] += valor
        transacao = f"Depósito de R$ {valor:.2f}"
        contas[numero_conta]["movimentacoes"].append(transacao)
        atualizar_conta(numero_conta, contas[numero_conta])
        print("Depósito realizado com sucesso!")
    else:
        print("Conta não encontrada.")
    return contas

def sacar(contas):
    numero_conta = input("Digite o número da conta para saque: ")
    if numero_conta in contas:
        senha = input("Digite sua senha: ")
        if verificar_senha(senha, contas[numero_conta]["senha"]):
            valor = float(input("Digite o valor a ser sacado: "))
            if valor <= contas[numero_conta]["saldo"]:
                contas[numero_conta]["saldo"] -= valor
                transacao = f"Saque de R$ {valor:.2f}"
                contas[numero_conta]["movimentacoes"].append(transacao)
                atualizar_conta(numero_conta, contas[numero_conta])
                print("Saque realizado com sucesso!")
            else:
                print("Saldo insuficiente.")
        else:
            print("Senha incorreta.")
    else:
        print("Conta não encontrada.")
    return contas

def exibir_extrato(contas):
    numero_conta = input("Digite o número da conta para exibir o extrato: ")
    if numero_conta in contas:
        print("\n=== Extrato ===")
        for mov in contas[numero_conta]["movimentacoes"]:
            print(mov)
        print(f"Saldo atual: R$ {contas[numero_conta]['saldo']:.2f}")
    else:
        print("Conta não encontrada.")

def menu():
    print("\n--- Sistema Bancário ---")
    print("1 - Cadastrar conta")
    print("2 - Depositar")
    print("3 - Sacar")
    print("4 - Exibir extrato")
    print("0 - Sair")
    return input("Escolha uma opção: ")

def main():
    configurar_banco()
    contas = carregar_contas()
    while True:
        opcao = menu()
        if opcao == "1":
            contas = cadastrar_conta(contas)
        elif opcao == "2":
            contas = depositar(contas)
        elif opcao == "3":
            contas = sacar(contas)
        elif opcao == "4":
            exibir_extrato(contas)
        elif opcao == "0":
            print("Saindo do sistema...")
            break
        else:
            print("Opção inválida.")

if __name__ == "__main__":
    main()
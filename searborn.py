import pandas as pd
import seaborn as sns
import matplotlib.pyplot as plt

#1
# Carregar o dataset CSV (ajuste o caminho conforme o seu arquivo)
df = pd.read_csv("Ecommerce_Consumer_Behavior_Analysis_Data.csv")


# Plotar histograma com curva KDE
plt.figure(figsize=(10, 6))
sns.histplot(data=df, x="Age", kde=True, bins=20)
plt.title("Distribuição de Idade dos Clientes")
plt.xlabel("Idade")
plt.ylabel("Frequência")
plt.tight_layout()
plt.show()


#2
# Plotar countplot com porcentagens
plt.figure(figsize=(8, 5))
ax = sns.countplot(data=df, x="Gender",)

# Adicionar porcentagens nas barras
total = len(df)
for p in ax.patches:
    height = p.get_height()
    percentage = f'{100 * height / total:.1f}%'
    ax.annotate(percentage, (p.get_x() + p.get_width() / 2., height),
                ha='center', va='bottom', fontsize=12)

plt.title("Proporção de Gênero dos Clientes")
plt.ylabel("Contagem")
plt.xlabel("Gênero")
plt.tight_layout()
plt.show()


#3
plt.figure(figsize=(10, 6))
sns.boxplot(data=df, x="Income_Level", y="Purchase_Amount", palette="Set2")
plt.title("Valor Gasto por Nível de Renda")
plt.xlabel("Nível de Renda")
plt.ylabel("Valor Gasto ($)")
plt.tight_layout()
plt.show()


#4
plt.figure(figsize=(10, 6))
sns.histplot(data=df, x="Customer_Satisfaction", hue="Gender", multiple="stack", kde=False, palette="pastel", bins=10)
plt.title("Distribuição da Satisfação do Cliente por Gênero")
plt.xlabel("Satisfação (1 a 10)")
plt.ylabel("Quantidade")
plt.tight_layout()
plt.show()

#5
plt.figure(figsize=(10, 6))
sns.scatterplot(data=df,
                x="Time_Spent_on_Product_Research(hours)",
                y="Product_Rating",
                hue="Purchase_Category",
                palette="husl")
plt.title("Tempo de Pesquisa vs. Avaliação do Produto")
plt.xlabel("Tempo de Pesquisa (horas)")
plt.ylabel("Avaliação do Produto")
plt.tight_layout()
plt.show()

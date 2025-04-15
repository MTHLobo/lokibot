'''import pandas as pd
import seaborn as sns
import matplotlib.pyplot as plt

#1
# Carregar o dataset CSV (ajuste o caminho conforme o seu arquivo)
df = pd.read_csv("Ecommerce_Consumer_Behavior_Analysis_Data.csv")

plt.figure(figsize=(10, 6))
sns.histplot(data=df, x="Age", kde=True, bins=20, color="skyblue")
plt.title("Distribuição de Idade dos Clientes")
plt.xlabel("Idade")
plt.ylabel("Frequência")
plt.tight_layout()
plt.show()'''

import pandas as pd
import seaborn as sns
import matplotlib.pyplot as plt

# Carregar o dataset
df = pd.read_csv("Ecommerce_Consumer_Behavior_Analysis_Data.csv")

# Configurar o tema visual do Seaborn
sns.set_theme(style="whitegrid", palette="pastel")

# 1. Distribuição de Idade
plt.figure(figsize=(10, 6))
sns.histplot(data=df, x="Age", kde=True, bins=20)
plt.title("Distribuição de Idade dos Clientes")
plt.xlabel("Idade")
plt.ylabel("Frequência")
plt.tight_layout()
plt.show()

# 2. Proporção de Gênero
plt.figure(figsize=(8, 5))
ax = sns.countplot(data=df, x="Gender", palette="pastel")

# Adicionar porcentagens nas barras
total = len(df)
for p in ax.patches:
    height = p.get_height()
    percentage = f'{100 * height / total:.1f}%'
    ax.annotate(percentage, (p.get_x() + p.get_width() / 2., height), ha='center', va='bottom', fontsize=12)

plt.title("Proporção de Gênero dos Clientes")
plt.ylabel("Contagem")
plt.xlabel("Gênero")
plt.tight_layout()
plt.show()

# 3. Nível de Renda vs. Valor Gasto
plt.figure(figsize=(10, 6))
sns.boxplot(data=df, x="Income_Level", y="Purchase_Amount")
plt.title("Nível de Renda vs. Valor Gasto")
plt.xlabel("Nível de Renda")
plt.ylabel("Valor Gasto ($)")
plt.tight_layout()
plt.show()

# 4. Satisfação do Cliente
plt.figure(figsize=(10, 6))
sns.histplot(data=df, x="Customer_Satisfaction", hue="Gender", kde=True, bins=10)
plt.title("Satisfação do Cliente (Comparação por Gênero)")
plt.xlabel("Satisfação do Cliente (1-10)")
plt.ylabel("Frequência")
plt.tight_layout()
plt.show()


# Exercício 5: Tempo de Pesquisa vs. Avaliação do Produto
plt.figure(figsize=(12, 6))
sns.scatterplot(data=df, x="Time_Spent_on_Product_Research(hours)", y="Product_Rating", hue="Purchase_Category", palette="pastel")
plt.title("Tempo de Pesquisa vs. Avaliação do Produto")
plt.xlabel("Tempo de Pesquisa (Horas)")
plt.ylabel("Avaliação do Produto (1-5)")
plt.legend(bbox_to_anchor=(1.05, 1), loc='upper left')
plt.tight_layout()
plt.show()

# Exercício 6: Lealdade à Marca por Canal de Compra
plt.figure(figsize=(12, 6))
sns.violinplot(data=df, x="Purchase_Channel", y="Brand_Loyalty", hue="Discount_Used", split=True, palette="muted")
plt.title("Lealdade à Marca por Canal de Compra (Segmentado por Uso de Desconto)")
plt.xlabel("Canal de Compra")
plt.ylabel("Lealdade à Marca")
plt.tight_layout()
plt.show()

# Exercício 7: Impacto do Programa de Fidelidade
plt.figure(figsize=(10, 6))
sns.barplot(data=df, x="Customer_Loyalty_Program_Member", y="Frequency_of_Purchase", palette="pastel")
plt.title("Impacto do Programa de Fidelidade na Frequência de Compra")
plt.xlabel("Membro do Programa de Fidelidade")
plt.ylabel("Frequência de Compra")
plt.tight_layout()
plt.show()

# Exercício 8: Método de Pagamento vs. Dispositivo
heatmap_data = df.groupby(["Payment_Method", "Device_Used_for_Shopping"]).size().unstack()
plt.figure(figsize=(12, 6))
sns.heatmap(heatmap_data, annot=True, fmt="d", cmap="Blues")
plt.title("Frequência Cruzada entre Método de Pagamento e Dispositivo")
plt.xlabel("Dispositivo de Compra")
plt.ylabel("Método de Pagamento")
plt.tight_layout()
plt.show()

# Exercício 9: Segmentação por Localização
grid = sns.FacetGrid(df, col="Location", col_wrap=3, height=4)
grid.map(sns.scatterplot, "Age", "Purchase_Amount", alpha=0.7)
grid.set_titles("{col_name}")
grid.set_axis_labels("Idade", "Valor Gasto ($)")
plt.subplots_adjust(top=0.9)
grid.fig.suptitle("Segmentação por Localização: Idade vs. Valor Gasto")
plt.tight_layout()
plt.show()

# Exercício 10: Tendências Temporais
df["Time_of_Purchase"] = pd.to_datetime(df["Time_of_Purchase"])
monthly_data = df.groupby(df["Time_of_Purchase"].dt.to_period("M"))["Purchase_Amount"].mean()
plt.figure(figsize=(12, 6))
sns.lineplot(x=monthly_data.index.to_timestamp(), y=monthly_data.values)
plt.title("Tendências Temporais: Média Mensal do Valor Gasto")
plt.xlabel("Mês")
plt.ylabel("Valor Gasto ($)")
plt.tight_layout()
plt.show()

# Exercício 11: Clusterização com Pairplot
numerical_cols = df.select_dtypes(include=['float64', 'int64'])
sns.pairplot(numerical_cols, hue="Shipping_Preference", palette="coolwarm")
plt.title("Clusterização com Pairplot")
plt.show()
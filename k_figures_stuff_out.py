import pandas as pd

data = pd.read_csv("df_hats_clean1_with_clusters.csv")


data = pd.read_csv("df_hats.csv")
print(data.head())
print(data.columns)
print(data["media"])

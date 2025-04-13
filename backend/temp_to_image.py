import pandas as pd
from pathlib import Path

# Ścieżka do pliku .parquet
parquet_path = "train-00015-of-00100.parquet"

# Wczytanie danych
df = pd.read_parquet(parquet_path)

# Podgląd kolumn
print(df.columns)
print(df.head(1))
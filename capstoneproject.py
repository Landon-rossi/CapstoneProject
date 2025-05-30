# -*- coding: utf-8 -*-
"""CapstoneProject.ipynb

Automatically generated by Colab.

Original file is located at
    https://colab.research.google.com/drive/1THnF2VJJwzYz5t2zRZSXcQ_BEvY1GkPr
"""

import os
colab=1
if colab==1:
  from google.colab import drive
  drive.mount('/content/drive', force_remount=True)
  curent_folder='Colab Notebooks/Data'
  dest_folder='/content/drive/My Drive/'+curent_folder
  os.chdir(dest_folder)
  print('\n Current path: ' + os.getcwd())

import pandas as pd

SolarWindData = pd.read_csv('SO_ML_2022Jan_to_2023Apr.csv', skiprows=[0])
SolarWindData.head()
len(SolarWindData)

"""# Preprocessing"""

import numpy as np

df2 = SolarWindData.isna()
for i in df2.columns.values.tolist():
    print (df2[i].value_counts())
    print("")

Ratio = SolarWindData['O7_O6_ratio']

negativerows = []
index = 0
for i in Ratio:
  if i <= 0:
    negativerows.append(index)
  index += 1

print(negativerows)
len(negativerows)

for i in negativerows:
  SolarWindData.drop(i, inplace=True)

SolarWindData.head()

SolarWindData.reset_index(drop=True, inplace=True)
SolarWindData.head()

infinite_values = SolarWindData.isin([np.inf])
for i in infinite_values.columns.values.tolist():
    print (infinite_values[i].value_counts())
    print("")

Velocity = SolarWindData['velocity']

infiniterows = []
index = 0
for i in Velocity:
  if i == np.inf:
    infiniterows.append(index)
  index += 1

print(infiniterows)
len(infiniterows)

for i in infiniterows:
  SolarWindData.drop(i, inplace=True)

SolarWindData.head()

SolarWindData.reset_index(drop=True, inplace=True)
SolarWindData.head()

SolarWindData.drop(['fractional_year'], axis=1, inplace=True)
SolarWindData.head()

import numpy as np
from sklearn.preprocessing import MinMaxScaler, PowerTransformer
from sklearn.decomposition import PCA

minmax = MinMaxScaler()
mmx = minmax.fit_transform(SolarWindData)
mmx = pd.DataFrame(mmx, columns=SolarWindData.columns)
power = PowerTransformer()
pwt = power.fit_transform(SolarWindData)
pwt = pd.DataFrame(pwt, columns=SolarWindData.columns)

def doPCA(data):
  pca = PCA(n_components=2)
  newData = pca.fit_transform(data)
  return pd.DataFrame(newData, columns=['PC1', 'PC2'])

normalized_dfs = [mmx, pwt]

pca_dfs = []

pca_dfs.append(doPCA(SolarWindData))
for i in range(len(normalized_dfs)):
  pca_dfs.append(doPCA(normalized_dfs[i]))

from scipy.stats import zscore
import matplotlib.pyplot as plt


def outlierdetection(data):
  normal_bit = 0
  for i in data:
      pca_df = pd.DataFrame(i, columns=['PC1', 'PC2'])
      pca_df['zscore_PC1'] = zscore(pca_df['PC1'])
      pca_df['zscore_PC2'] = zscore(pca_df['PC2'])
      threshold = 3
      outliers = pca_df[(pca_df['zscore_PC1'].abs() > threshold) | (pca_df['zscore_PC2'].abs() > threshold) ]
      plt.scatter(pca_df['PC1'], pca_df['PC2'], s=20, label='Data', alpha=0.2)
      plt.scatter(outliers['PC1'], outliers['PC2'], color='orange', edgecolor='black', s=50, label='Outlier', marker='X')
      if normal_bit == 0:
        plt.title('Original Data')
      elif normal_bit == 1:
        plt.title('Standardized Data')
      elif normal_bit == 2:
        plt.title('MinMax Scaled Data')
      elif normal_bit == 3:
        plt.title('Robust Scaled Data')
      elif normal_bit == 4:
        plt.title('MaxAbs Scaled Data')
      plt.xlabel('PC1')
      plt.ylabel('PC2')
      plt.legend()
      plt.show()
      print(f"Number of outliers detected: {len(outliers)}")
      normal_bit += 1

outlierdetection(pca_dfs)

import matplotlib.pyplot as plt

min_max_data = normalized_dfs[0]
pwr_tran_data = normalized_dfs[1]

def displayvariabledist(data):
  for i in data:
    plt.hist(data[i], 300)
    plt.title(i)
    plt.show()

displayvariabledist(min_max_data)
displayvariabledist(pwr_tran_data)

"""# Clustering Algorithims"""

min_max_random_sample = normalized_dfs[0].sample(n=5000, random_state=23)
pwr_tran_data_sample = normalized_dfs[1].sample(n=5000, random_state=23)

import numpy as np
import matplotlib.pyplot as plt
from sklearn.cluster import KMeans

for i in (min_max_random_sample, pwr_tran_data_sample):
  X = np.array(min_max_random_sample)
  for j in range(1, 8):
    kmeans = KMeans(n_clusters=j, random_state=0)
    y_kmeans = kmeans.fit_predict(X)

    plt.scatter(X[:, 1], X[:, 2], c=y_kmeans, cmap='viridis', alpha=0.3)
    plt.scatter(kmeans.cluster_centers_[:, 0], kmeans.cluster_centers_[:, 1],
                s=20, c='red', marker='X', label='Centroids')
    plt.legend()
    plt.title("K-Means Clustering using K=" + str(j))
    plt.show()

from sklearn.cluster import DBSCAN

for i in (min_max_random_sample, pwr_tran_data_sample):
  X = np.array(i)

  from sklearn.model_selection import ParameterGrid
  from sklearn.metrics import silhouette_score

  param_grid = {'eps': np.arange(0.01, 0.51, 0.1), 'min_samples': range(2, 10)}
  best_params = None
  best_score = -1

  for params in ParameterGrid(param_grid):
      dbscan = DBSCAN(eps=params['eps'], min_samples=params['min_samples'])
      labels = dbscan.fit_predict(X)

      if len(set(labels)) > 1:
          score = silhouette_score(X, labels)
          if score > best_score:
              best_score = score
              best_params = params

  print(f"Best params: {best_params} with silhouette score: {best_score}")

"""Best Paramters eps 0.41, min_samples 2 for min_max
eps 0.21, min_samples: 4 for pwr_transform
"""

from sklearn.cluster import KMeans
from sklearn.metrics import silhouette_score
import numpy as np

best_score = -1
best_k = None
scores = []
for i in (min_max_random_sample, pwr_tran_data_sample):
  X = np.array(i)
  for k in range(2, 10):
      kmeans = KMeans(n_clusters=k, random_state=23, n_init=10)
      labels = kmeans.fit_predict(X)
      score = silhouette_score(X, labels)
      scores.append(score)

      if score > best_score:
          best_score = score
          best_k = k

  print(f"Best k: {best_k} with silhouette score: {best_score}")

dbscan_mm = DBSCAN(eps=0.41, min_samples=2)
dbscan_min_max_labels = dbscan_mm.fit(min_max_random_sample)

dbscan_pt = DBSCAN(eps=0.21, min_samples=4)
dbscan_pwr_tran_labels = dbscan_mm.fit(pwr_tran_data_sample)

kmeans_mm = KMeans(n_clusters=3, random_state=23, n_init=10)
kmeans_min_max_labels = kmeans_mm.fit(min_max_random_sample)

kmeans_pt = KMeans(n_clusters=3, random_state=23, n_init=10)
kmeans_pwr_tran_labels = kmeans_pt.fit(pwr_tran_data_sample)

"""### Affinity Propagation"""

from sklearn.cluster import AffinityPropagation
from sklearn import metrics

affinity_labels_min_max = AffinityPropagation(damping=.99, random_state=23).fit(min_max_random_sample)
affinity_labels_pwr_tran = AffinityPropagation(damping=.99, random_state=23).fit(pwr_tran_data_sample)

print("Affinity Propagation Silhouette Score Min Max:", metrics.silhouette_score(min_max_random_sample, affinity_labels_min_max.labels_))
print("Affinity Propagation Silhouette Score Power Transformer:", metrics.silhouette_score(pwr_tran_data_sample, affinity_labels_pwr_tran.labels_))

"""# Density Peaks Clustering

"""

import numpy as np
import matplotlib.pyplot as plt
from sklearn.datasets import load_iris
from sklearn.metrics import pairwise_distances
from sklearn.preprocessing import StandardScaler

def density_peak_clustering_with_k(X, k=3, dc_percentile=2):
    # Step 1: Compute pairwise distances and cutoff distance d_c
    distances = pairwise_distances(X)
    dc = np.percentile(distances, dc_percentile)

    # Step 2: Compute local density (rho) using Gaussian kernel
    rho = np.sum(np.exp(- (distances / dc) ** 2), axis=1)

    # Step 3: Compute delta and record nearest higher-density neighbor
    N = len(X)
    delta = np.zeros(N)
    nneigh = np.zeros(N, dtype=int)

    for i in range(N):
        # Points that have strictly higher density
        mask_higher = rho > rho[i]
        if np.any(mask_higher):
            # Among those points, find the closest one
            dist_masked = distances[i, mask_higher]
            idx_masked = np.where(mask_higher)[0]
            min_idx = np.argmin(dist_masked)
            delta[i] = dist_masked[min_idx]
            nneigh[i] = idx_masked[min_idx]
        else:
            # If no point has higher density, i is a global maximum in density
            delta[i] = np.max(distances[i])
            nneigh[i] = i  # self-index, won't be used in assignment

    # Step 4: Pick the top k cluster centers by the largest (rho * delta)
    score = rho * delta
    cluster_centers = np.argsort(-score)[:k]  # top k

    # Step 5: Assign clusters
    clusters = -1 * np.ones(N, dtype=int)
    # Initialize each center with a unique cluster label
    for c_idx, c in enumerate(cluster_centers):
        clusters[c] = c_idx

    # Sort points in descending order of density
    sorted_indices = np.argsort(-rho)

    # Assign each point to the cluster of its nearest higher-density neighbor
    for i in sorted_indices:
        if clusters[i] == -1:
            clusters[i] = clusters[nneigh[i]]

    return clusters, cluster_centers, rho, delta, nneigh


def main(Dataset):
    # 2. Run DPC forcing exactly k=3 clusters
    X = np.array(Dataset)
    k = 3
    clusters, centers, rho, delta, nneigh = density_peak_clustering_with_k(
        X, k=k, dc_percentile=2
    )
    print(clusters)
    # 3. Plot the decision graph (optional)
    plt.figure(figsize=(6, 4))
    plt.scatter(rho, delta, s=50, edgecolor='k')
    plt.title(f"Decision Graph (k={k} chosen automatically)")
    plt.xlabel("Local Density (rho)")
    plt.ylabel("Distance to Higher Density (delta)")
    plt.grid(True)

    # Mark the chosen centers in the decision graph
    plt.scatter(
        rho[centers], delta[centers],
        s=200, c='red', edgecolor='k', marker='*', label='Chosen Centers'
    )

    plt.legend()
    plt.show()

    # 4. Plot the clusters in 2D (using the first two features for demonstration)
    markers = ['o', 's', '^', 'P', 'X', '*', 'D']
    colors  = ['r', 'g', 'b', 'purple', 'orange', 'cyan', 'magenta']

    plt.figure(figsize=(8, 5))
    for c_idx in np.unique(clusters):
        plt.scatter(
            X[clusters == c_idx, 0],
            X[clusters == c_idx, 1],
            marker=markers[c_idx % len(markers)],
            color=colors[c_idx % len(colors)],
            edgecolor='k',
            label=f'Cluster {c_idx + 1}'
        )

    # Mark centers on the 2D plot
    plt.scatter(
        X[centers, 0],
        X[centers, 1],
        s=200, c='yellow', marker='*', edgecolor='k',
        label='Centers'
    )

    plt.title(f"DPC with k={k} Clusters on Iris Dataset")
    plt.xlabel("Feature 1 (Standardized)")
    plt.ylabel("Feature 2 (Standardized)")
    plt.legend()
    plt.grid(True)
    plt.show()

    print(metrics.silhouette_score(X, clusters))
    return clusters

if __name__ == "__main__":
    clusters = main(min_max_random_sample)
    DPC_min_max_labels = clusters
    clusters2 = main(pwr_tran_data_sample)
    DPC_pwr_tran_labels = clusters2

"""# **Ensemble Method**"""

from scipy.stats import mode

min_max_cluster_labels = np.array([
    dbscan_min_max_labels.labels_,
    kmeans_min_max_labels.labels_,
    affinity_labels_min_max.labels_,
    DPC_min_max_labels
])

pwr_trn_cluster_labels = np.array([
    dbscan_pwr_tran_labels.labels_,
    kmeans_pwr_tran_labels.labels_,
    affinity_labels_pwr_tran.labels_
    ,DPC_pwr_tran_labels
])

def majority_voting(cluster_labels):
    final_labels = np.zeros(cluster_labels.shape[1])
    for i in range(cluster_labels.shape[1]):
        labels = cluster_labels[:, i]
        labels = labels[labels != -1]
        if len(labels) > 0:
            final_labels[i] = mode(labels, keepdims=True).mode[0]

        else:
            final_labels[i] = -1
    return final_labels

ensemble_labels_min_max = majority_voting(min_max_cluster_labels)
ensemble_labels_pwr_tran = majority_voting(pwr_trn_cluster_labels)

min_max_final = []
pwr_tran_final = []
for i in ensemble_labels_min_max:
  min_max_final.append(int(i))
for i in ensemble_labels_pwr_tran:
  pwr_tran_final.append(int(i))

import matplotlib.pyplot as plt
import seaborn as sns
import numpy as np


unique_labels, counts = np.unique(pwr_tran_final, return_counts=True)
plt.figure(figsize=(8, 5))
sns.barplot(x=unique_labels, y=counts, palette="viridis")
plt.xlabel("Cluster Labels")
plt.ylabel("Count")
plt.title("Cluster Distribution from Ensemble Method using Power Transformer")
plt.show()

unique_labels, counts = np.unique(min_max_final, return_counts=True)
plt.figure(figsize=(8, 5))
sns.barplot(x=unique_labels, y=counts, palette="viridis")
plt.xlabel("Cluster Labels")
plt.ylabel("Count")
plt.title("Cluster Distribution from Ensemble Method using Min_max Scalar")
plt.show()

"""# Highly Reliable Training Set"""

def Create_Training(cluster_labels):
    final_labels = np.zeros(cluster_labels.shape[1])
    for i in range(cluster_labels.shape[1]):
        labels = cluster_labels[:, i]
        labels = labels[labels != -1]
        if len(np.unique(labels)) <= 2:
            final_labels[i] = mode(labels, keepdims=True).mode[0]

        else:
            final_labels[i] = -1
    return final_labels

Min_max_train_labels = Create_Training(min_max_cluster_labels)
Pwr_Tran_train_labels = Create_Training(pwr_trn_cluster_labels)

print(np.unique(Min_max_train_labels, return_counts=True))
print(np.unique(Pwr_Tran_train_labels, return_counts=True))

min_max_random_sample_dummy = pd.DataFrame(min_max_random_sample)
pwr_tran_data_sample = np.array(pwr_tran_data_sample)

Min_max_train_labels

min_max_train_data = pd.DataFrame(min_max_random_sample_dummy)
min_max_train_data.columns = ['O7_O6_ratio','C6_C4_ratio',	'C6_C5_ratio',	'Fe_O_ratio',	'O_ave_charge',	'velocity',	'density']
min_max_train_data

min_max_train_data['Label'] = Min_max_train_labels
min_max_train_data.Label.unique()

min_max_train_data.reset_index(drop=True, inplace=True)

for i in range(len(min_max_train_data)):
  if min_max_train_data['Label'][i] == -1:
    min_max_train_data.drop(i, inplace=True)
min_max_train_data

pwr_tran_train_data = pd.DataFrame(pwr_tran_data_sample)
pwr_tran_train_data.columns = ['O7_O6_ratio','C6_C4_ratio',	'C6_C5_ratio',	'Fe_O_ratio',	'O_ave_charge',	'velocity',	'density']
pwr_tran_train_data

pwr_tran_train_data['Label'] = Pwr_Tran_train_labels
pwr_tran_train_data.Label.unique()

pwr_tran_train_data.reset_index(drop=True, inplace=True)

for i in range(len(pwr_tran_train_data)):
  if pwr_tran_train_data['Label'][i] == -1:
    pwr_tran_train_data.drop(i, inplace=True)
pwr_tran_train_data

pwr_tran_dataset_model = pd.DataFrame(pwr_tran_train_data)
pwr_tran_dataset_model.to_csv("pwrtrantrainset.csv", index=False)

pwr_tran_dataset_model = pd.DataFrame(pwr_tran_train_data)
pwr_tran_dataset_model.to_csv("pwrtrantrainset.csv", index=False)

min_max_dataset_model = pd.DataFrame(min_max_train_data)
min_max_dataset_model.to_csv("minmaxtrainset.csv", index=False)

"""# Neural Networks

"""

from keras.models import Sequential
from keras.layers import Dense, Dropout, LSTM, GRU, Flatten, Conv1D, Conv2D
from keras.layers import MaxPooling1D, MaxPooling2D
from sklearn.model_selection import train_test_split

min_max_x_train, min_max_x_test, min_max_y_train, min_max_y_test = train_test_split(min_max_train_data.drop('Label', axis=1), min_max_train_data['Label'], test_size=0.2, random_state=42)
pwr_tran_x_train, pwr_tran_x_test, pwr_tran_y_train, pwr_tran_y_test = train_test_split(pwr_tran_train_data.drop('Label', axis=1), pwr_tran_train_data['Label'], test_size=0.2, random_state=42)

"""### GRU"""

import tensorflow as tf
from tensorflow.keras.models import Sequential
from tensorflow.keras.layers import GRU, Dense, Dropout, Flatten


def GRUModel(n_features, loss_function, n_classes):
    model = Sequential()
    model.add(GRU(128, activation='tanh', return_sequences=True, input_shape=n_features))
    model.add(Dropout(0.2))

    model.add(GRU(64, activation='tanh'))
    model.add(Dropout(0.2))

    model.add(Dense(n_classes, activation='softmax'))

    model.compile(loss=loss_function, optimizer='adam', metrics=['accuracy'])
    return model

model = GRUModel((min_max_x_train.shape[1],1), loss_function='sparse_categorical_crossentropy', n_classes=2)
history = model.fit(min_max_x_train, min_max_y_train, epochs=25, batch_size=32, validation_split=0.2)

plt.figure(figsize=(12, 5))

plt.plot(history.history['loss'], label='Train Loss')
plt.plot(history.history['val_loss'], label='Val Loss')
plt.title('Model Loss')
plt.xlabel('Epoch')
plt.ylabel('Loss')
plt.legend()

plt.tight_layout()
plt.show()

from sklearn.metrics import confusion_matrix, ConfusionMatrixDisplay

y_pred_probs = model.predict(min_max_x_test)
y_pred = y_pred_probs.argmax(axis=1)

cm = confusion_matrix(min_max_y_test, y_pred)

disp = ConfusionMatrixDisplay(confusion_matrix=cm)
disp.plot(cmap=plt.cm.Blues)
plt.title("Confusion Matrix for Min Max Scalar")
plt.show()

model = GRUModel((pwr_tran_x_train.shape[1],1), loss_function='sparse_categorical_crossentropy', n_classes=3)
history = model.fit(pwr_tran_x_train, pwr_tran_y_train, epochs=25, batch_size=32, validation_split=0.2)

plt.figure(figsize=(12, 5))

plt.plot(history.history['loss'], label='Train Loss')
plt.plot(history.history['val_loss'], label='Val Loss')
plt.title('Model Loss')
plt.xlabel('Epoch')
plt.ylabel('Loss')
plt.legend()

plt.tight_layout()
plt.show()

from sklearn.metrics import confusion_matrix, ConfusionMatrixDisplay

y_pred_probs = model.predict(pwr_tran_x_test)
y_pred = y_pred_probs.argmax(axis=1)

cm = confusion_matrix(pwr_tran_y_test, y_pred)

disp = ConfusionMatrixDisplay(confusion_matrix=cm)
disp.plot(cmap=plt.cm.Blues)
plt.title("Confusion Matrix for PowerTransformer")
plt.show()

"""### DNN"""

def DNNModel(n_features, loss_function, n_classes):
  model = Sequential()
  model.add(Dense(128, activation='relu', input_shape=n_features))
  model.add(Dense(64, activation='relu'))

  model.add(Dropout(0.2))
  model.add(Flatten())

  model.add(Dense(n_classes, activation='softmax'))

  model.compile(loss=loss_function, optimizer='adam', metrics=['accuracy'])
  return model

model = DNNModel((min_max_x_train.shape[1],1), loss_function='sparse_categorical_crossentropy', n_classes=2)
history = model.fit(min_max_x_train, min_max_y_train, epochs=25, batch_size=32, validation_split=0.2)

plt.figure(figsize=(12, 5))

plt.plot(history.history['loss'], label='Train Loss')
plt.plot(history.history['val_loss'], label='Val Loss')
plt.title('Model Loss')
plt.xlabel('Epoch')
plt.ylabel('Loss')
plt.legend()

plt.tight_layout()
plt.show()

from sklearn.metrics import confusion_matrix, ConfusionMatrixDisplay

y_pred_probs = model.predict(min_max_x_test)
y_pred = y_pred_probs.argmax(axis=1)

cm = confusion_matrix(min_max_y_test, y_pred)

disp = ConfusionMatrixDisplay(confusion_matrix=cm)
disp.plot(cmap=plt.cm.Blues)
plt.title("Confusion Matrix for Min Max Scalar")
plt.show()

model = DNNModel((pwr_tran_x_train.shape[1],1), loss_function='sparse_categorical_crossentropy', n_classes=3)
history = model.fit(pwr_tran_x_train, pwr_tran_y_train, epochs=25, batch_size=32, validation_split=0.2)

plt.figure(figsize=(12, 5))

plt.plot(history.history['loss'], label='Train Loss')
plt.plot(history.history['val_loss'], label='Val Loss')
plt.title('Model Loss')
plt.xlabel('Epoch')
plt.ylabel('Loss')
plt.legend()

plt.tight_layout()
plt.show()

from sklearn.metrics import confusion_matrix, ConfusionMatrixDisplay

y_pred_probs = model.predict(pwr_tran_x_test)
y_pred = y_pred_probs.argmax(axis=1)

cm = confusion_matrix(pwr_tran_y_test, y_pred)

disp = ConfusionMatrixDisplay(confusion_matrix=cm)
disp.plot(cmap=plt.cm.Blues)
plt.title("Confusion Matrix for PowerTransformer")
plt.show()

"""### CNN"""

def CNNModel(n_features, loss_function, n_classes):
  model = Sequential()
  model.add(Dense(128, activation='relu', input_shape=n_features))
  model.add(Conv1D(64, 3, activation='relu'))
  model.add(Dense(32, activation='relu'))

  model.add(Dropout(0.2))
  model.add(Flatten())

  model.add(Dense(n_classes, activation='softmax'))

  model.compile(loss=loss_function, optimizer='adam', metrics=['accuracy'])
  return model

model = CNNModel((min_max_x_train.shape[1],1), loss_function='sparse_categorical_crossentropy', n_classes=2)
history = model.fit(min_max_x_train, min_max_y_train, epochs=25, batch_size=32, validation_split=0.2)

plt.figure(figsize=(12, 5))

plt.plot(history.history['loss'], label='Train Loss')
plt.plot(history.history['val_loss'], label='Val Loss')
plt.title('Model Loss')
plt.xlabel('Epoch')
plt.ylabel('Loss')
plt.legend()

plt.tight_layout()
plt.show()

y_pred_probs = model.predict(min_max_x_test)
y_pred = y_pred_probs.argmax(axis=1)

cm = confusion_matrix(min_max_y_test, y_pred)

disp = ConfusionMatrixDisplay(confusion_matrix=cm)
disp.plot(cmap=plt.cm.Blues)
plt.title("Confusion Matrix for Min Max Scalar")
plt.show()

model = CNNModel((pwr_tran_x_train.shape[1],1), loss_function='sparse_categorical_crossentropy', n_classes=3)
history = model.fit(pwr_tran_x_train, pwr_tran_y_train, epochs=25, batch_size=32, validation_split=0.2)

plt.figure(figsize=(12, 5))

plt.plot(history.history['loss'], label='Train Loss')
plt.plot(history.history['val_loss'], label='Val Loss')
plt.title('Model Loss')
plt.xlabel('Epoch')
plt.ylabel('Loss')
plt.legend()

plt.tight_layout()
plt.show()

y_pred_probs = model.predict(pwr_tran_x_test)
y_pred = y_pred_probs.argmax(axis=1)

cm = confusion_matrix(pwr_tran_y_test, y_pred)

disp = ConfusionMatrixDisplay(confusion_matrix=cm)
disp.plot(cmap=plt.cm.Blues)
plt.title("Confusion Matrix for Power Transformer Scalar")
plt.show()

"""### Consensus Neural Network - Min Max"""

def MinMaxModel(n_features, loss_function, n_classes):
    model = Sequential()
    model.add(GRU(256, activation='tanh', return_sequences=True, input_shape=n_features))
    model.add(Dropout(0.2))
    model.add(Dense(64, activation='tanh'))
    model.add(Flatten())
    model.add(Dense(n_classes, activation='softmax'))

    model.compile(loss=loss_function, optimizer='adam', metrics=['accuracy'])
    return model

min_max_model = MinMaxModel((min_max_x_train.shape[1],1), loss_function='sparse_categorical_crossentropy', n_classes=2)
history = min_max_model.fit(min_max_x_train, min_max_y_train, epochs=25, batch_size=32, validation_split=0.2)

y_pred_probs = min_max_model.predict(min_max_x_test)
y_pred = y_pred_probs.argmax(axis=1)

cm = confusion_matrix(min_max_y_test, y_pred)

disp = ConfusionMatrixDisplay(confusion_matrix=cm)
disp.plot(cmap=plt.cm.Blues)
plt.title("Confusion Matrix for Min Max Scalar")
plt.show()

plt.figure(figsize=(12, 5))

plt.plot(history.history['loss'], label='Train Loss')
plt.plot(history.history['val_loss'], label='Val Loss')
plt.title('Model Loss')
plt.xlabel('Epoch')
plt.ylabel('Loss')
plt.legend()

plt.tight_layout()
plt.show()

"""### Consensus Neural Network - Power Transformer"""

def PwrTranModel(n_features, loss_function, n_classes):
  model = Sequential()
  model.add(Dense(256, activation='relu', input_shape=n_features))
  model.add(Conv1D(128, 3, activation='relu'))
  model.add(Dropout(0.2))
  model.add(Dense(64, activation='relu'))
  model.add(Flatten())

  model.add(Dense(n_classes, activation='softmax'))

  model.compile(loss=loss_function, optimizer='adam', metrics=['accuracy'])
  return model

pt_model = PwrTranModel((pwr_tran_x_train.shape[1],1), loss_function='sparse_categorical_crossentropy', n_classes=3)
history = pt_model.fit(pwr_tran_x_train, pwr_tran_y_train, epochs=25, batch_size=32, validation_split=0.2)

y_pred_probs = pt_model.predict(pwr_tran_x_test)
y_pred = y_pred_probs.argmax(axis=1)

cm = confusion_matrix(pwr_tran_y_test, y_pred)

disp = ConfusionMatrixDisplay(confusion_matrix=cm)
disp.plot(cmap=plt.cm.Blues)
plt.title("Confusion Matrix for Power Transformer Scalar")
plt.show()

plt.figure(figsize=(12, 5))

plt.plot(history.history['loss'], label='Train Loss')
plt.plot(history.history['val_loss'], label='Val Loss')
plt.title('Model Loss')
plt.xlabel('Epoch')
plt.ylabel('Loss')
plt.legend()

plt.tight_layout()
plt.show()

"""# Widget"""

import ipywidgets as widgets
from IPython.display import display, clear_output

User_Input = []
User_Mode = []

#parameter names that line up with each slider
parameter_names = ['07_06_ratio', 'C6_C4_ratio', 'C6_C5_ratio', 'Fe_O_ratio', 'O_ave_charge', 'velocity', 'density']
out = widgets.Output()

button1 = widgets.Button(description="Simple Wind Classification", button_style='primary')
button2 = widgets.Button(description="Complex Wind Classification", button_style='success')

display_area = widgets.VBox()

def show_sliders(option_chosen):
      clear_output(wait=True)
      print(f"You selected {option_chosen}. Customize your parameters:")
      #These are the modifiable parameters, mean value is the value paramter on each slider, same with min and max
      slider1 = widgets.FloatSlider(description=f"{parameter_names[0]}", min=0.012432, max=2.588494, step=0.000001, value=0.192559, readout_format = '.6f')
      slider2 = widgets.FloatSlider(description=f"{parameter_names[1]}", min=0.149342, max=132.440323, step=0.000001, value=5.257230, readout_format = '.6f')
      slider3 = widgets.FloatSlider(description=f"{parameter_names[2]}", min=0.058647, max=12.090635, step=0.000001, value=0.594644, readout_format = '.6f')
      slider4 = widgets.FloatSlider(description=f"{parameter_names[3]}", min=0, max=8.980139, step=0.000001, value=0.167487, readout_format = '.6f')
      slider5 = widgets.FloatSlider(description=f"{parameter_names[4]}", min=5.907891, max=7.608771, step=0.000001, value=6.183532, readout_format = '.6f')
      slider6 = widgets.FloatSlider(description=f"{parameter_names[5]}", min=231.3, max=803.652, step=0.000001, value=427.132751, readout_format = '.6f')
      slider7 = widgets.FloatSlider(description=f"{parameter_names[6]}", min=0.959811, max=348.752, step=0.000001, value=24.397044, readout_format = '.6f')
      run_button = widgets.Button(description="Run", button_style='info')
      sliders = [slider1, slider2, slider3, slider4, slider5, slider6, slider7]

      def on_run_clicked(b):
          clear_output(wait=True)
          print(f"Settings from {option_chosen}:")
          for i, slider in enumerate(sliders):
              print(f"{parameter_names[i]}: {slider.value}")

              User_Input.append(slider.value)
          print(User_Input)

      run_button.on_click(on_run_clicked)
      display(widgets.VBox(sliders + [run_button]))

def on_button1_clicked(b):
    show_sliders("Simple Wind Classification")
    User_Mode.append('Min_max')
    print(User_Mode)

def on_button2_clicked(b):
    show_sliders("Complex Wind Classification")
    User_Mode.append('Pwr_Tran')
    print(User_Mode)

button1.on_click(on_button1_clicked)
button2.on_click(on_button2_clicked)
display(widgets.HBox([button1, button2]))

import warnings

print(User_Mode)
if User_Mode[0] == 'Min_max':
  User_Input = np.array(User_Input).reshape(1,-1)
  User_Input = minmax.transform(User_Input)
  print(User_Input)
  pred_probs = min_max_model.predict(User_Input)
  pred = pred_probs.argmax(axis=1)
  if pred == 0:
    print('Low Wind')
  else:
    warnings.filterwarnings("ignore")
    print('High Wind')

if User_Mode[0] == 'Pwr_Tran':
  User_Input = np.array(User_Input).reshape(1,-1)
  User_Input = power.transform(User_Input)
  pred_probs = pt_model.predict(User_Input)
  pred = pred_probs.argmax(axis=1)
  if pred == 0:
    print('Low Wind')
  elif pred == 1:
    print('High Wind')
  else:
    print('Transient Wind')
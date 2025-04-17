import os
import matplotlib.pyplot as plt
import seaborn as sns
from sklearn.metrics import confusion_matrix, ConfusionMatrixDisplay
import pandas as pd
import numpy as np
import argparse
import pickle

# Setup output directory
project_root = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..', '..'))
output_dir = os.path.join(project_root, 'public', 'graphs')
os.makedirs(output_dir, exist_ok=True)

STATE_FILE = "model_state.pkl"

def save_plot(filename):
    file_path = os.path.join(output_dir, filename)
    plt.savefig(file_path, bbox_inches='tight')
    plt.close()
    print(filename)

def load_state():
    if os.path.exists(STATE_FILE):
        with open(STATE_FILE, "rb") as f:
            return pickle.load(f)
    return {}

def save_state(state):
    with open(STATE_FILE, "wb") as f:
        pickle.dump(state, f)

def step1(state):
    pca_data = pd.DataFrame({
        'PC1': np.random.rand(20),
        'PC2': np.random.rand(20)
    })
    binary_labels = np.random.randint(0, 2, size=20)
    outliers = pd.DataFrame({
        'PC1': [0.9, 0.95],
        'PC2': [0.1, 0.15]
    })
    plt.figure()
    plt.scatter(pca_data['PC1'], pca_data['PC2'], c=binary_labels, cmap='coolwarm', s=60, alpha=0.6)
    plt.scatter(outliers['PC1'], outliers['PC2'], color='orange', edgecolor='black', s=100, label='Outlier', marker='X')
    plt.title('PCA of Drug Sensitivity Data')
    plt.xlabel('PC1')
    plt.ylabel('PC2')
    plt.legend()
    save_plot("PCA_Drug_Sensitivity.png")

def step2(state):
    embeddings = {
        't-SNE': np.random.rand(30, 2),
        'UMAP': np.random.rand(30, 2),
        'Other': np.random.rand(30, 2)
    }
    from sklearn.cluster import DBSCAN
    for key, embedding in embeddings.items():
        dbscan = DBSCAN(eps=3 if key == 't-SNE' else 0.25 if key == 'UMAP' else 0.01, min_samples=3)
        clusters = dbscan.fit_predict(embedding)
        plt.figure(figsize=(6, 4))
        sns.scatterplot(x=embedding[:, 0], y=embedding[:, 1], hue=clusters, palette="coolwarm", s=60)
        plt.title(f'DBSCAN for {key}')
        save_plot(f"DBSCAN_{key}.png")

def step3(state):
    phate_df = pd.DataFrame({
        'classID': np.random.choice([0, 1, 2], size=50),
        'PHATE1': np.random.rand(50),
        'PHATE2': np.random.rand(50)
    })
    plt.figure(figsize=(10, 6))
    for label in phate_df['classID'].unique():
        plt.scatter(phate_df[phate_df['classID'] == label]["PHATE1"],
                    phate_df[phate_df['classID'] == label]["PHATE2"],
                    marker='o', alpha=0.2, label=f'Class {label}')
    plt.title('PHATE of Patent Data')
    plt.xlabel('PHATE1')
    plt.ylabel('PHATE2')
    plt.legend()
    save_plot("PHATE_Patent_Data.png")

def step4(state):
    true_labels = np.random.randint(0, 3, size=15)
    pred_labels = np.random.randint(0, 3, size=15)
    cm = confusion_matrix(true_labels, pred_labels)
    disp = ConfusionMatrixDisplay(confusion_matrix=cm)
    disp.plot()
    save_plot("SVM_Confusion_Matrix.png")

def step5(state):
    plt.plot([1, 2, 3], [4, 5, 6])
    save_plot("test_plot.png")

def default_run(state):
    step1(state)
    step2(state)
    step3(state)
    step4(state)
    step5(state)

def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--step", default="", help="Which step to run, e.g. '1', '2', etc.")
    args = parser.parse_args()

    state = load_state()

    if args.step == "1":
        step1(state)
    elif args.step == "2":
        step2(state)
    elif args.step == "3":
        step3(state)
    elif args.step == "4":
        step4(state)
    elif args.step == "5":
        step5(state)
    else:
        default_run(state)

    save_state(state)

if __name__ == "__main__":
    main()

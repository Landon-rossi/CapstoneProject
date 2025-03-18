import os
import matplotlib.pyplot as plt
import seaborn as sns
from sklearn.metrics import confusion_matrix, ConfusionMatrixDisplay

# Define output directory to correctly point to the public/graphs folder
output_dir = os.path.join(os.getcwd(), "public", "graphs")
os.makedirs(output_dir, exist_ok=True)

def save_plot(filename):
    """ Helper function to save plots safely. """
    file_path = os.path.join(output_dir, filename)
    plt.savefig(file_path, bbox_inches='tight')
    plt.close()
    print(filename)  # Print filenames so the API can return them correctly

# Modified function to save PCA scatter plot
def plot_pca_scatter(pca_df, binary_labels, outliers):
    plt.scatter(pca_df['PC1'], pca_df['PC2'], c=binary_labels, cmap='coolwarm', s=60, alpha=0.6)
    plt.scatter(outliers['PC1'], outliers['PC2'], color='orange', edgecolor='black', s=100, label='Outlier', marker='X')
    plt.title('PCA of Drug Sensitivity Data')
    plt.xlabel('PC1')
    plt.ylabel('PC2')
    plt.legend()
    save_plot("PCA_Drug_Sensitivity.png")

# Modified function to save DBSCAN clustering plots
def apply_dbscan(embeddings):
    for key, embedding in embeddings.items():
        dbscan = DBSCAN(eps=3 if key == 't-SNE' else 0.25 if key == 'UMAP' else 0.01, min_samples=3)
        clusters = dbscan.fit_predict(embedding)
        plt.figure(figsize=(6, 4))
        sns.scatterplot(x=embedding[:, 0], y=embedding[:, 1], hue=clusters, palette="coolwarm", s=60)
        plt.title(f'DBSCAN for {key}')
        save_plot(f"DBSCAN_{key}.png")

# Modified function to save PHATE visualization
def visualize_phate(phate_df):
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

# Modified function to save confusion matrix
def visualize_cm(true, pred):
    cm = confusion_matrix(true, pred)
    disp = ConfusionMatrixDisplay(confusion_matrix=cm)
    disp.plot()
    save_plot("SVM_Confusion_Matrix.png")

# Sample test plot to verify the fix
plt.plot([1, 2, 3], [4, 5, 6])
save_plot("test_plot.png")

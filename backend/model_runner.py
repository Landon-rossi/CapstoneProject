import pandas as pd
import numpy as np
import tensorflow as tf
import keras
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import MinMaxScaler, PowerTransformer
import gradio as gr
import warnings

warnings.filterwarnings('ignore')

# ======== Load Data ========
SolarWindData = pd.read_csv('SO_ML_2022Jan_to_2023Apr.csv', skiprows=[0])
pwr_tran_train_data = pd.read_csv("pwrtrantrainset.csv")
min_max_train_data = pd.read_csv("minmaxtrainset.csv")

# ======== Clean Data ========
SolarWindData = SolarWindData[SolarWindData['O7_O6_ratio'] > 0]
SolarWindData = SolarWindData[np.isfinite(SolarWindData['velocity'])]
SolarWindData = SolarWindData.drop(['fractional_year'], axis=1).reset_index(drop=True)

# ======== Scalers ========
minmax = MinMaxScaler()
minmax.fit(SolarWindData)

power = PowerTransformer()
power.fit(SolarWindData)

# ======== Train-test split ========
min_max_x_train, _, min_max_y_train, _ = train_test_split(
    min_max_train_data.drop('Label', axis=1),
    min_max_train_data['Label'],
    test_size=0.2,
    random_state=42
)

pwr_tran_x_train, _, pwr_tran_y_train, _ = train_test_split(
    pwr_tran_train_data.drop('Label', axis=1),
    pwr_tran_train_data['Label'],
    test_size=0.2,
    random_state=42
)

# ======== Models ========
def MinMaxModel(n_features, loss_function, n_classes):
    model = keras.Sequential()
    model.add(keras.layers.GRU(256, activation='tanh', return_sequences=True, input_shape=n_features))
    model.add(keras.layers.Dropout(0.2))
    model.add(keras.layers.Dense(64, activation='tanh'))
    model.add(keras.layers.Flatten())
    model.add(keras.layers.Dense(n_classes, activation='softmax'))
    model.compile(loss=loss_function, optimizer='adam', metrics=['accuracy'])
    return model

def PwrTranModel(n_features, loss_function, n_classes):
    model = keras.Sequential()
    model.add(keras.layers.Dense(256, activation='relu', input_shape=n_features))
    model.add(keras.layers.Conv1D(128, 3, activation='relu'))
    model.add(keras.layers.Dropout(0.2))
    model.add(keras.layers.Dense(64, activation='relu'))
    model.add(keras.layers.Flatten())
    model.add(keras.layers.Dense(n_classes, activation='softmax'))
    model.compile(loss=loss_function, optimizer='adam', metrics=['accuracy'])
    return model

# ======== Train Models ========
min_max_model = MinMaxModel((min_max_x_train.shape[1], 1), 'sparse_categorical_crossentropy', 2)
min_max_model.fit(min_max_x_train, min_max_y_train, epochs=25, batch_size=32, validation_split=0.2, verbose=0)

pt_model = PwrTranModel((pwr_tran_x_train.shape[1], 1), 'sparse_categorical_crossentropy', 3)
pt_model.fit(pwr_tran_x_train, pwr_tran_y_train, epochs=25, batch_size=32, validation_split=0.2, verbose=0)


# Set your default values
default_values = {
    "mode": "Simple Wind Classification",
    "O7/O6 Ratio": 0.192559,
    "C6/C4 Ratio": 5.257230,
    "C6/C5 Ratio": 0.594644,
    "Fe/O Ratio": 0.167487,
    "Oxygen Avg Charge": 6.183532,
    "Velocity (km/s)": 427.132751,
    "Density (p/cm³)": 24.397044
}

# ======== Gradio Interface ========
def predict(mode, o7_o6, c6_c4, c6_c5, fe_o, o_charge, velocity, density):
    values = np.array([o7_o6, c6_c4, c6_c5, fe_o, o_charge, velocity, density]).reshape(1, -1)

    if mode == "Simple Wind Classification":
        scaled = minmax.transform(values)
        pred = min_max_model.predict(scaled.reshape(1, 7))
        label = pred.argmax(axis=1)[0]
        return "Low Wind" if label == 0 else "High Wind"

    elif mode == "Complex Wind Classification":
        scaled = power.transform(values)
        pred = pt_model.predict(scaled.reshape(1, 7))
        label = pred.argmax(axis=1)[0]
        return ["Low Wind", "High Wind", "Transient Wind"][label]

    return "Error"

gr.Interface(
    fn=predict,
    inputs=[
        gr.Dropdown(["Simple Wind Classification", "Complex Wind Classification"], value="Simple Wind Classification", label="Mode"),
        gr.Slider(0.012432, 2.588494, step=0.000001, value=0.192559, label="O7/O6 Ratio"),
        gr.Slider(0.149342, 132.440323, step=0.000001, value=5.257230, label="C6/C4 Ratio"),
        gr.Slider(0.058647, 12.090635, step=0.000001, value=0.594644, label="C6/C5 Ratio"),
        gr.Slider(0.0, 8.980139, step=0.000001, value=0.167487, label="Fe/O Ratio"),
        gr.Slider(5.907891, 7.608771, step=0.000001, value=6.183532, label="Oxygen Avg Charge"),
        gr.Slider(231.3, 803.652, step=0.000001, value=427.132751, label="Velocity (km/s)"),
        gr.Slider(0.959811, 348.752, step=0.000001, value=24.397044, label="Density (p/cm³)")
    ],
    outputs="text",
    title="Solar Wind Classifier"
).launch()


import pandas as pd
import numpy as np
import warnings
from keras.models import Sequential
from keras.layers import Dense, Dropout, LSTM, GRU, Flatten, Conv1D
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import MinMaxScaler, PowerTransformer

warnings.filterwarnings('ignore')

# ======== Load Datasets ==========
SolarWindData = pd.read_csv('SO_ML_2022Jan_to_2023Apr.csv')
pwr_tran_train_data = pd.read_csv('pwrtrantrainset.csv')
min_max_train_data = pd.read_csv('minmaxtrainset.csv')

# ======== Preprocessing ==========
SolarWindData = SolarWindData[SolarWindData['O7_O6_ratio'] > 0]
SolarWindData = SolarWindData[np.isfinite(SolarWindData['velocity'])]
SolarWindData = SolarWindData.drop(['fractional_year'], axis=1)
SolarWindData = SolarWindData.reset_index(drop=True)

# Scaling
minmax = MinMaxScaler()
minmax.fit(SolarWindData)

power = PowerTransformer()
power.fit(SolarWindData)

# ======== Train-test split ==========
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

# ======== Models ==========
def MinMaxModel(n_features, loss_function, n_classes):
    model = Sequential()
    model.add(GRU(256, activation='tanh', return_sequences=True, input_shape=n_features))
    model.add(Dropout(0.2))
    model.add(Dense(64, activation='tanh'))
    model.add(Flatten())
    model.add(Dense(n_classes, activation='softmax'))
    model.compile(loss=loss_function, optimizer='adam', metrics=['accuracy'])
    return model

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

min_max_model = MinMaxModel((min_max_x_train.shape[1],1), 'sparse_categorical_crossentropy', 2)
min_max_model.fit(min_max_x_train, min_max_y_train, epochs=25, batch_size=32, validation_split=0.2, verbose=0)

pt_model = PwrTranModel((pwr_tran_x_train.shape[1],1), 'sparse_categorical_crossentropy', 3)
pt_model.fit(pwr_tran_x_train, pwr_tran_y_train, epochs=25, batch_size=32, validation_split=0.2, verbose=0)

# ======== Prediction Function ==========
def run_model(mode_and_values):
    mode = mode_and_values[0]
    values = np.array(mode_and_values[1:]).reshape(1, -1)
    if mode == 'Simple Wind Classification':
        values_scaled = minmax.transform(values)
        pred = min_max_model.predict(values_scaled)
        label = pred.argmax(axis=1)[0]
        return 'Low Wind' if label == 0 else 'High Wind'
    else:
        values_scaled = power.transform(values)
        pred = pt_model.predict(values_scaled)
        label = pred.argmax(axis=1)[0]
        return ['Low Wind', 'High Wind', 'Transient Wind'][label]

import numpy as np
import pickle
import tensorflow as tf
from tensorflow.keras import metrics, losses
from tensorflow.keras.models import Sequential
from tensorflow.keras.layers import Dense, Embedding, GlobalAveragePooling1D
from tensorflow.keras.preprocessing.text import Tokenizer
from tensorflow.keras.preprocessing.sequence import pad_sequences
from sklearn.preprocessing import LabelEncoder
import datetime
import util.processing as processing

class ModelTraining():
    _data = None
    def __init__(self, data, epochs) :
        physical_devices = tf.config.list_physical_devices('GPU')
        for device in physical_devices: tf.config.experimental.set_memory_growth(device, True)
        self._data = data
        self.__training(epochs)

    def __training(self, epochs_value):
        training_sentences = []
        training_labels = []
        labels = []


        for question in self._data:            
            training_sentences.append(processing.process_input(question['question'])) 
            training_labels.append(question['id'])

            if question['id'] not in labels:
                labels.append(question['id'])

        num_classes = len(labels)

        lbl_encoder = LabelEncoder()
        lbl_encoder.fit(training_labels)
        training_labels = lbl_encoder.transform(training_labels)

        vocab_size = 1000
        embedding_dim = 128
        max_len = 20
        oov_token = "<OOV>"

        tokenizer = Tokenizer(num_words=vocab_size, oov_token=oov_token)
        tokenizer.fit_on_texts(training_sentences)
        # word_index = tokenizer.word_index
        sequences = tokenizer.texts_to_sequences(training_sentences)
        padded_sequences = pad_sequences(sequences, truncating='post', maxlen=max_len)

        model = Sequential()
        model.add(Embedding(vocab_size, embedding_dim, input_length=max_len))
        model.add(GlobalAveragePooling1D())
        model.add(Dense(32, activation='relu'))
        model.add(Dense(64, activation='relu'))
        model.add(Dense(32, activation='relu'))
        model.add(Dense(num_classes, activation='softmax'))
        print(model.summary())

        model.compile(loss=losses.SparseCategoricalCrossentropy(), 
                    optimizer=tf.keras.optimizers.Adam(0.00005),
                    metrics=[metrics.SparseCategoricalAccuracy()])

        # log_dir = "logs/fit/" + datetime.datetime.now().strftime("%Y%m%d-%H%M%S")
        # tensorboard_callback = tf.keras.callbacks.TensorBoard(log_dir=log_dir, histogram_freq=1)

        callback = tf.keras.callbacks.EarlyStopping(monitor='sparse_categorical_accuracy', patience=500)
        epochs = epochs_value
        history = model.fit(padded_sequences, np.array(training_labels), callbacks=[callback],
                            epochs=epochs, # validation_data=(padded_sequences, np.array(training_labels)), callbacks=[tensorboard_callback]
                            )

        model.save("./model/checkpoint/chat_model")

        with open('./model/checkpoint/tokenizer.pickle', 'wb') as handle:
            pickle.dump(tokenizer, handle, protocol=pickle.HIGHEST_PROTOCOL)
            
        with open('./model/checkpoint/label_encoder.pickle', 'wb') as ecn_file:
            pickle.dump(lbl_encoder, ecn_file, protocol=pickle.HIGHEST_PROTOCOL)
            
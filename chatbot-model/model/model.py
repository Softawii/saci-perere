import numpy as np
import pickle
import tensorflow as tf
from tensorflow import keras
from tensorflow.keras.models import Sequential
from tensorflow.keras.layers import Dense, Embedding, GlobalAveragePooling1D
from tensorflow.keras.preprocessing.text import Tokenizer
from tensorflow.keras.preprocessing.sequence import pad_sequences
from sklearn.preprocessing import LabelEncoder

class ModelTraining():
    _data = None
    def __init__(self, data, epochs) :
        self._data = data
        self.__training(epochs)

    def __training(self, epochs_value):
        training_sentences = []
        training_labels = []
        labels = []
        responses = []

        for question in self._data:
            training_sentences.append(question['question'])
            training_labels.append(question['id'])
            responses.append(question['answers'])

            if question['id'] not in labels:
                labels.append(question['id'])
        
        num_classes = len(labels)

        lbl_encoder = LabelEncoder()
        lbl_encoder.fit(training_labels)
        training_labels = lbl_encoder.transform(training_labels)

        vocab_size = 1000
        embedding_dim = 16
        max_len = 20
        oov_token = "<OOV>"

        tokenizer = Tokenizer(num_words=vocab_size, oov_token=oov_token)
        tokenizer.fit_on_texts(training_sentences)
        word_index = tokenizer.word_index
        sequences = tokenizer.texts_to_sequences(training_sentences)
        padded_sequences = pad_sequences(sequences, truncating='post', maxlen=max_len)

        model = Sequential()
        model.add(Embedding(vocab_size, embedding_dim, input_length=max_len))
        model.add(GlobalAveragePooling1D())
        model.add(Dense(16, activation='relu'))
        model.add(Dense(16, activation='relu'))
        model.add(Dense(num_classes, activation='softmax'))

        model.compile(loss='sparse_categorical_crossentropy', 
                    optimizer='adam', metrics=['accuracy'])

        epochs = epochs_value
        history = model.fit(padded_sequences, np.array(training_labels), epochs=epochs)

        model.save("./model/checkpoint/chat_model")

        with open('./model/checkpoint/tokenizer.pickle', 'wb') as handle:
            pickle.dump(tokenizer, handle, protocol=pickle.HIGHEST_PROTOCOL)
            
        with open('./model/checkpoint/label_encoder.pickle', 'wb') as ecn_file:
            pickle.dump(lbl_encoder, ecn_file, protocol=pickle.HIGHEST_PROTOCOL)
            
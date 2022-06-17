import numpy as np
import pickle
import tensorflow as tf
from tensorflow.keras import metrics, losses, Model
from tensorflow.keras.layers import Dense, Embedding, GlobalAveragePooling1D, Input, concatenate, Flatten
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
        word_mean_vec = []
        training_sentences = []
        training_labels = []
        labels = []


        for question in self._data:
            mean_vec = processing.word2vec_model.get_mean_vector(question['question'])
            training_sentences.append(processing.process_input(question['question']))
            training_labels.append(question['id'])

            if question['id'] not in labels:
                word_mean_vec.append(mean_vec)
                labels.append(question['id'])

        word_mean_vec = np.array(word_mean_vec)
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

        input_text = Input(shape=(max_len,), name='input_text')
        input_vec = Input(shape=(50,), name='input_vec')

        x = Embedding(vocab_size, embedding_dim, input_length=max_len)(input_text)
        x = GlobalAveragePooling1D()(x)
        x = Dense(32, activation='relu')(x)
        x = Dense(32, activation='relu')(x)
        x = Model(inputs=input_text, outputs=x)

        y = Dense(32, activation='relu')(input_vec)
        y = Dense(32, activation='relu')(y)
        y = Model(inputs=input_vec, outputs=y)

        z = concatenate([x.output, y.output])
        z = Dense(64, activation='relu')(z)
        z = Dense(num_classes, activation='softmax', name = 'labels')(z)

        model = Model(inputs=[x.input, y.input], outputs=z)
        # tf.keras.utils.plot_model(model, to_file='model.png', show_shapes=True)

        print(model.summary())

        model.compile(loss=losses.SparseCategoricalCrossentropy(), 
                    optimizer=tf.keras.optimizers.Adam(0.00005),
                    metrics=[metrics.SparseCategoricalAccuracy()])

        # log_dir = "logs/fit/" + datetime.datetime.now().strftime("%Y%m%d-%H%M%S")
        # tensorboard_callback = tf.keras.callbacks.TensorBoard(log_dir=log_dir, histogram_freq=1)

        callback = tf.keras.callbacks.EarlyStopping(monitor='sparse_categorical_accuracy', patience=500)
        history = model.fit({'input_text': padded_sequences, 'input_vec': word_mean_vec}, {'labels':training_labels},
                            callbacks=[callback], epochs=epochs_value,
                            # validation_data=(padded_sequences, np.array(training_labels)), callbacks=[tensorboard_callback]
                            )

        model.save("./model/checkpoint/chat_model")

        with open('./model/checkpoint/tokenizer.pickle', 'wb') as handle:
            pickle.dump(tokenizer, handle, protocol=pickle.HIGHEST_PROTOCOL)
            
        with open('./model/checkpoint/label_encoder.pickle', 'wb') as ecn_file:
            pickle.dump(lbl_encoder, ecn_file, protocol=pickle.HIGHEST_PROTOCOL)
            
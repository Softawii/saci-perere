import numpy as np
import pickle
import tensorflow as tf
from tensorflow import keras
import util.processing as processing

class Chat():
    _data = None
    _model = None
    _tokenizer = None
    _lbl_encoder = None
    _max_len = 20

    def __init__(self, data):
        physical_devices = tf.config.list_physical_devices('GPU')
        for device in physical_devices: tf.config.experimental.set_memory_growth(device, True)
        self._data = data
        self._model = keras.models.load_model('./model/checkpoint/chat_model')

        with open('./model/checkpoint/tokenizer.pickle', 'rb') as handle:
            self._tokenizer = pickle.load(handle)

        with open('./model/checkpoint/label_encoder.pickle', 'rb') as enc:
            self._lbl_encoder = pickle.load(enc)

    def make_question(self, question_raw):
        question = processing.process_input(question_raw)
        result = self._model.predict(keras.preprocessing.sequence.pad_sequences(self._tokenizer.texts_to_sequences([question]),
                                             truncating='post', maxlen=self._max_len))

        id = self._lbl_encoder.inverse_transform([np.argmax(result)])
        for q in self._data:
            if q['id'] == id:
                return {
                    "question_raw": question_raw,
                    "question_processed": question,
                    "question": q['question'],
                    "answer": np.random.choice(q['answers']),
                    "confidence": float(np.max(result))
                }

        return 'Algo de errado não está certo!'

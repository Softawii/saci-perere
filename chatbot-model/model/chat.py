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

    def init(data):
        physical_devices = tf.config.list_physical_devices('GPU')
        for device in physical_devices: tf.config.experimental.set_memory_growth(device, True)
        Chat._data = data
        Chat._model = keras.models.load_model('./model/checkpoint/chat_model')

        with open('./model/checkpoint/tokenizer.pickle', 'rb') as handle:
            Chat._tokenizer = pickle.load(handle)

        with open('./model/checkpoint/label_encoder.pickle', 'rb') as enc:
            Chat._lbl_encoder = pickle.load(enc)

    def make_question(question_raw):
        question = processing.process_input(question_raw)
        padded_sequences = keras.preprocessing.sequence.pad_sequences(Chat._tokenizer.texts_to_sequences([question]), truncating='post', maxlen=Chat._max_len)
        word_mean_vec = np.array([processing.word2vec_model.get_mean_vector(question)])
        result = Chat._model.predict([
            padded_sequences,
            word_mean_vec,
        ])

        id = Chat._lbl_encoder.inverse_transform([np.argmax(result)])
        for q in Chat._data:
            if q['id'] == id:
                return {
                    "question_raw": question_raw,
                    "question_processed": question,
                    "question": q['question'],
                    "answer": np.random.choice(q['answers']),
                    "confidence": float(np.max(result))
                }

        return 'Algo de errado não está certo!'

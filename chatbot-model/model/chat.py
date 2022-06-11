import numpy as np
import pickle
from tensorflow import keras
from sklearn.preprocessing import LabelEncoder

class Chat():
    _data = None
    _model = None
    _tokenizer = None
    _lbl_encoder = None
    _max_len = 20

    def __init__(self, data):
        self._data = data
        
        self._model = keras.models.load_model('chat_model')

        with open('tokenizer.pickle', 'rb') as handle:
            self._tokenizer = pickle.load(handle)

        with open('label_encoder.pickle', 'rb') as enc:
            self._lbl_encoder = pickle.load(enc)

    def chatting(self, msg):
        result = self._model.predict(keras.preprocessing.sequence.pad_sequences(self._tokenizer.texts_to_sequences([msg]),
                                             truncating='post', maxlen=self._max_len))
        id = self._lbl_encoder.inverse_transform([np.argmax(result)])
        for q in self._data:
            if q['id'] == id:
                return np.random.choice(q['answers'])

        return 'Algo de errado não está certo!'

import numpy as np
import pickle
import nltk
import string
from unidecode import unidecode
from nltk.corpus import stopwords
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
        self._stop_words = set(stopwords.words('portuguese'))
        self._model = keras.models.load_model('./model/checkpoint/chat_model')

        with open('./model/checkpoint/tokenizer.pickle', 'rb') as handle:
            self._tokenizer = pickle.load(handle)

        with open('./model/checkpoint/label_encoder.pickle', 'rb') as enc:
            self._lbl_encoder = pickle.load(enc)

    def __removingStopWords(self, phrase : str):
        tokens = nltk.word_tokenize(unidecode(phrase))
        return [token.lower() for token in tokens if token.lower() not in self._stop_words and token not in string.punctuation]

    def make_question(self, question):
        question = self.__removingStopWords(question)
        result = self._model.predict(keras.preprocessing.sequence.pad_sequences(self._tokenizer.texts_to_sequences([question]),
                                             truncating='post', maxlen=self._max_len))

        id = self._lbl_encoder.inverse_transform([np.argmax(result)])
        for q in self._data:
            if q['id'] == id:
                return {
                    "question": question,
                    "answer": np.random.choice(q['answers']),
                    "confidence": float(np.max(result))
                }

        return 'Algo de errado não está certo!'

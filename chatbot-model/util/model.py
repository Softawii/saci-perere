
from tensorflow.keras import Model
from tensorflow.keras.utils import plot_model
from tensorflow.keras.layers import Dense, Embedding, GlobalAveragePooling1D, Input, concatenate, Flatten
import util.processing as processing

class Model1:
    vocab_size = 1000
    embedding_dim = 128
    max_len = 20

    def get(num_classes, print_summary=True, plot=False) -> Model:
        input_text = Input(shape=(Model1.max_len,), name='input_text')
        input_vec = Input(shape=(processing.word2vec_dimension,), name='input_vec')

        x = Embedding(Model1.vocab_size, Model1.embedding_dim, input_length=Model1.max_len)(input_text)
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
        if plot: plot_model(model, to_file='model1.png', show_shapes=True)

        if print_summary: print(model.summary())
        return model

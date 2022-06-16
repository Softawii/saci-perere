from unidecode import unidecode
import spacy
import nltk

nlp = spacy.load("pt_core_news_md")
stemmer = nltk.stem.RSLPStemmer()

# lemmatize, remove stop words, ponctuation
def process_input(phrase: str) -> list:
    # nltk.download('punkt')
    # nltk.download('rslp')
    # nltk.download('wordnet')
    # nltk.download('omw-1.4')
    doc = nlp(phrase)
    tokens = [token.lemma_ for token in doc if (not token.is_stop and not token.is_punct)]
    tokens = [unidecode(token) for token in tokens]
    return [token.lower() for token in tokens]

def stemming(tokens: list):
    return [stemmer.stem(token) for token in tokens]

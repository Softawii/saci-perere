from sentence_transformers import SentenceTransformer, util

class SingletonMeta(type):
    _instances = {}
    def __call__(cls, *args, **kwargs):
        if cls not in cls._instances:
            instance = super().__call__(*args, **kwargs)
            cls._instances[cls] = instance
        return cls._instances[cls]

class Distiluse_Base_Multilingual_Cased_v2(metaclass=SingletonMeta):
    def __init__(self):
        model_name = 'sentence-transformers/distiluse-base-multilingual-cased-v2'
        print(f'\'{model_name}\': initializing')
        self.model = SentenceTransformer(model_name)
        print(f'PyTorch device: {self.model.device}')
        print(f'\'{model_name}\': initialized')

    async def compare(self, q1, q2): 
        embeddings_0 = self.model.encode(q1, convert_to_tensor=True)
        embeddings_1 = self.model.encode(q2, convert_to_tensor=True)
        score = util.pytorch_cos_sim(embeddings_0, embeddings_1)

        return {
            "question_1": q1,
            "question_2": q2,
            "score": score
        }

    async def batch_compare(self, question, questions, top_k=3): 
        question_embeddings = self.model.encode(question, convert_to_tensor=True)
        questions_embeddings = self.model.encode(questions, convert_to_tensor=True)
        hits = util.semantic_search(question_embeddings, questions_embeddings, top_k=top_k)
        hits = hits[0]

        hits = list(map(
            lambda hit: {
                'score': hit['score'],
                'id': hit['corpus_id'],
                'question': questions[hit['corpus_id']],
            }, hits))

        best_score = hits[0]
        question_id = best_score['id']
        answer_score = best_score['score']

        return {
            "user_question": question,
            "question": questions[question_id],
            "question_id": question_id,
            "score": answer_score,
            "hits": hits,
        }

from pydantic import BaseModel

class User_Question(BaseModel):
    question: str
    category: int

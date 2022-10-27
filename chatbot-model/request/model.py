from pydantic import BaseModel

class User_Question(BaseModel):
    question: str
    platform: str
    category: int

class Feedback(BaseModel):
    history: int
    status: bool
    user_feedback: str

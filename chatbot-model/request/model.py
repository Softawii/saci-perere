from pydantic import BaseModel
from typing import Union

class User_Question(BaseModel):
    question: str
    platform: str
    category: int

class Feedback(BaseModel):
    history: int
    status: int
    user_feedback: Union[str, None]

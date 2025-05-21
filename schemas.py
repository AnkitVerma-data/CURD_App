from pydantic import BaseModel, EmailStr
from typing import Optional

class CustomerCreate(BaseModel):
    first_name: str
    last_name: str
    email: EmailStr
    phone: Optional[str] = None
    age: Optional[int] = None
    company: str
    position: str
    salary: Optional[float] = None
    years_employed: Optional[int] = None

class Customer(CustomerCreate):
    id: int

    class Config:
        orm_mode = True

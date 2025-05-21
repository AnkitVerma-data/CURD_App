from sqlalchemy import Column, Integer, String, Float
from database import Base

class Customer(Base):
    __tablename__ = "customers"

    id = Column(Integer, primary_key=True, index=True)
    first_name = Column(String, index=True)
    last_name = Column(String, index=True)
    email = Column(String, unique=True, index=True)
    phone = Column(String, nullable=True)
    age = Column(Integer, nullable=True)
    company = Column(String)
    position = Column(String)
    salary = Column(Float, nullable=True)
    years_employed = Column(Integer, nullable=True)

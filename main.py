from fastapi import FastAPI, Request, Depends, Form, HTTPException
from fastapi.responses import HTMLResponse, JSONResponse
from fastapi.staticfiles import StaticFiles
from fastapi.templating import Jinja2Templates
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
import crud, models, schemas
from database import SessionLocal, engine

models.Base.metadata.create_all(bind=engine)

app = FastAPI(title="Customer Management System")

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.mount("/static", StaticFiles(directory="static"), name="static")
templates = Jinja2Templates(directory="templates")

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@app.get("/", response_class=HTMLResponse)
def home(request: Request):
    return templates.TemplateResponse("index.html", {"request": request})

@app.post("/register")
def register_customer(
    first_name: str = Form(...),
    last_name: str = Form(...),
    email: str = Form(...),
    phone: str = Form(None),
    age: int = Form(None),
    company: str = Form(...),
    position: str = Form(...),
    salary: float = Form(None),
    years_employed: int = Form(None),
    db: Session = Depends(get_db)
):
    customer_data = schemas.CustomerCreate(
        first_name=first_name,
        last_name=last_name,
        email=email,
        phone=phone,
        age=age,
        company=company,
        position=position,
        salary=salary,
        years_employed=years_employed,
    )
    return crud.create_customer(db, customer_data)

@app.get("/customers")
def read_customers(db: Session = Depends(get_db)):
    return crud.get_customers(db)

@app.delete("/customers/{customer_id}")
def delete_customer(customer_id: int, db: Session = Depends(get_db)):
    crud.delete_customer(db, customer_id)
    return {"message": "Customer deleted successfully"}

@app.get("/customers/{customer_id}")
def get_customer(customer_id: int, db: Session = Depends(get_db)):
    customer = crud.get_customer(db, customer_id)
    if not customer:
        raise HTTPException(status_code=404, detail="Customer not found")
    return customer

@app.put("/customers/{customer_id}")
def update_customer(
    customer_id: int,
    first_name: str = Form(...),
    last_name: str = Form(...),
    email: str = Form(...),
    phone: str = Form(None),
    age: int = Form(None),
    company: str = Form(...),
    position: str = Form(...),
    salary: float = Form(None),
    years_employed: int = Form(None),
    db: Session = Depends(get_db)
):
    # Check if customer exists
    existing_customer = crud.get_customer(db, customer_id)
    if not existing_customer:
        raise HTTPException(status_code=404, detail="Customer not found")
    
    # Create update data
    customer_data = schemas.CustomerCreate(
        first_name=first_name,
        last_name=last_name,
        email=email,
        phone=phone,
        age=age,
        company=company,
        position=position,
        salary=salary,
        years_employed=years_employed,
    )
    
    # Update customer
    updated_customer = crud.update_customer(db, customer_id, customer_data)
    return updated_customer

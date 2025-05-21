# CURD_App

## Customer Management System
A modern web application for managing customer information using CRUD operations. Built with Python FastAPI and SQLite, this application provides a clean, responsive interface for managing customer data.

## 🚀 Features

- 📝 Add new customers
- 📊 View all customers
- ✏️ Update customer information
- 🗑️ Delete customers
- 💻 Clean and responsive UI
- 📦 SQLite database integration

## 🚀 Running the Application

1. Ensure you have Python installed
2. Install the required dependencies:
   ```bash
   pip install -r requirements.txt
   ```
3. Run the application using uvicorn:
   ```bash
   uvicorn main:app --reload
   ```
4. Open your web browser and navigate to `http://localhost:8000`

## 📁 Project Structure

```
├── main.py              # Main application file
├── database.py         # Database connection and initialization
├── models.py           # Database models
├── schemas.py          # Data validation schemas
├── crud.py            # CRUD operations implementation
├── templates/          # HTML templates
├── static/             # CSS and JavaScript files
└── customers.db        # SQLite database file (auto-generated)
```

## 🛠️ Technologies Used

- Python 3.8+
- FastAPI 0.104.1
- SQLAlchemy 2.0.23
- Jinja2 3.1.2
- SQLite 3
- HTML5
- CSS3
- JavaScript
- Uvicorn 0.24.0 (ASGI server)

## 🤝 Contributing

Feel free to submit issues and enhancement requests!

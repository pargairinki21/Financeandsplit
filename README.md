# Personal Finance Tracker

A full-stack web application for managing personal finances with React + Vite frontend and FastAPI + PostgreSQL backend.

## 🚀 Features

- **User Authentication**: Secure JWT-based signup and login
- **Transaction Management**: Add, edit, delete income and expense transactions
- **Interactive Dashboard**: Visual charts showing monthly spending and category breakdowns
- **Real-time Analytics**: Monthly overview and expense category analysis
- **Responsive Design**: Modern UI with Tailwind CSS
- **Dockerized**: Complete setup with Docker Compose

## 🏗️ Tech Stack

### Frontend
- **React 18** with Hooks
- **Vite** for fast development
- **React Router** for navigation
- **Axios** for API calls
- **Chart.js** with React-ChartJS-2 for data visualization
- **Tailwind CSS** for styling

### Backend
- **FastAPI** with Python 3.11
- **SQLAlchemy** ORM with PostgreSQL
- **Alembic** for database migrations
- **JWT Authentication** with python-jose
- **Pydantic** for data validation
- **Uvicorn** ASGI server

### Database
- **PostgreSQL 15**
- Automated migrations with Alembic

### DevOps
- **Docker** & **Docker Compose**
- Multi-stage builds
- Health checks
- Volume persistence

## 📋 Prerequisites

- Docker and Docker Compose installed
- Git (for cloning)

## 🚀 Quick Start

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd my-project
   ```

2. **Start the application**
   ```bash
   docker-compose up --build
   ```

3. **Access the application**
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:8000
   - API Documentation: http://localhost:8000/docs

## 📁 Project Structure

```
my-project/
├── backend/                 # FastAPI backend
│   ├── routes/             # API route handlers
│   │   ├── __init__.py
│   │   ├── auth.py         # Authentication routes
│   │   └── transactions.py # Transaction CRUD routes
│   ├── alembic/            # Database migrations
│   │   ├── env.py
│   │   └── script.py.mako
│   ├── main.py             # FastAPI app entry point
│   ├── models.py           # SQLAlchemy models
│   ├── schemas.py          # Pydantic schemas
│   ├── database.py         # Database connection
│   ├── auth.py             # JWT authentication logic
│   ├── requirements.txt    # Python dependencies
│   ├── alembic.ini         # Alembic configuration
│   ├── Dockerfile          # Backend Docker image
│   └── .env                # Environment variables
│
├── frontend/               # React + Vite frontend
│   ├── src/
│   │   ├── components/     # Reusable components
│   │   │   └── Navbar.jsx
│   │   ├── contexts/       # React contexts
│   │   │   └── AuthContext.jsx
│   │   ├── pages/          # Page components
│   │   │   ├── Login.jsx
│   │   │   ├── Dashboard.jsx
│   │   │   └── Transactions.jsx
│   │   ├── App.jsx         # Main app component
│   │   ├── main.jsx        # React entry point
│   │   └── index.css       # Global styles
│   ├── index.html          # HTML template
│   ├── package.json        # Node.js dependencies
│   ├── vite.config.js      # Vite configuration
│   ├── tailwind.config.js  # Tailwind configuration
│   ├── postcss.config.js   # PostCSS configuration
│   └── Dockerfile          # Frontend Docker image
│
├── docker-compose.yml      # Multi-service orchestration
└── README.md              # This file
```

## 🔧 Development Setup

### Running without Docker

#### Backend Setup
```bash
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt

# Set up environment variables
cp .env.example .env
# Edit .env with your database credentials

# Run database migrations
alembic upgrade head

# Start the server
uvicorn main:app --reload
```

#### Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

#### Database Setup
```bash
# Install PostgreSQL locally or use Docker
docker run --name postgres-finance -e POSTGRES_DB=finance_db -e POSTGRES_USER=user -e POSTGRES_PASSWORD=password -p 5432:5432 -d postgres:15
```

## 📊 API Endpoints

### Authentication
- `POST /auth/signup` - Create new user account
- `POST /auth/login` - User login (returns JWT token)

### Transactions
- `GET /transactions/` - Get user's transactions (paginated)
- `POST /transactions/` - Create new transaction
- `GET /transactions/{id}` - Get specific transaction
- `PUT /transactions/{id}` - Update transaction
- `DELETE /transactions/{id}` - Delete transaction

### Analytics
- `GET /transactions/analytics/monthly` - Monthly income/expense data
- `GET /transactions/analytics/categories` - Category breakdown

### Health Check
- `GET /health` - API health status

## 🔒 Authentication

The application uses JWT (JSON Web Tokens) for authentication:

1. Users sign up with email, username, and password
2. Login returns an access token valid for 30 minutes
3. Token must be included in Authorization header: `Bearer <token>`
4. Frontend automatically handles token storage and API requests

## 🎨 Frontend Features

### Dashboard
- **Summary Cards**: Total income, expenses, and balance
- **Monthly Chart**: Bar chart showing income vs expenses by month
- **Category Breakdown**: Doughnut chart of expense categories
- **Recent Transactions**: Latest 5 transactions table

### Transactions Page
- **Transaction List**: Sortable table with all transactions
- **Add/Edit Form**: Modal form for creating and updating transactions
- **Delete Functionality**: Confirm before deletion
- **Transaction Types**: Income and Expense categorization

### Authentication Flow
- **Login/Signup**: Toggle between forms
- **Protected Routes**: Automatic redirect to login if not authenticated
- **Logout**: Clear token and redirect

## 🐳 Docker Configuration

### Services
- **db**: PostgreSQL database with health checks
- **backend**: FastAPI application with auto-reload
- **frontend**: Vite development server with hot reload

### Volumes
- `postgres_data`: Persistent database storage
- Source code volumes for development hot-reload

### Environment Variables
- `DATABASE_URL`: PostgreSQL connection string
- `SECRET_KEY`: JWT signing key (change in production!)

## 🔧 Configuration

### Backend Environment Variables (.env)
```env
DATABASE_URL=postgresql://user:password@db:5432/finance_db
SECRET_KEY=your-super-secret-key-change-this-in-production
```

### Frontend Configuration
- API base URL configured in `AuthContext.jsx`
- Vite dev server configured for Docker networking
- Tailwind CSS for responsive design

## 🚀 Production Deployment

### Security Considerations
1. **Change SECRET_KEY**: Use a strong, unique secret key
2. **Environment Variables**: Use proper secret management
3. **HTTPS**: Enable SSL/TLS in production
4. **Database**: Use managed PostgreSQL service
5. **CORS**: Restrict allowed origins

### Build for Production
```bash
# Backend
cd backend
pip install -r requirements.txt
alembic upgrade head
uvicorn main:app --host 0.0.0.0 --port 8000

# Frontend
cd frontend
npm install
npm run build
npm run preview
```

## 🧪 Testing

### Backend Testing
```bash
cd backend
pip install pytest pytest-asyncio httpx
pytest
```

### Frontend Testing
```bash
cd frontend
npm install
npm test
```

## 📝 Database Schema

### Users Table
- `id`: Primary key
- `email`: Unique email address
- `username`: Unique username
- `hashed_password`: Bcrypt hashed password
- `created_at`: Account creation timestamp

### Transactions Table
- `id`: Primary key
- `amount`: Transaction amount (decimal)
- `category`: Transaction category (string)
- `type`: Income or Expense (enum)
- `description`: Optional description
- `date`: Transaction date
- `user_id`: Foreign key to users table

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Troubleshooting

### Common Issues

**Database Connection Error**
```bash
# Check if PostgreSQL is running
docker-compose ps
# Restart services
docker-compose restart db backend
```

**Frontend Not Loading**
```bash
# Check if all services are up
docker-compose logs frontend
# Rebuild if needed
docker-compose up --build frontend
```

**Port Already in Use**
```bash
# Kill processes on ports
sudo lsof -ti:5173 | xargs kill -9
sudo lsof -ti:8000 | xargs kill -9
```

**Migration Issues**
```bash
# Reset database (WARNING: destroys data)
docker-compose down -v
docker-compose up --build
```

## 📞 Support

For issues and questions:
1. Check the troubleshooting section
2. Review Docker logs: `docker-compose logs [service-name]`
3. Open an issue on GitHub

---

**Happy coding! 🎉**

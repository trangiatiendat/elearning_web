# E-Learning Web Platform

A modern and comprehensive e-learning platform built with cutting-edge technologies to provide an engaging and interactive learning experience.

## 🚀 Features

- **User Authentication & Authorization**

  - Secure login and registration system
  - Role-based access control (Student, Teacher, Admin)
  - Face recognition authentication

- **Course Management**

  - Create and manage courses
  - Upload and organize learning materials
  - Track student progress
  - Interactive quizzes and assignments

- **Interactive Learning**

  - Real-time video lectures
  - Discussion forums
  - Progress tracking
  - Interactive assessments

- **User Dashboard**
  - Personalized learning paths
  - Course progress tracking
  - Achievement system
  - Learning analytics

## 🛠️ Technology Stack

### Frontend

- React with TypeScript
- Vite for build tooling
- Tailwind CSS for styling
- Modern UI/UX design principles

### Backend

- Node.js with TypeScript
- RESTful API architecture
- Secure file handling
- Database integration

### Face Service

- Advanced face recognition
- Secure authentication system
- Real-time processing

## 📦 Installation

1. Clone the repository:

```bash
git clone [repository-url]
```

2. Install dependencies for client:

```bash
cd client
npm install
```

3. Install dependencies for server:

```bash
cd server
npm install
```

4. Set up environment variables:

- Create `.env` files in both client and server directories
- Configure necessary environment variables

5. Start the development servers:

```bash
# Start client
cd client
npm run dev

# Start server
cd server
npm run dev
```

## 🔧 Configuration

The project requires the following environment variables:

### Client (.env)

```
VITE_API_URL=http://localhost:3000
```

### Server (.env)

```
PORT=3000
DATABASE_URL=your_database_url
JWT_SECRET=your_jwt_secret
```

## 📁 Project Structure

```
elearning_web/
├── client/                 # Frontend application
│   ├── src/               # Source files
│   ├── public/            # Static files
│   └── package.json       # Frontend dependencies
├── server/                # Backend application
│   ├── src/              # Source files
│   ├── uploads/          # File uploads directory
│   └── package.json      # Backend dependencies
└── face_service/         # Face recognition service
```

## 🚀 Getting Started

1. Ensure you have Node.js installed (v14 or higher)
2. Install all dependencies
3. Set up your environment variables
4. Start both client and server applications
5. Access the application at `http://localhost:5173`

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 👥 Authors

- Trần Gia Tiến Đạt


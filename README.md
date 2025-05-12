# Inventory Management System

A modern, full-stack inventory management application built with Next.js, Node.js, and PostgreSQL.

## 🚀 Features

- **Product Management**
  - Track product inventory levels
  - Bulk update capabilities
  - Low stock alerts
  - Product categorization

- **User Management**
  - Role-based access control (Admin, Manager, User)
  - Secure authentication
  - User activity tracking

- **Dashboard & Analytics**
  - Real-time inventory metrics
  - Sales analytics
  - Custom reports generation
  - Data visualization

- **Modern UI/UX**
  - Dark/Light mode support
  - Responsive design
  - Interactive notifications
  - Multi-language support (coming soon)

## 🛠 Tech Stack

### Frontend
- Next.js 14
- React
- TypeScript
- TailwindCSS
- Redux Toolkit
- Lucide Icons

### Backend
- Node.js
- Express
- Prisma ORM
- PostgreSQL
- JWT Authentication

## 🚀 Getting Started

### Prerequisites

- Node.js 18 or higher
- PostgreSQL 14 or higher
- npm or yarn

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/ebrahimbeiati/inventory-management.git
   cd inventory-management
   ```

2. Install dependencies:
   ```bash
   # Install client dependencies
   cd client
   npm install

   # Install server dependencies
   cd ../server
   npm install
   ```

3. Set up environment variables:
   ```bash
   # In client directory
   cp .env.example .env.local

   # In server directory
   cp .env.example .env
   ```

4. Set up the database:
   ```bash
   cd server
   npx prisma migrate dev
   ```

5. Start the development servers:
   ```bash
   # Start the client (from client directory)
   npm run dev

   # Start the server (from server directory)
   npm run dev
   ```

## 🔐 Environment Variables

### Client (.env.local)
```env
NEXT_PUBLIC_API_URL=http://localhost:3001
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### Server (.env)
```env
DATABASE_URL="postgresql://user:password@localhost:5432/inventory_db"
JWT_SECRET=your_jwt_secret
PORT=3001
```

## 🧪 Testing

```bash
# Run client tests
cd client
npm test

# Run server tests
cd server
npm test
```

## 📦 Deployment

The application can be deployed using Docker:

```bash
# Build and run with Docker Compose
docker-compose up --build
```

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👥 Authors

- **Ebrahim Beiati** - *Initial work* - [ebrahimbeiati](https://github.com/ebrahimbeiati)

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/)
- [TailwindCSS](https://tailwindcss.com/)
- [Prisma](https://www.prisma.io/)
- [Lucide Icons](https://lucide.dev/)
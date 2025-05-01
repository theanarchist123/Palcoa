# Bayleaf Salon - Your Premium Beauty Destination 💅✨

https://drive.google.com/file/d/15hRhCVDy-FwQFHg4qfbulkTPzkreX3yM/view?usp=sharing

A modern, full-stack salon management system built with Node.js, Express, and MongoDB. Bayleaf Salon offers a seamless experience for both customers and salon administrators.

## ✨ Features

### 🎨 Customer Features
- **User Authentication** - Secure login and registration system
- **Service Browsing** - Explore our wide range of beauty services
- **Online Booking** - Easy appointment scheduling system
- **Profile Management** - Manage your personal information and appointments 
- **Real-time Notifications** - Stay updated with appointment status
- **Payment Integration** - Secure payment processing with Razorpay
- **Service Portfolio** - Browse through our work gallery
- **Special Offers** - Access to exclusive discounts and promotions

### 👩‍💼 Admin Features
- **Appointment Management** - Accept/decline appointment requests
- **Customer Management** - View and manage customer profiles
- **Service Management** - Update service offerings and prices
- **Real-time Dashboard** - Monitor salon operations
- **Email Notifications** - Automated emails for booking confirmations
- **Payment Tracking** - Monitor and manage payments

## 🚀 Tech Stack

- **Frontend**: HTML5, CSS3, JavaScript
- **Backend**: Node.js, Express.js
- **Database**: MongoDB
- **Authentication**: Session-based Authentication
- **Payment Gateway**: Razorpay
- **Email Service**: Nodemailer
- **Version Control**: Git

## 💻 Prerequisites

Before running this application, make sure you have the following installed:
- Node.js (v14 or higher)
- MongoDB
- Git

## 🛠️ Installation & Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/salon-main.git
   cd salon-main/Palcoa
   ```

2. **Install dependencies**
   ```bash
   # Install backend dependencies
   cd backend
   npm install

   # Install frontend dependencies
   cd ../frontend
   npm install
   ```

3. **Environment Setup**
   Create a `.env` file in the backend directory with the following variables:
   ```env
   PORT=3000
   MONGODB_URI=your_mongodb_connection_string
   RAZORPAY_KEY_ID=your_razorpay_key_id
   RAZORPAY_KEY_SECRET=your_razorpay_secret
   EMAIL_USER=your_email
   EMAIL_PASS=your_email_password
   ```

4. **Start the Application**
   ```bash
   # Start backend server
   cd backend
   npm start

   # In a new terminal, start frontend
   cd frontend
   npm start
   ```

5. **Access the Application**
   Open your browser and navigate to:
   ```
   http://localhost:3000
   ```

## 📱 Application Structure

```
salon-main/
├── backend/
│   ├── config/         # Configuration files
│   ├── controllers/    # Request handlers
│   ├── models/         # Database models
│   ├── routes/         # API routes
│   └── utils/          # Utility functions
├── frontend/
│   ├── pages/          # Frontend pages
│   ├── styles/         # CSS files
│   └── js/            # JavaScript files
└── README.md
```

## 🔐 API Endpoints

### Auth Routes
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/logout` - User logout

### Appointment Routes
- `POST /api/appointments` - Create appointment
- `GET /api/appointments` - Get all appointments
- `PUT /api/appointments/:id` - Update appointment
- `DELETE /api/appointments/:id` - Cancel appointment

### Admin Routes
- `GET /api/admin-requests` - Get all booking requests
- `POST /api/admin-requests/:id/accept` - Accept booking
- `POST /api/admin-requests/:id/decline` - Decline booking

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📜 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 👥 Team
- Nikhil Kadam - Developer
- Ved Joshi - Developer
- Aarya Thorat - Developer
- Chinmay Ambre - Developer

## 📞 Contact

For any queries, please reach out to:
- Email: 2023.nikhil.kadam@ves.ac.in
- Phone: 7021623887
- Address: Rajhans wada, Nr. St Joseph Church, Ganesh Nagar, Dombivali (West) - 421202

---
Made with ❤️ by Bayleaf Salon Team

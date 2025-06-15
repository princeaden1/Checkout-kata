# 🛒 Checkout System 

An enterprise-grade checkout system with pricing rules and special offers, built with React (Frontend) and Java Spring Boot (Backend).

## 📋 Features

- ✅ **Dual Calculation Modes**: Switch between JavaScript (frontend) and Java (backend) calculations
- ✅ **Special Offers**: Automatic discount calculation (e.g., "3 for £1.30")
- ✅ **Real-time Updates**: Live total calculation as items are added/removed
- ✅ **Responsive Design**: Works on desktop, tablet, and mobile
- ✅ **Error Handling**: Graceful fallback if backend is unavailable
- ✅ **RESTful API**: Clean Spring Boot backend with proper validation

## 🚀 Getting Started

### Prerequisites

Make sure you have the following installed:

- **Java 17** or higher
- **Node.js 18** or higher
- **npm** or **yarn**
- **Maven** (or use the included Maven wrapper)

### 📦 Installation & Setup

#### 1. Clone the Repository
```bash
git clone <your-repository-url>
cd checkout-system
```

#### 2. Start the Backend (Java Spring Boot)

```bash
# Navigate to backend directory
cd backend

# Install dependencies and start the server
./mvnw spring-boot:run
```

**Expected Output:**
```
Started CheckoutSystemApplication in 2.5 seconds
Tomcat started on port(s): 8080
```

✅ **Backend is now running on:** `http://localhost:8080`

#### 3. Start the Frontend (React)

**Open a new terminal window/tab** and run:

```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Start the development server
npm run dev
```

**Expected Output:**
```
Local:   http://localhost:3000

```


### 🧪 Testing the Application

1. **Open your browser** and go to `http://localhost:3000`

2. **Test Frontend Calculation:**
   - Add some items to your cart (try 3 × Item A, 2 × Item B)
   - Ensure the dropdown shows "Javascript"
   - Verify calculations are working

3. **Test Backend Integration:**
   - Switch the dropdown to "Java"
   - The indicator should show "Java Spring Boot" with a green dot
   - Calculations should remain the same
   - If you see any red error messages, check that your backend is running

4. **Health Check:**
   - Visit `http://localhost:8080/api/checkout/health`
   - Should return: `"Calculation service is running!"`

## 🛠️ Development

### Backend Development

```bash
cd backend

# Run tests
./mvnw test

# Build JAR file
./mvnw clean package

# Run with different profile
./mvnw spring-boot:run -Dspring-boot.run.profiles=production
```

### Frontend Development

```bash
cd fron
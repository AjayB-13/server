
# Backend - Password Reset API (Node.js + Express + MongoDB)

##  Overview
This is the **backend** for the Password Reset App.  
It provides APIs for:
- **User registration**
- **Login**
- **Forgot password**
- **Reset password**

---

---

## Dependencies

express - Web server
mongoose - MongoDB ODM
dotenv - Environment variables
cors - Enable frontend-backend connection
bcryptjs - Password hashing
jsonwebtoken - (Optional) Auth tokens
nodemailer - Sending emails
crypto - Generating reset tokens
nodemon (dev) - Auto-restart server

---

## API Endpoints

Method	     Endpoint	               Description
POST	/api/auth/register	       Register user
POST	/api/auth/login   	       Login user
POST	/api/auth/forgot-password	Send reset link
POST	/api/auth/reset-password/:token	Reset password
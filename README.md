# React Native Todo App 

## Overview

This is a **Todo Mobile Application** built using **React Native Expo** for the frontend and **Node.js(Expressjs)** for the backend and  **MonogoDB** for Database  .  
The app demonstrates:

- User **Authentication** (Signup / Login)  
- **API Integration** for tasks  
- Navigation between **Dashboard** and **Profile**  
- Task **CRUD** operations (Create, Read, Update, Delete)  
- Mark tasks as **completed**  


---

## Tech Stack

**Frontend:**
- React Native using expo 
- React Navigation  
- Axios for API calls  
- AsyncStorage for token storage  

**Backend:**
- Node.js (Express)  
- MongoDB 
- JWT Authentication  

---
## video
  video link - https://drive.google.com/file/d/11wn7Pvm8H8ItEufoFxr3bJ30Cz1_5u96/view?usp=drivesdk

## App Screens

### 1. Login / Signup
First-time users must **sign up**, returning users must **login**.  

![Login Screen] (<img width="540" height="1200" alt="image" src="https://github.com/user-attachments/assets/e7cb34f4-9522-4081-bf15-2ef768ed8225" />
)  
![Signup Screen] (<img width="540" height="1200" alt="image" src="https://github.com/user-attachments/assets/685fd88f-6f1e-4396-8471-90f5b6d92af5" />)  

### 2. Dashboard
- Fetches and displays tasks via API  
- Users can create todos and mark them **completed**  
- Edit or delete existing tasks  

![Dashboard] (<img width="540" height="1200" alt="image" src="https://github.com/user-attachments/assets/c99e0a4a-58d1-45ee-aa3e-c5832896bcc1" />
)  
![Add Task] (<img width="540" height="1200" alt="image" src="https://github.com/user-attachments/assets/f0db75a0-171b-450d-bf0e-8ebb978b4dba" />
)  
![Edit Task] <img width="540" height="1200" alt="image" src="https://github.com/user-attachments/assets/086d3a0e-703e-46af-b91f-aa85899923b9" />


### 3. Profile
- Displays logged-in user profile details  
- User can logout  

![Profile Screen](![WhatsApp Image 2025-11-30 at 1 20 53 PM](https://github.com/user-attachments/assets/1e389eca-4436-430e-97b9-8372557cc702)
)  

---

## Features

- **Signup/Login** with JWT Authentication  
- **Persistent login** using AsyncStorage  
- **CRUD operations** for todos  
- **Mark as complete** and toggle tasks  
- **Navigation** between Dashboard and Profile  

---

## API Endpoints

**Base URL:** `http://your ip:3000/api`

**Example cURL Request:**

```bash
curl -X POST`http://your ip:3000/api/auth/signup \
-H "Content-Type: application/json" \
-d '{ "name":"example" "email":"user@example.com","password":"password123"}'

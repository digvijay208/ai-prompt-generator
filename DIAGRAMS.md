# AI Prompt Generator - Visual Diagrams

## 1. System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                        CLIENT SIDE                          │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ┌──────────────┐         ┌──────────────┐                │
│  │  login.html  │────────▶│  index.html  │                │
│  │   auth.js    │         │  script.js   │                │
│  └──────────────┘         └──────────────┘                │
│         │                        │                          │
│         │                        │                          │
│         │    JWT Token (localStorage)                      │
│         │                        │                          │
└─────────┼────────────────────────┼──────────────────────────┘
          │                        │
          │   HTTP Requests        │
          │   (JSON + JWT)         │
          ▼                        ▼
┌─────────────────────────────────────────────────────────────┐
│                       SERVER SIDE                           │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│                    ┌──────────────┐                        │
│                    │  server.js   │                        │
│                    │  (Express)   │                        │
│                    └──────┬───────┘                        │
│                           │                                 │
│              ┌────────────┼────────────┐                   │
│              │            │            │                   │
│              ▼            ▼            ▼                   │
│         ┌────────┐   ┌────────┐  ┌─────────┐             │
│         │  JWT   │   │ bcrypt │  │ Gemini  │             │
│         │  Auth  │   │  Hash  │  │   AI    │             │
│         └────────┘   └────────┘  └─────────┘             │
│                           │                                 │
└───────────────────────────┼─────────────────────────────────┘
                            │
                            ▼
                   ┌─────────────────┐
                   │    MongoDB      │
                   ├─────────────────┤
                   │  • users        │
                   │  • prompthistories │
                   └─────────────────┘
```

---

## 2. Authentication Flow

```
┌──────────┐
│  START   │
└────┬─────┘
     │
     ▼
┌─────────────────┐
│ User visits app │
└────┬────────────┘
     │
     ▼
┌──────────────────────┐
│ Check localStorage   │
│ for JWT token?       │
└────┬─────────────┬───┘
     │             │
   YES             NO
     │             │
     ▼             ▼
┌─────────┐   ┌──────────────┐
│ Go to   │   │ Show login/  │
│ index   │   │ register form│
└─────────┘   └──────┬───────┘
                     │
                     ▼
              ┌──────────────┐
              │ User submits │
              │ credentials  │
              └──────┬───────┘
                     │
                     ▼
              ┌──────────────────┐
              │ POST /api/login  │
              │ or /api/register │
              └──────┬───────────┘
                     │
                     ▼
         ┌───────────────────────┐
         │ Backend validates     │
         │ • Hash password       │
         │ • Check DB            │
         │ • Generate JWT        │
         └───────┬───────────────┘
                 │
        ┌────────┴────────┐
        │                 │
      SUCCESS           FAIL
        │                 │
        ▼                 ▼
┌───────────────┐   ┌──────────┐
│ Store token   │   │  Show    │
│ in localStorage│   │  error   │
└───────┬───────┘   └──────────┘
        │
        ▼
┌───────────────┐
│ Redirect to   │
│ index.html    │
└───────────────┘
```

---

## 3. Registration Process Detail

```
USER                    FRONTEND                  BACKEND                   DATABASE
 │                         │                         │                         │
 │  Enter email/password   │                         │                         │
 ├────────────────────────▶│                         │                         │
 │                         │                         │                         │
 │  Click "Sign Up"        │                         │                         │
 ├────────────────────────▶│                         │                         │
 │                         │                         │                         │
 │                         │  POST /api/register     │                         │
 │                         │  {email, password}      │                         │
 │                         ├────────────────────────▶│                         │
 │                         │                         │                         │
 │                         │                         │  bcrypt.hash(password)  │
 │                         │                         │  (10 rounds)            │
 │                         │                         │                         │
 │                         │                         │  Save user              │
 │                         │                         ├────────────────────────▶│
 │                         │                         │                         │
 │                         │                         │  User created           │
 │                         │                         │◀────────────────────────┤
 │                         │                         │                         │
 │                         │                         │  jwt.sign({userId})     │
 │                         │                         │  expires: 24h           │
 │                         │                         │                         │
 │                         │  {token: "eyJhbG..."}   │                         │
 │                         │◀────────────────────────┤                         │
 │                         │                         │                         │
 │                         │  localStorage.setItem   │                         │
 │                         │  ('token', token)       │                         │
 │                         │                         │                         │
 │  Redirect to index.html │                         │                         │
 │◀────────────────────────┤                         │                         │
 │                         │                         │                         │
```

---

## 4. Prompt Generation Flow

```
┌─────────────────┐
│ User fills form │
│ • Purpose       │
│ • Subject       │
│ • Details       │
│ • Tone          │
│ • Options       │
│ • Format        │
└────────┬────────┘
         │
         ▼
┌─────────────────────┐
│ Click "Generate"    │
└────────┬────────────┘
         │
         ▼
┌─────────────────────────────┐
│ validateForm()              │
│ Check: purpose AND          │
│ (subject OR details)        │
└────────┬────────────────────┘
         │
         ▼
┌─────────────────────────────┐
│ buildPrompt()               │
│ • Map purpose to phrase     │
│ • Add subject/details       │
│ • Add tone instruction      │
│ • Add optional features     │
│ • Add format instruction    │
│ • Combine all parts         │
└────────┬────────────────────┘
         │
         │ Initial Prompt
         ▼
┌─────────────────────────────┐
│ POST /api/refine-prompt     │
│ Headers: Bearer <token>     │
│ Body: {userPrompt}          │
└────────┬────────────────────┘
         │
         ▼
┌─────────────────────────────┐
│ Backend: verifyToken()      │
│ Extract userId from JWT     │
└────────┬────────────────────┘
         │
         ▼
┌─────────────────────────────┐
│ Initialize Gemini AI        │
│ model: gemini-1.5-pro-latest│
└────────┬────────────────────┘
         │
         ▼
┌─────────────────────────────┐
│ Create refinement prompt:   │
│ "You are an expert prompt   │
│ engineer. Refine..."        │
└────────┬────────────────────┘
         │
         ▼
┌─────────────────────────────┐
│ model.generateContent()     │
│ Call Gemini API             │
└────────┬────────────────────┘
         │
         │ Refined Prompt
         ▼
┌─────────────────────────────┐
│ Return to frontend          │
└────────┬────────────────────┘
         │
         ▼
┌─────────────────────────────┐
│ Display refined prompt      │
│ Enable copy button          │
└────────┬────────────────────┘
         │
         ▼
┌─────────────────────────────┐
│ saveToHistory()             │
│ POST /api/save-prompt       │
└────────┬────────────────────┘
         │
         ▼
┌─────────────────────────────┐
│ Update sidebar history      │
└─────────────────────────────┘
```

---

## 5. JWT Authentication Middleware

```
┌──────────────────────┐
│ API Request comes in │
└──────────┬───────────┘
           │
           ▼
┌────────────────────────────┐
│ verifyToken() middleware   │
└──────────┬─────────────────┘
           │
           ▼
┌──────────────────────────────┐
│ Extract Authorization header │
│ "Bearer eyJhbGciOiJ..."      │
└──────────┬───────────────────┘
           │
           ▼
┌─────────────────┐
│ Token exists?   │
└────┬────────┬───┘
     │        │
    YES       NO
     │        │
     │        ▼
     │   ┌─────────────────┐
     │   │ Return 401      │
     │   │ Unauthorized    │
     │   └─────────────────┘
     │
     ▼
┌──────────────────────┐
│ jwt.verify(token)    │
└────┬─────────────┬───┘
     │             │
   VALID        INVALID
     │             │
     │             ▼
     │        ┌─────────────┐
     │        │ Return 401  │
     │        │ Invalid token│
     │        └─────────────┘
     │
     ▼
┌──────────────────────┐
│ Extract userId       │
│ req.userId = decoded │
└──────────┬───────────┘
           │
           ▼
┌──────────────────────┐
│ Call next()          │
│ Continue to route    │
└──────────────────────┘
```

---

## 6. Database Schema Relationships

```
┌─────────────────────────────┐
│         users               │
├─────────────────────────────┤
│ _id: ObjectId (PK)          │
│ email: String (unique)      │
│ password: String (hashed)   │
└──────────────┬──────────────┘
               │
               │ 1:N relationship
               │
               ▼
┌─────────────────────────────┐
│    prompthistories          │
├─────────────────────────────┤
│ _id: ObjectId (PK)          │
│ userId: ObjectId (FK) ──────┼──┐
│ prompt: String              │  │
│ metadata: {                 │  │
│   purpose: String           │  │
│   subject: String           │  │
│   details: String           │  │
│ }                           │  │
│ preview: String             │  │
│ timestamp: Date             │  │
└─────────────────────────────┘  │
                                 │
        References ──────────────┘
```

---

## 7. Complete User Journey Map

```
START
  │
  ▼
┌────────────────┐
│ Visit Website  │
└───────┬────────┘
        │
        ▼
┌────────────────────┐      ┌──────────────┐
│ Token in storage?  │─NO──▶│ login.html   │
└────────┬───────────┘      └──────┬───────┘
         │                         │
        YES                        │
         │                         ▼
         │                  ┌──────────────┐
         │                  │ Register or  │
         │                  │ Login        │
         │                  └──────┬───────┘
         │                         │
         │                         ▼
         │                  ┌──────────────┐
         │                  │ Get JWT      │
         │                  │ Store token  │
         │                  └──────┬───────┘
         │                         │
         └─────────────────────────┘
                   │
                   ▼
         ┌──────────────────┐
         │   index.html     │
         │   Load history   │
         └────────┬─────────┘
                  │
                  ▼
         ┌──────────────────┐
         │ Fill prompt form │
         └────────┬─────────┘
                  │
                  ▼
         ┌──────────────────┐
         │ Generate Prompt  │
         └────────┬─────────┘
                  │
                  ▼
         ┌──────────────────┐
         │ Build initial    │
         │ prompt (client)  │
         └────────┬─────────┘
                  │
                  ▼
         ┌──────────────────┐
         │ Send to Gemini   │
         │ for refinement   │
         └────────┬─────────┘
                  │
                  ▼
         ┌──────────────────┐
         │ Display refined  │
         │ prompt           │
         └────────┬─────────┘
                  │
                  ▼
         ┌──────────────────┐
         │ Save to history  │
         │ (MongoDB)        │
         └────────┬─────────┘
                  │
                  ▼
         ┌──────────────────┐
         │ Copy to clipboard│
         └────────┬─────────┘
                  │
                  ▼
         ┌──────────────────┐
         │ Use in ChatGPT/  │
         │ Claude/etc.      │
         └──────────────────┘
```

---

## 8. API Request/Response Flow

```
┌─────────────┐
│   CLIENT    │
└──────┬──────┘
       │
       │ 1. POST /api/register
       │    {email, password}
       ▼
┌─────────────────────┐
│   EXPRESS SERVER    │
│                     │
│  ┌───────────────┐  │
│  │ Validate data │  │
│  └───────┬───────┘  │
│          │          │
│  ┌───────▼───────┐  │
│  │ Hash password │  │
│  │ (bcrypt)      │  │
│  └───────┬───────┘  │
│          │          │
│  ┌───────▼───────┐  │
│  │ Save to DB    │──┼──▶ MongoDB
│  └───────┬───────┘  │
│          │          │
│  ┌───────▼───────┐  │
│  │ Generate JWT  │  │
│  └───────┬───────┘  │
└──────────┼──────────┘
           │
           │ 2. Response
           │    {token: "eyJ..."}
           ▼
┌─────────────────────┐
│   CLIENT            │
│ Store in localStorage│
└─────────────────────┘
           │
           │ 3. POST /api/refine-prompt
           │    Headers: Bearer <token>
           │    Body: {userPrompt}
           ▼
┌─────────────────────┐
│   EXPRESS SERVER    │
│                     │
│  ┌───────────────┐  │
│  │ Verify JWT    │  │
│  └───────┬───────┘  │
│          │          │
│  ┌───────▼───────┐  │
│  │ Call Gemini   │──┼──▶ Google AI
│  │ API           │◀─┼───
│  └───────┬───────┘  │
│          │          │
└──────────┼──────────┘
           │
           │ 4. Response
           │    {refinedPrompt}
           ▼
┌─────────────────────┐
│   CLIENT            │
│ Display prompt      │
└─────────────────────┘
```

---

## 9. History Management Flow

```
┌──────────────────┐
│ Load History     │
└────────┬─────────┘
         │
         ▼
┌─────────────────────────┐
│ GET /api/prompt-history │
│ Headers: Bearer <token> │
└────────┬────────────────┘
         │
         ▼
┌─────────────────────────┐
│ Backend:                │
│ • Verify token          │
│ • Find by userId        │
│ • Sort by timestamp     │
│ • Limit 50              │
└────────┬────────────────┘
         │
         ▼
┌─────────────────────────┐
│ Return array of prompts │
└────────┬────────────────┘
         │
         ▼
┌─────────────────────────┐
│ Display in sidebar      │
│ with preview text       │
└─────────────────────────┘


┌──────────────────┐
│ Save New Prompt  │
└────────┬─────────┘
         │
         ▼
┌─────────────────────────┐
│ POST /api/save-prompt   │
│ Body: {                 │
│   prompt,               │
│   metadata,             │
│   preview               │
│ }                       │
└────────┬────────────────┘
         │
         ▼
┌─────────────────────────┐
│ Backend:                │
│ • Create document       │
│ • Link to userId        │
│ • Save to MongoDB       │
└────────┬────────────────┘
         │
         ▼
┌─────────────────────────┐
│ Keep only last 50       │
│ Delete older prompts    │
└────────┬────────────────┘
         │
         ▼
┌─────────────────────────┐
│ Return success          │
└─────────────────────────┘


┌──────────────────┐
│ Delete Prompt    │
└────────┬─────────┘
         │
         ▼
┌──────────────────────────┐
│ DELETE /api/prompt-      │
│ history/:id              │
└────────┬─────────────────┘
         │
         ▼
┌──────────────────────────┐
│ Backend:                 │
│ • Verify userId matches  │
│ • Delete document        │
└────────┬─────────────────┘
         │
         ▼
┌──────────────────────────┐
│ Remove from sidebar      │
└──────────────────────────┘
```

---

## 10. Security Layers

```
┌─────────────────────────────────────────┐
│           SECURITY LAYERS               │
├─────────────────────────────────────────┤
│                                         │
│  Layer 1: Password Security             │
│  ┌───────────────────────────────────┐  │
│  │ • bcrypt hashing (10 rounds)      │  │
│  │ • Never store plain text          │  │
│  │ • Salt automatically generated    │  │
│  └───────────────────────────────────┘  │
│                                         │
│  Layer 2: JWT Authentication            │
│  ┌───────────────────────────────────┐  │
│  │ • Token-based auth                │  │
│  │ • 24-hour expiration              │  │
│  │ • Signed with secret key          │  │
│  │ • Stored in localStorage          │  │
│  └───────────────────────────────────┘  │
│                                         │
│  Layer 3: Route Protection              │
│  ┌───────────────────────────────────┐  │
│  │ • verifyToken middleware          │  │
│  │ • All routes except login/register│  │
│  │ • Extract userId from token       │  │
│  └───────────────────────────────────┘  │
│                                         │
│  Layer 4: Data Isolation                │
│  ┌───────────────────────────────────┐  │
│  │ • Users only see their data       │  │
│  │ • userId filter on all queries    │  │
│  │ • No cross-user access            │  │
│  └───────────────────────────────────┘  │
│                                         │
└─────────────────────────────────────────┘
```

---

## 11. File Structure & Data Flow

```
PROJECT ROOT
│
├── login.html ──────┐
│                    │
├── auth.js ─────────┼──▶ Handles authentication
│                    │    • Register
│                    │    • Login
│                    │    • Token storage
│                    │
├── index.html ──────┼──▶ Main application UI
│                    │
├── script.js ───────┼──▶ Core functionality
│                    │    • Form validation
│                    │    • Prompt building
│                    │    • API calls
│                    │    • History management
│                    │
├── style.css ───────┼──▶ Styling
│                    │
├── server.js ───────┼──▶ Backend API
│                    │    • Express routes
│                    │    • JWT middleware
│                    │    • MongoDB connection
│                    │    • Gemini AI integration
│                    │
├── package.json ────┼──▶ Dependencies
│                    │
└── .env ────────────┘    • GEMINI_API_KEY
                          • JWT_SECRET


DATA FLOW:

User Input → script.js → server.js → MongoDB
                ↓            ↓
           localStorage  Gemini AI
                ↓            ↓
           JWT Token    Refined Prompt
```

---

## 12. State Management

```
┌─────────────────────────────────────┐
│        CLIENT STATE                 │
├─────────────────────────────────────┤
│                                     │
│  localStorage                       │
│  ├─ token: "eyJhbGc..."            │
│  └─ (JWT, 24h expiry)              │
│                                     │
│  DOM State                          │
│  ├─ generatedPrompt (text)         │
│  ├─ historyList (array)            │
│  ├─ form values                    │
│  └─ button states                  │
│                                     │
└─────────────────────────────────────┘

┌─────────────────────────────────────┐
│        SERVER STATE                 │
├─────────────────────────────────────┤
│                                     │
│  MongoDB                            │
│  ├─ users collection               │
│  │  └─ {_id, email, password}     │
│  │                                 │
│  └─ prompthistories collection     │
│     └─ {_id, userId, prompt,       │
│         metadata, preview,         │
│         timestamp}                 │
│                                     │
│  In-Memory                          │
│  ├─ Express app instance           │
│  ├─ Gemini AI client               │
│  └─ Active connections             │
│                                     │
└─────────────────────────────────────┘
```

---

## 13. Error Handling Flow

```
┌──────────────────┐
│ User Action      │
└────────┬─────────┘
         │
         ▼
┌──────────────────┐
│ Try Operation    │
└────┬────────┬────┘
     │        │
  SUCCESS   ERROR
     │        │
     │        ▼
     │   ┌─────────────────┐
     │   │ Catch Error     │
     │   └────────┬────────┘
     │            │
     │            ▼
     │   ┌─────────────────┐
     │   │ Log to console  │
     │   └────────┬────────┘
     │            │
     │            ▼
     │   ┌─────────────────┐
     │   │ Show user error │
     │   │ • Alert         │
     │   │ • Toast         │
     │   │ • Inline msg    │
     │   └────────┬────────┘
     │            │
     │            ▼
     │   ┌─────────────────┐
     │   │ Reset UI state  │
     │   │ • Enable buttons│
     │   │ • Remove loading│
     │   └─────────────────┘
     │
     ▼
┌──────────────────┐
│ Continue         │
└──────────────────┘
```


import express from 'express'
import cors from 'cors'
import nodemailer from 'nodemailer'
import dotenv from 'dotenv'
import multer from 'multer'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

dotenv.config()

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const app = express()
const PORT = process.env.PORT || 4000

// Database setup
const DATA_DIR = path.join(__dirname, 'data')
const DB_FILE = path.join(DATA_DIR, 'projects.json')
const UPLOADS_DIR = path.join(__dirname, 'uploads')

if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true })
}
if (!fs.existsSync(DB_FILE)) {
  fs.writeFileSync(DB_FILE, JSON.stringify([], null, 2))
}
if (!fs.existsSync(UPLOADS_DIR)) {
  fs.mkdirSync(UPLOADS_DIR, { recursive: true })
}

const readDb = () => {
  try {
    const data = fs.readFileSync(DB_FILE, 'utf8')
    return JSON.parse(data)
  } catch (err) {
    return []
  }
}

const writeDb = (data) => {
  fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2))
}

app.use(cors())
app.use(express.json({ limit: '10mb' }))

// Serve uploaded files statically
app.use('/uploads', express.static(UPLOADS_DIR))

// Simple Auth Middleware
const requireAuth = (req, res, next) => {
  const authHeader = req.headers.authorization
  if (!authHeader) return res.status(401).json({ error: 'Unauthorized' })
  const token = authHeader.split(' ')[1]
  if (token !== (process.env.ADMIN_SECRET || '22bcte07')) {
    return res.status(403).json({ error: 'Forbidden' })
  }
  next()
}

// Multer for local disk storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, UPLOADS_DIR)
  },
  filename: function (req, file, cb) {
    // Generate unique filename: timestamp-random-originalName
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
    // Sanitize filename
    const safeName = file.originalname.replace(/[^a-zA-Z0-9.]/g, '_')
    cb(null, uniqueSuffix + '-' + safeName)
  }
})

const upload = multer({ storage: storage })

// Health check
app.get('/api/health', (_, res) => {
  res.json({ ok: true })
})

// Auth Route
app.post('/api/login', (req, res) => {
  const { password } = req.body
  const adminSecret = process.env.ADMIN_SECRET || '22bcte07'
  if (password === adminSecret) {
    res.json({ ok: true, token: adminSecret })
  } else {
    res.status(401).json({ ok: false, error: 'Invalid password' })
  }
})

// Projects Routes
app.get('/api/projects', (_, res) => {
  const projects = readDb()
  projects.sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0))
  res.json(projects)
})

app.post('/api/projects', requireAuth, (req, res) => {
  const newProject = {
    id: Date.now().toString(),
    ...req.body,
    createdAt: Date.now(),
    updatedAt: Date.now()
  }
  const projects = readDb()
  projects.push(newProject)
  writeDb(projects)
  res.json(newProject)
})

app.put('/api/projects/:id', requireAuth, (req, res) => {
  const { id } = req.params
  const updates = req.body
  const projects = readDb()
  const index = projects.findIndex(p => p.id === id)
  if (index === -1) return res.status(404).json({ error: 'Project not found' })

  projects[index] = { ...projects[index], ...updates, updatedAt: Date.now() }
  writeDb(projects)
  res.json(projects[index])
})

app.delete('/api/projects/:id', requireAuth, (req, res) => {
  const { id } = req.params
  let projects = readDb()
  const project = projects.find(p => p.id === id)
  if (!project) return res.status(404).json({ error: 'Project not found' })
  
  // Optional: Delete local file if it exists
  if (project.imageUrl && project.imageUrl.includes('/uploads/')) {
    const filename = path.basename(project.imageUrl)
    const filePath = path.join(UPLOADS_DIR, filename)
    if (fs.existsSync(filePath)) {
      try {
        fs.unlinkSync(filePath)
      } catch (e) {
        console.error('Failed to delete file:', e)
      }
    }
  }
  
  projects = projects.filter(p => p.id !== id)
  writeDb(projects)
  res.json({ ok: true })
})

// Image upload to Local Storage
app.post('/api/upload', requireAuth, upload.single('file'), (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ ok: false, error: 'No file uploaded' })
    
    // Construct public URL
    // Assuming server is running on localhost:4000 (or whatever PORT is)
    // We need to know the protocol/host, but for now we can return a relative path or absolute if we know the domain.
    // Let's return a full URL based on the request host.
    const protocol = req.protocol
    const host = req.get('host')
    const fullUrl = `${protocol}://${host}/uploads/${req.file.filename}`
    
    return res.json({ ok: true, url: fullUrl })
  } catch (err) {
    console.error('Upload route failed:', err)
    res.status(500).json({ ok: false, error: 'Server error' })
  }
})

app.post('/api/contact', async (req, res) => {
  try {
    const { name, email, message } = req.body || {}
    if (!name || !email || !message) {
      return res.status(400).json({ ok: false, error: 'Missing required fields' })
    }

    const transport = nodemailer.createTransport({
      host: process.env.SMTP_HOST || 'smtp.gmail.com',
      port: Number(process.env.SMTP_PORT || 465),
      secure: process.env.SMTP_SECURE ? process.env.SMTP_SECURE === 'true' : true,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    })

    const toEmail = process.env.TO_EMAIL || 'ankushpatel4656@gmail.com'

    const info = await transport.sendMail({
      from: `Portfolio Contact <${process.env.SMTP_USER}>`,
      to: toEmail,
      subject: `New message from ${name}`,
      replyTo: email,
      text: `From: ${name} <${email}>\n\n${message}`,
      html: `<p><strong>From:</strong> ${name} &lt;${email}&gt;</p><p>${message.replace(/\n/g, '<br/>')}</p>`,
    })

    res.json({ ok: true, messageId: info.messageId })
  } catch (err) {
    console.error('Email send failed:', err)
    res.status(500).json({ ok: false, error: 'Failed to send email' })
  }
})

app.listen(PORT, () => {
  console.log(`Mail & upload server listening on http://localhost:${PORT}`)
})


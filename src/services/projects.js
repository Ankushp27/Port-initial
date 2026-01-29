const API_URL = '/api/projects'

function getAuthHeaders() {
  const token = localStorage.getItem('adminToken') || '22bcte07' // Fallback for now
  return {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  }
}

export async function listProjects() {
  const res = await fetch(API_URL)
  if (!res.ok) throw new Error('Failed to fetch projects')
  return res.json()
}

export function subscribeProjects(callback) {
  // Polling fallback since we removed Firestore real-time listeners
  listProjects().then(callback).catch(console.error)
  const interval = setInterval(() => {
    listProjects().then(callback).catch(console.error)
  }, 5000)
  return () => clearInterval(interval)
}

async function uploadToCloudinary(file) {
  const formData = new FormData()
  formData.append('file', file)
  const headers = {}
  const token = localStorage.getItem('adminToken') || '22bcte07'
  headers['Authorization'] = `Bearer ${token}`
  
  const res = await fetch('/api/upload?folder=projects', {
    method: 'POST', 
    body: formData,
    headers: { 'Authorization': `Bearer ${token}` }
  })
  const data = await res.json()
  if (!data.ok) throw new Error(data.error || 'Upload failed')
  return data.url
}

export async function createProject(project, file) {
  let imageUrl = project.imageUrl || ''
  if (file) {
    imageUrl = await uploadToCloudinary(file)
  }
  
  const res = await fetch(API_URL, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify({ ...project, imageUrl })
  })
  if (!res.ok) throw new Error('Failed to create project')
  return res.json()
}

export async function updateProject(id, updates, file) {
  let next = { ...updates }
  if (file) {
    next.imageUrl = await uploadToCloudinary(file)
  }
  
  const res = await fetch(`${API_URL}/${id}`, {
    method: 'PUT',
    headers: getAuthHeaders(),
    body: JSON.stringify(next)
  })
  if (!res.ok) throw new Error('Failed to update project')
  return res.json()
}

export async function deleteProject(id) {
  const res = await fetch(`${API_URL}/${id}`, {
    method: 'DELETE',
    headers: getAuthHeaders()
  })
  if (!res.ok) throw new Error('Failed to delete project')
}
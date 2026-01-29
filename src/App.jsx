import './App.css'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Layout from './components/Layout.jsx'
import Home from './pages/Home.jsx'
import About from './pages/About.jsx'
import Skills from './pages/Skills.jsx'
import Projects from './pages/Projects.jsx'
import Connect from './pages/Connect.jsx'
import Achievements from './pages/Achievements.jsx'
import { useAuth } from './hooks/useAuth'

function ProtectedRoute({ children }) {
	const { isAdmin, loading } = useAuth()
	if (loading) return null
	return isAdmin ? children : <Navigate to="/" replace />
}

export default function App() {
	return (
		<BrowserRouter>
			<Routes>
				<Route element={<Layout />}>
					<Route path="/" element={<Home />} />
					<Route path="/about" element={<About />} />
					<Route path="/skills" element={<Skills />} />
					<Route path="/projects" element={<Projects />} />
					<Route path="/achievements" element={<Achievements />} />
					<Route path="/contact" element={<Connect />} />
					<Route path="/connect" element={<Connect />} />
					{/* Example protected route for future Admin Panel */}
					<Route path="/admin" element={<ProtectedRoute><Projects /></ProtectedRoute>} />
				</Route>
			</Routes>
		</BrowserRouter>
	)
}

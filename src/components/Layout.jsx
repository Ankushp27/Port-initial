import { Link, Outlet, useLocation } from 'react-router-dom'
import { useEffect, useRef, useState } from 'react'
import { initRevealAnimations } from '../utils/animations'
import logoDark from '../assets/wicon.png'
import logoLight from '../assets/icon.png'
import myResume from '../assets/Ankush Patel_Resume.pdf'
import { useAuth } from '../hooks/useAuth'

const NavLink = ({ to, children }) => (
	<Link to={to} className="nav-link text-zinc-300 hover:text-white transition-colors">
		{children}
	</Link>
)

function ThemeToggle() {
	function toggleTheme() {
		const html = document.documentElement
		const isLight = html.classList.toggle('theme-light')
		const btn = document.getElementById('theme-toggle')
		if (btn) btn.classList.add('theme-toggle-anim')
		setTimeout(() => btn && btn.classList.remove('theme-toggle-anim'), 300)
		localStorage.setItem('theme', isLight ? 'light' : 'dark')
	}
	return (
		<button id="theme-toggle" aria-label="Toggle theme" className="theme-toggle" onClick={toggleTheme}>
			<img className="theme-moon" src="https://cdn-icons-png.flaticon.com/512/1146/1146869.png" alt="Dark" width="18" height="18" />
			<img className="theme-sun" src="https://cdn-icons-png.flaticon.com/512/958/958507.png" alt="Light" width="18" height="18" />
		</button>
	)
}

export default function Layout() {
	const location = useLocation()
	const mainRef = useRef(null)
	const spotRef = useRef(null)

	const [showToast, setShowToast] = useState(false)

	useEffect(() => {
		const saved = localStorage.getItem('theme')
		if (saved === 'light') document.documentElement.classList.add('theme-light')
	}, [])

	useEffect(() => {
		const root = mainRef.current || document
		initRevealAnimations(root)
		window.scrollTo({ top: 0, behavior: 'smooth' })
	}, [location.pathname])

	useEffect(() => {
		const el = spotRef.current
		if (!el) return
		const onMove = (e) => {
			const x = (e.clientX / window.innerWidth) * 100 + '%'
			const y = (e.clientY / window.innerHeight) * 100 + '%'
			el.style.setProperty('--mx', x)
			el.style.setProperty('--my', y)
		}
		window.addEventListener('mousemove', onMove)
		return () => window.removeEventListener('mousemove', onMove)
	}, [])

	const { user, isAdmin, login, logout } = useAuth()

	return (
		<div className="min-h-screen" style={{ background: 'var(--bg)', color: 'var(--fg)' }}>
			<div ref={spotRef} className="cursor-spot" />
			<div className="edge-glow" />
			<header className="sticky top-0 z-50 backdrop-blur" style={{ borderBottom: '1px solid var(--border)', background: 'color-mix(in oklab, var(--bg) 80%, transparent)' }}>
				<div className="container flex items-center justify-between py-4">
					<Link to="/" className="font-semibold tracking-wide flex items-center gap-2">
						<img src={logoDark} alt="Logo" className="site-logo logo-dark" />
						<img src={logoLight} alt="Logo" className="site-logo logo-light" />
						<span>Ankush Patel</span>
					</Link>
					<nav className="flex items-center gap-6 text-sm">
						<NavLink to="/">Home</NavLink>
						<NavLink to="/about">About</NavLink>
						<NavLink to="/skills">Skills</NavLink>
						<NavLink to="/projects">Projects</NavLink>
						<NavLink to="/connect">Connect</NavLink>
					</nav>
					<div className="flex items-center gap-3">
						<ThemeToggle />
						<button
							className="hidden md:inline-block btn btn-primary"
							onClick={() => {
								const a = document.createElement('a')
								a.href = myResume
								a.download = 'myresume.pdf'
								document.body.appendChild(a)
								a.click()
								document.body.removeChild(a)
								setShowToast(true)
								setTimeout(() => setShowToast(false), 2000)
							}}
						>
							Resume
						</button>
						{!user ? (
							<button className="btn btn-outline" onClick={login}>Admin Sign In</button>
						) : (
							<button className="btn btn-outline" onClick={logout}>Sign Out</button>
						)}
					</div>
				</div>
			</header>

			{showToast && (
				<div style={{ position: 'fixed', top: 66, right: 24, zIndex: 60 }}>
					<div className="toast">
						Downloaded successfully
					</div>
				</div>
			)}

			<main ref={mainRef} className="route-viewport">
				<div key={location.pathname} className="route-enter">
					<Outlet />
				</div>
			</main>

			<footer style={{ borderTop: '1px solid var(--border)' }}>
				<div className="container py-12 footer-container">
					<div className="footer-ambient" />
					<div className="footer-grid">
						<div>
							<h4 className="footer-title">About this site</h4>
							<p className="muted text-sm">© {new Date().getFullYear()} Ankush Patel. All rights reserved.</p>
							<p className="muted text-xs mt-3">Built with React, Vite, and Tailwind CSS.</p>
						</div>
						<div>
							<h4 className="footer-title">Contact</h4>
							<ul className="text-sm space-y-2">
								<li><a className="footer-link" href="mailto:ankushpatel4656@gmail.com">ankushpatel4656@gmail.com</a></li>
								<li><a className="footer-link" href="tel:+917008846056">+91 70088 46056</a></li>
							</ul>
							<div className="flex items-center gap-3 mt-4">
								<a className="footer-icon" href="https://www.linkedin.com/" target="_blank" rel="noreferrer" aria-label="LinkedIn">
									<img src="https://cdn-icons-png.flaticon.com/512/174/174857.png" alt="LinkedIn" width="18" height="18" />
								</a>
								<a className="footer-icon" href="https://github.com/" target="_blank" rel="noreferrer" aria-label="GitHub">
									<img src="https://cdn-icons-png.flaticon.com/512/733/733553.png" alt="GitHub" width="18" height="18" />
								</a>
							</div>
						</div>
						<div>
							<h4 className="footer-title">Quick Links</h4>
							<ul className="text-sm space-y-2">
								<li><Link className="footer-link" to="/about">About</Link></li>
								<li><Link className="footer-link" to="/skills">Skills</Link></li>
								<li><Link className="footer-link" to="/projects">Projects</Link></li>
								<li><Link className="footer-link" to="/connect">Connect</Link></li>
								<li>
									<button className="footer-link text-left w-full" onClick={() => {
										const code = window.prompt('Enter Admin Code')
										if (!code) return
										if (code.trim() === '22bcte07') {
											localStorage.setItem('isAdmin', 'true')
											window.location.reload()
										} else {
											alert('Invalid code')
										}
									}}>
										Admin
									</button>
								</li>
							</ul>
						</div>
						<div>
							<h4 className="footer-title">Highlights</h4>
							<div className="mt-2">
								<Link to="/achievements" className="btn btn-primary">Achievements</Link>
							</div>
						</div>
					</div>

					<div className="footer-sep my-8" />

					<div className="flex items-center justify-between flex-wrap gap-4">
						<div className="flex items-center gap-3" />
						{/* <p className="muted text-xs">Icons via Freepik/Flaticon.</p> */}
					</div>
				</div>
			</footer>
		</div>
	)
}
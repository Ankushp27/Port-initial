import './Home.css'
import { Link } from 'react-router-dom'
import myAvatar from '../assets/meee2.png'

export default function Home() {
	return (
		<section id="home" className="section">
			<div className="container grid md:grid-cols-2 gap-10 items-center" data-reveal>
				<div>
					<p className="text-blue-400 font-medium">Computer Science Engineering Student</p>
					<h1 className="heading mt-3 text-4xl md:text-5xl font-semibold tracking-tight">Ankush Patel — Frontend Developer</h1>
					<p className="mt-5 muted max-w-prose">I design and build performant web applications with React, TypeScript, and modern tooling. I care about clean UI, accessibility, and delivering delightful user experiences.</p>
					<div className="mt-7 flex gap-3">
						<Link to="/projects" className="btn btn-primary">View Projects</Link>
						<Link to="/connect" className="btn btn-outline">Connect</Link>
					</div>
				</div>
				<div className="avatar-frame">
					<div className="avatar-inner w-full">
						<img src={myAvatar} alt="Ankush avatar" className="w-full object-cover" />
					</div>
				</div>
			</div>
			
		</section>
	)
}



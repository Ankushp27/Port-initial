import './About.css'

export default function About() {
	return (
		<section className="section">
			<div className="container" data-reveal>
				<h1 className="section-title">About</h1>
				<div className="grid md:grid-cols-3 gap-8 items-start">
					<div className="md:col-span-1">
						<div className="overflow-hidden rounded-xl border border-zinc-800">
							<img src="https://images.pexels.com/photos/1181675/pexels-photo-1181675.jpeg?auto=compress&cs=tinysrgb&w=800" alt="Ankush portrait" className="w-full h-full object-cover aspect-square" />
						</div>
					</div>
					<div className="md:col-span-2">
						<p className="muted max-w-prose">I'm a CSE student and frontend developer focused on building smooth, accessible interfaces. I enjoy working across the stack, shaping product UX, and learning by shipping. Recent interests include animation, design systems, and performance budgets.</p>
						<div className="mt-6 grid grid-cols-2 gap-4 text-sm">
							<div><span className="tag">Location</span><div className="mt-2">India</div></div>
							<div><span className="tag">Open to</span><div className="mt-2">Internships / Freelance</div></div>
						</div>
					</div>
				</div>
			</div>
		</section>
	)
}



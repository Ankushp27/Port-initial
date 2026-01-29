import './Skills.css'

const CATEGORIES = {
	Languages: [
	{ name: 'HTML5', src: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/html5/html5-plain.svg' },
	{ name: 'CSS3', src: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/css3/css3-plain.svg' },
	{ name: 'JavaScript', src: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg' },
	{ name: 'TypeScript', src: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/typescript/typescript-original.svg' },
	{ name: 'C', src: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/c/c-original.svg' },
	{ name: 'Java', src: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/java/java-original.svg' },
	{ name: 'Python', src: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg' },
	{ name: 'SQL', src: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mysql/mysql-original.svg' },
	],
	Libraries: [
		{ name: 'React', src: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg' },
		{ name: 'Tailwind CSS', src: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/tailwindcss/tailwindcss-original.svg' },
	],
	Backend: [
		{ name: 'Node.js', src: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg' },
		{ name: 'Express', src: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/express/express-original.svg' },
		{ name: 'MongoDB', src: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mongodb/mongodb-original.svg' },
	],
	Tools: [
		{ name: 'Figma', src: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/figma/figma-original.svg' },
		{ name: 'Power BI', src: 'https://upload.wikimedia.org/wikipedia/commons/c/cf/New_Power_BI_Logo.svg' },
	],
}

export default function Skills() {
	return (
		<section className="section">
			<div className="container" data-reveal>
				<h1 className="section-title">Skills</h1>
				{Object.entries(CATEGORIES).map(([title, items]) => (
					<div key={title} className="mb-10">
						<h2 className="text-lg font-semibold mb-4">{title}</h2>
						<ul className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-6 justify-items-center">
							{items.map((logo) => (
								<li key={logo.name} className="group">
									<div className="skill-logo">
										<img src={logo.src} alt={logo.name} title={logo.name} className={logo.name === 'Express' ? 'logo-express' : ''} />
										<div className="logo-text">{logo.name}</div>
									</div>
								</li>
							))}
						</ul>
					</div>
				))}
			</div>
		</section>
	)
}



export function initRevealAnimations(root = document) {
	const observer = new IntersectionObserver((entries) => {
		entries.forEach((entry) => {
			if (entry.isIntersecting) {
				entry.target.classList.add('show')
				entry.target.querySelectorAll('.progress-bar').forEach((bar) => {
					const target = Number(bar.getAttribute('data-target') || '0')
					requestAnimationFrame(() => {
						bar.style.width = `${target}%`
					})
				})
				observer.unobserve(entry.target)
			}
		})
	}, { threshold: 0.15 })

	root.querySelectorAll('[data-reveal]').forEach((el) => {
		observer.observe(el)
		const rect = el.getBoundingClientRect()
		if (rect.top < window.innerHeight * 0.85) {
			el.classList.add('show')
			el.querySelectorAll('.progress-bar').forEach((bar) => {
				const target = Number(bar.getAttribute('data-target') || '0')
				bar.style.width = `${target}%`
			})
			observer.unobserve(el)
		}
	})
}

export function smoothScrollToId(id) {
	const headerOffset = 80
	const element = document.getElementById(id)
	if (!element) return
	const elementPosition = element.getBoundingClientRect().top + window.pageYOffset
	const destination = elementPosition - headerOffset
	const start = window.pageYOffset
	const distance = destination - start
	const duration = 600
	let startTime = null
	const easeInOut = (t) => (t < 0.5 ? 2*t*t : -1+(4-2*t)*t)
	function animation(currentTime) {
		if (startTime === null) startTime = currentTime
		const timeElapsed = currentTime - startTime
		const progress = Math.min(timeElapsed / duration, 1)
		const run = start + distance * easeInOut(progress)
		window.scrollTo(0, run)
		if (timeElapsed < duration) requestAnimationFrame(animation)
	}
	requestAnimationFrame(animation)
}



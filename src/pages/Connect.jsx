import './Connect.css'
import { useState } from 'react'

export default function Connect() {
	const [form, setForm] = useState({ name: '', email: '', message: '' })
	const [status, setStatus] = useState('idle')

	async function onSubmit(e) {
		e.preventDefault()
		if (!form.name || !form.email || !form.message) return
		setStatus('sending')
		try {
			const res = await fetch('/api/contact', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(form),
			})
			const data = await res.json()
			if (!res.ok || !data.ok) throw new Error(data.error || 'Failed')
			setStatus('success')
			setForm({ name: '', email: '', message: '' })
		} catch (err) {
			setStatus('error')
		}
		setTimeout(() => setStatus('idle'), 2500)
	}

	function onChange(e) {
		const { name, value } = e.target
		setForm((f) => ({ ...f, [name]: value }))
	}

	return (
		<section className="section">
			<div className="container" data-reveal>
				<h1 className="section-title">Connect</h1>
				<form className="grid gap-4 max-w-xl" onSubmit={onSubmit}>
					<input name="name" value={form.name} onChange={onChange} className="rounded-md field px-4 py-2" placeholder="Your name" />
					<input name="email" type="email" value={form.email} onChange={onChange} className="rounded-md field px-4 py-2" placeholder="you@example.com" />
					<textarea name="message" rows="4" value={form.message} onChange={onChange} className="rounded-md field px-4 py-2" placeholder="Message" />
					<div className="flex items-center gap-3">
						<button disabled={status==='sending'} className="btn btn-primary w-fit">{status==='sending' ? 'Sending…' : 'Send'}</button>
						{status==='success' && <span className="muted">Sent! I’ll get back to you soon.</span>}
						{status==='error' && <span className="muted">Could not send. Try again later.</span>}
					</div>
				</form>
			</div>
		</section>
	)
}



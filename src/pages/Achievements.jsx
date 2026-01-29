import { useEffect, useState } from 'react'
import imgEntrepreneurship from '../ach/Entrepreneurship.jpg'
import imgFrontend from '../ach/Frontend.jpg'
import imgMappdev from '../ach/Mappdev.jpg'
import imgPython from '../ach/Python.jpg'

export default function Achievements() {
	const [items, setItems] = useState(() => {
		try {
			const raw = localStorage.getItem('achievements')
			const parsed = raw ? JSON.parse(raw) : null
			if (!parsed || parsed.length === 0) {
				return [
					{ id: 'ach-entrepreneurship', name: 'Entrepreneurship', url: imgEntrepreneurship, type: 'image/jpeg', source: 'local' },
					{ id: 'ach-frontend', name: 'Frontend', url: imgFrontend, type: 'image/jpeg', source: 'local' },
					{ id: 'ach-mappdev', name: 'Mobile App Dev', url: imgMappdev, type: 'image/jpeg', source: 'local' },
					{ id: 'ach-python', name: 'Python', url: imgPython, type: 'image/jpeg', source: 'local' },
				]
			}
			return parsed
		} catch {
			return []
		}
	})
	const [isAdmin, setIsAdmin] = useState(() => localStorage.getItem('isAdmin') === 'true')

	useEffect(() => {
		try { localStorage.setItem('achievements', JSON.stringify(items)) } catch {}
	}, [items])

	function fileToDataUrl(file) {
		return new Promise((resolve, reject) => {
			const reader = new FileReader()
			reader.onload = () => resolve(String(reader.result))
			reader.onerror = reject
			reader.readAsDataURL(file)
		})
	}

	async function handleFilesSelected(e) {
		if (!isAdmin) return
		const files = Array.from(e.target.files || [])
		const mapped = await Promise.all(files.map(async (file) => ({
			id: `${file.name}-${file.size}-${file.lastModified}`,
			name: file.name,
			url: await fileToDataUrl(file),
			type: file.type,
			source: 'upload',
		})))
		setItems((prev) => [...mapped, ...prev])
		e.target.value = ''
	}

	function removeItem(id) {
		if (!isAdmin) return
		setItems((prev) => prev.filter((i) => i.id !== id))
	}

	return (
		<section className="section">
			<div className="container" data-reveal>
				<h1 className="section-title">Achievements</h1>
				<p className="muted text-sm mt-1">Upload certificates, awards, or other achievements. Files stay local to your browser.</p>

				<div className="mt-4 flex items-center justify-between gap-3">
					{isAdmin ? (
						<div className="flex items-center gap-3">
							<label className="btn btn-primary cursor-pointer">
								<input type="file" className="hidden" multiple accept="image/*,.pdf" onChange={handleFilesSelected} />
								Add files
							</label>
							<AddByUrl onAdd={(entry) => setItems((prev) => [entry, ...prev])} />
						</div>
					) : (
						<div className="muted text-xs">Viewing in read-only mode. Use Admin link in footer to edit.</div>
					)}
				</div>

				{items.length > 0 ? (
					<div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
						{items.map((it) => (
							<div key={it.id} className="card overflow-hidden">
								<div className="h-48 bg-zinc-900 flex items-center justify-center overflow-hidden">
									{it.type?.startsWith('image/') || it.url?.startsWith('data:image/') ? (
										<img src={it.url} alt={it.name} className="w-full h-full object-cover" />
									) : (
										<div className="text-center p-6">
											<div className="text-xs uppercase tracking-wide text-zinc-400">PDF</div>
											<div className="mt-2 text-sm break-all px-4">{it.name}</div>
										</div>
									)}
								</div>
								<div className="p-4 flex items-center justify-between gap-3">
									<div className="text-sm truncate" title={it.name}>{it.name}</div>
									<div className="flex items-center gap-2">
										<a href={it.url} download className="btn btn-outline text-xs">Download</a>
										{isAdmin && (
											<button className="btn text-xs" onClick={() => removeItem(it.id)}>Remove</button>
										)}
									</div>
								</div>
							</div>
						))}
					</div>
				) : (
					<p className="muted mt-8">No achievements yet. {isAdmin ? 'Use the button above to add files.' : 'Ask admin to add files.'}</p>
				)}
			</div>
		</section>
	)
}

function AddByUrl({ onAdd }) {
	const [url, setUrl] = useState('')
	const [name, setName] = useState('')

	function add() {
		if (!url) return
		onAdd({ id: `${Date.now()}-${url}`, name: name || url.split('/').pop() || 'Item', url, type: url.endsWith('.pdf') ? 'application/pdf' : 'image/*', source: 'url' })
		setUrl('')
		setName('')
	}

	return (
		<div className="flex items-center gap-2">
			<input value={url} onChange={(e) => setUrl(e.target.value)} placeholder="Paste image/PDF URL" className="field rounded-md px-3 py-2 text-sm w-64" />
			<input value={name} onChange={(e) => setName(e.target.value)} placeholder="Optional name" className="field rounded-md px-3 py-2 text-sm w-40" />
			<button type="button" className="btn btn-outline text-xs" onClick={add}>Add by URL</button>
		</div>
	)
}



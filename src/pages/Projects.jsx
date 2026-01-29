import './Projects.css'
import { useEffect, useMemo, useState } from 'react'
import { useAuth } from '../hooks/useAuth'
import { listProjects, subscribeProjects, createProject, updateProject, deleteProject } from '../services/projects'

export default function Projects() {
	const { isAdmin } = useAuth()
	const [projects, setProjects] = useState([])
	const [showForm, setShowForm] = useState(false)
	const [editingIndex, setEditingIndex] = useState(-1)
	const [form, setForm] = useState({ title: '', desc: '', url: '', imageUrl: '' })
	const [imageFile, setImageFile] = useState(null)
	const [imageFrom, setImageFrom] = useState('upload') // upload | link

	useEffect(() => {
		// initial fetch
		listProjects().then(setProjects).catch(console.error)
		// realtime subscription
		const unsub = subscribeProjects(setProjects)
		return () => unsub()
	}, [])

	function openAdd() {
		setEditingIndex(-1)
		setForm({ title: '', desc: '', url: '', imageUrl: '' })
		setImageFile(null)
		setImageFrom('upload')
		setShowForm(true)
	}
	function openEdit(index) {
		const p = projects[index]
		setEditingIndex(index)
		setForm({ title: p.title || '', desc: p.desc || '', url: p.url || '', imageUrl: p.imageUrl || '' })
		setImageFile(null)
		setImageFrom(p.imageUrl ? 'link' : 'upload')
		setShowForm(true)
	}
	function onChange(e) {
		const { name, value, files } = e.target
		if (name === 'image' && files && files[0]) {
			setImageFile(files[0])
			return
		}
		setForm((f) => ({ ...f, [name]: value }))
	}
	async function saveForm(e) {
		e.preventDefault()
		const data = { title: form.title.trim(), desc: form.desc.trim(), url: form.url.trim(), imageUrl: form.imageUrl.trim() }
		if (!data.title || !data.desc || !data.url) return
		try {
			if (editingIndex >= 0) {
				const id = projects[editingIndex].id
				await updateProject(id, data, imageFile)
			} else {
				await createProject(data, imageFile)
			}
			setShowForm(false)
		} catch (err) {
			console.error(err)
		}
	}
	async function removeProject(index) {
		try {
			await deleteProject(projects[index].id)
		} catch (err) {
			console.error(err)
		}
	}

	return (
		<section className="section">
			<div className="container" data-reveal>
				<div className="flex items-center justify-between">
					<h1 className="section-title">Projects</h1>
					{isAdmin && (
						<div className="flex gap-2">
							<button className="btn" onClick={openAdd}>Add</button>
						</div>
					)}
				</div>

				<div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
					{projects.map((p, index) => (
						<div key={p.id || p.title + index} className="group card overflow-hidden relative project-card">
							<a href={p.url} target="_blank" rel="noreferrer">
								<div className="h-44 overflow-hidden project-thumb">
									<img src={p.imageUrl} alt={p.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
								</div>
								<div className="p-4 project-content">
									<h3 className="font-semibold group-hover:text-blue-400 transition-colors project-title">{p.title}</h3>
									<p className="muted text-sm mt-1 project-desc">{p.desc}</p>
								</div>
							</a>
							{isAdmin && (
								<div className="absolute top-3 right-3 flex gap-2">
									<button className="btn text-xs" onClick={() => openEdit(index)}>Edit</button>
									<button className="btn btn-outline text-xs" onClick={() => removeProject(index)}>Remove</button>
								</div>
							)}
						</div>
					))}
				</div>
			</div>

			{showForm && isAdmin && (
				<div className="fixed inset-0 z-50 flex items-center justify-center">
					<div className="absolute inset-0 bg-black/60" onClick={() => setShowForm(false)} />
					<form className="relative z-10 w-[90vw] max-w-lg card modal-card p-6 space-y-4" onSubmit={saveForm}>
						<h3 className="text-lg font-semibold">{editingIndex >= 0 ? 'Edit Project' : 'Add Project'}</h3>
						<div className="flex items-center gap-3 text-sm">
							<label className="inline-flex items-center gap-2">
								<input type="radio" name="imageFrom" checked={imageFrom==='upload'} onChange={() => setImageFrom('upload')} /> Upload
							</label>
							<label className="inline-flex items-center gap-2">
								<input type="radio" name="imageFrom" checked={imageFrom==='link'} onChange={() => setImageFrom('link')} /> Image URL
							</label>
						</div>
						{imageFrom === 'upload' ? (
							<div>
								<label className="block text-sm mb-1">Project Image</label>
								<input name="image" type="file" accept="image/*" className="field w-full" onChange={onChange} />
								<p className="muted text-xs mt-1">Images are uploaded to local server storage.</p>
							</div>
						) : (
							<div>
								<label className="block text-sm mb-1">Image URL</label>
								<input name="imageUrl" className="field w-full" value={form.imageUrl} onChange={onChange} placeholder="https://..." />
							</div>
						)}
						<div>
							<label className="block text-sm mb-1">Project Name</label>
							<input name="title" className="field w-full" value={form.title} onChange={onChange} placeholder="Enter name" />
						</div>
						<div>
							<label className="block text sm mb-1">Description</label>
							<textarea name="desc" className="field w-full" rows="3" value={form.desc} onChange={onChange} placeholder="Enter description" />
						</div>
						<div>
							<label className="block text-sm mb-1">Project Link</label>
							<input name="url" className="field w-full" value={form.url} onChange={onChange} placeholder="https://..." />
						</div>
						<div className="flex justify-end gap-2 pt-2">
							<button type="button" className="btn btn-outline" onClick={() => setShowForm(false)}>Cancel</button>
							<button type="submit" className="btn btn-primary">Save</button>
						</div>
					</form>
				</div>
			)}
		</section>
	)
}




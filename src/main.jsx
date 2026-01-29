import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import faviconUrl from './assets/icon.png'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)

// Scroll reveal and progress bars
function initRevealAnimations() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('show')
        // Animate progress bars inside
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

  document.querySelectorAll('[data-reveal]').forEach((el) => {
    observer.observe(el)
    // If already in view on load, reveal immediately
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

// Run after hydration and on full load to ensure elements exist
requestAnimationFrame(initRevealAnimations)
window.addEventListener('load', initRevealAnimations)

// Smooth scroll with easing and focus highlight
function smoothScrollTo(target) {
  const headerOffset = 80
  const element = document.getElementById(target)
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
    else {
      element.classList.add('section-focus')
      setTimeout(() => element.classList.remove('section-focus'), 700)
    }
  }
  requestAnimationFrame(animation)
}

document.addEventListener('click', (e) => {
  const a = e.target.closest('a[href^="#"]')
  if (!a) return
  const id = a.getAttribute('href')?.slice(1)
  if (!id) return
  const el = document.getElementById(id)
  if (!el) return
  e.preventDefault()
  smoothScrollTo(id)
})

// Update favicon to custom icon
;(function setFavicon() {
  const head = document.querySelector('head')
  if (!head) return
  let link = document.querySelector('link[rel="icon"]')
  if (!link) {
    link = document.createElement('link')
    link.setAttribute('rel', 'icon')
    head.appendChild(link)
  }
  link.setAttribute('href', faviconUrl)
})()

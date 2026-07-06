export function makeDraggable(element, options = {}) {
    if (!element) return
    const cancelSelector = options.cancel || 'button, a, input, textarea, select, label'
    let dragging = false
    let offsetX = 0
    let offsetY = 0

    function getElementRect(el) {
        const rect = el.getBoundingClientRect()
        return {
            left: rect.left,
            top: rect.top,
            width: rect.width,
            height: rect.height,
        }
    }

    function startDrag(event) {
        if (event.button !== 0) return
        if (event.target.closest(cancelSelector)) return
        if (element.classList.contains('hidden')) return

        event.preventDefault()
        const rect = getElementRect(element)
        offsetX = event.clientX - rect.left
        offsetY = event.clientY - rect.top

        element.style.position = 'fixed'
        element.style.left = `${rect.left}px`
        element.style.top = `${rect.top}px`
        element.style.transform = 'none'
        element.style.zIndex = String(options.zIndex || 10000)

        dragging = true
    }

    function onMove(event) {
        if (!dragging) return
        event.preventDefault()
        const x = event.clientX - offsetX
        const y = event.clientY - offsetY

        if (options.containment === 'window') {
            const maxX = window.innerWidth - element.offsetWidth
            const maxY = window.innerHeight - element.offsetHeight
            element.style.left = `${Math.min(Math.max(0, x), maxX)}px`
            element.style.top = `${Math.min(Math.max(0, y), maxY)}px`
        } else {
            element.style.left = `${x}px`
            element.style.top = `${y}px`
        }
    }

    function endDrag() {
        dragging = false
    }

    element.addEventListener('mousedown', startDrag)
    window.addEventListener('mousemove', onMove)
    window.addEventListener('mouseup', endDrag)
}

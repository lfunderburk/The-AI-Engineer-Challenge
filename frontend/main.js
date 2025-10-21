const sendBtn = document.getElementById('send')
const clearBtn = document.getElementById('clear')
const responseEl = document.getElementById('response')

sendBtn.addEventListener('click', async () => {
  responseEl.textContent = ''
  const developer_message = document.getElementById('developer_message').value
  const user_message = document.getElementById('user_message').value
  const model = document.getElementById('model').value
  const api_key = document.getElementById('api_key').value

  if (!user_message.trim()) {
    responseEl.textContent = 'Please enter a user message.'
    return
  }

  const body = { developer_message, user_message, model, api_key }

  try {
    // If the frontend is served from a static file server (different origin),
    // target the backend at localhost:8000 where the FastAPI app runs.
  const origin = (location && location.origin && location.origin !== 'null') ? location.origin : 'http://localhost:5173'
  // If page is served from a dev static server (port 5173) or localhost addresses,
  // force the backend to the local FastAPI server at localhost:8000.
  const host = (location && location.hostname) ? location.hostname : 'localhost'
  const port = (location && location.port) ? location.port : ''
  const localhostNames = ['localhost', '127.0.0.1', '::1', '[::1]']
  const useLocalBackend = localhostNames.includes(host) || port === '5173'
  const backend = useLocalBackend ? 'http://localhost:8000' : origin
  const url = backend.replace(/\/$/, '') + '/api/chat'
  // Helpful debug for the browser console to confirm which backend URL is used
  console.debug('frontend: posting to', url)

    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    })

    if (!res.ok) {
      const txt = await res.text()
      responseEl.textContent = `Error ${res.status}: ${txt}`
      return
    }

    const reader = res.body.getReader()
    const decoder = new TextDecoder()
    let done = false
    while (!done) {
      const { value, done: d } = await reader.read()
      done = d
      if (value) {
        responseEl.textContent += decoder.decode(value)
        window.scrollTo(0, document.body.scrollHeight)
      }
    }
  } catch (err) {
  responseEl.textContent = 'Fetch error: ' + err.message + '\n\nTip: If you are serving the frontend with a static server (python -m http.server), that server cannot proxy POST requests — start the backend with `uvicorn api.app:app` and ensure the frontend uses `http://localhost:8000`.'
  }
})

clearBtn.addEventListener('click', () => {
  document.getElementById('developer_message').value = ''
  document.getElementById('user_message').value = ''
  responseEl.textContent = ''
})

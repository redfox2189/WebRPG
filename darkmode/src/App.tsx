import { useState } from 'react'
import { useEffect } from 'react'
import './App.css'

function App() {
const [darkMode, setDarkMode] = useState(false)

useEffect(() => {
  const body = document.body
  if (darkMode) {
    body.classList.add('dark')
  } else {
    body.classList.remove('dark')
  }
}, [darkMode])

  return (<>
    <button id="DarkModeBtn" onClick={() => setDarkMode(prev => !prev)}>Toggle Dark Mode</button>
  </>)
}
export default App

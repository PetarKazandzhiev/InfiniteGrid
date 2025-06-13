import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'

function App() {
  const [count, setCount] = useState(0)
  return (
    <div className="text-center p-6">
      <div className="flex justify-center gap-4">
        <a href="https://vite.dev" target="_blank" rel="noreferrer">
          <img src={viteLogo} className="h-24" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank" rel="noreferrer">
          <img src={reactLogo} className="h-24 animate-spin-slow" alt="React logo" />
        </a>
      </div>
      <h1 className="text-3xl font-bold my-4">Vite + React</h1>
      <div className="my-4">
        <button
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          onClick={() => setCount((c) => c + 1)}
        >
          count is {count}
        </button>
        <p className="mt-2">Edit <code>src/App.jsx</code> and save to test HMR</p>
      </div>
      <p className="text-gray-500">Click on the Vite and React logos to learn more</p>
    </div>
  )
}

export default App

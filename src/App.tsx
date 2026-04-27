import { BrowserRouter } from 'react-router-dom'
import AppRoutes from './routes/AppRoutes'
import './App.css'
import { SkillsProvider } from './hooks/useSkillsManager'

function App() {
  return (
    <SkillsProvider>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </SkillsProvider>
  )
}

export default App
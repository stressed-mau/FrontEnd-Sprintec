import { BrowserRouter } from 'react-router-dom'
import AppRoutes from './routes/AppRoutes'
import './App.css'
import { SkillsProvider } from './hooks/skills/useSkillsManager'
import ScrollToTop from './components/ScrollToTop'

function App() {
  return (
    <SkillsProvider>
      <BrowserRouter>
        <ScrollToTop />
        <AppRoutes />
        <div id="page-end" aria-hidden="true" />
      </BrowserRouter>
    </SkillsProvider>
  )
}

export default App
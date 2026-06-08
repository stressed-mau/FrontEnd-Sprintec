import { BrowserRouter } from 'react-router-dom'
import AppRoutes from './routes/AppRoutes'
import './App.css'
import { SkillsProvider } from './hooks/skills/useSkillsManager'
import ScrollToTop from './components/ScrollToTop'
import ScrollDownButton from './components/ScrollDownButton'

function App() {
  return (
    <SkillsProvider>
      <BrowserRouter>
        <ScrollToTop />
        <AppRoutes />
        <div id="page-end" aria-hidden="true" />
        <ScrollDownButton />
      </BrowserRouter>
    </SkillsProvider>
  )
}

export default App
import { BrowserRouter } from 'react-router-dom'
import AppRoutes from './routes/AppRoutes'
import './App.css'
import { SkillsProvider } from './hooks/useSkillsManager'
import ScrollToTop from './components/ScrollToTop'

function App() {
  return (
    <SkillsProvider>
      <BrowserRouter>
        <ScrollToTop />
        <AppRoutes />
      </BrowserRouter>
    </SkillsProvider>
  )
}

export default App
import { Routes, Route } from 'react-router-dom'
import HomeVisitor from '../pages/HomeVisitor'

function AppRoutes() {
  return (
    <Routes>
      <Route path="/visitor" element={<HomeVisitor />} />
    </Routes>
  )
}

export default AppRoutes
import { HashRouter,Routes,Route } from 'react-router'
import './App.css'
import { LoginPage } from './LoginPage'
import { RegisterPage } from './RegisterPage'
import { Home } from './Home'
function App() {

  return (
    <HashRouter>
      <Routes>
        <Route path='/' element={<Home/>}/>
        <Route path='/Login' element={<LoginPage/>}/>
        <Route path='/RegisterPage' element={<RegisterPage/>}/>
        
      </Routes>
    </HashRouter>
  )
}

export default App

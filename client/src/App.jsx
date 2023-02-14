import './App.css';
import Navbar from './Components/Navbar';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Play from './Pages/Play.jsx'
import Leaderboard from './Pages/Leaderboard'
import PrivacyPolicy from './Pages/Privacypolicy'
import Signup from './Pages/Sign-up'
import TermsandConditions from './Pages/TermsandConditions'
import Account from './Pages/AccountPage'
import Footer from './Components/Footer';

function App() {
  return (
    <>
      <Router>
        <Navbar />
          <Routes>
            <Route path='/' exact />
            <Route path='/Play' element={<Play/>} />
            <Route path='/Leaderboard' element={<Leaderboard/>} />
            <Route path='/PrivacyPolicy' element={<PrivacyPolicy/>} />
            <Route path='/Sign-up' element={<Signup/>} />
            <Route path='/TermsandConditions' element={<TermsandConditions/>} />
            <Route path='/AccountPage' element={<Account/>} />
          </Routes>
        <Footer />

        
      </Router>
    </>
  );
} 

export default App;

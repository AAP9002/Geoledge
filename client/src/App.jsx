import './App.css';
import Navbar from './Components/Navbar';
import { BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import Play from './Pages//Play/Play'
import Leaderboard from './Pages/Leaderboards/Leaderboard'
import PrivacyPolicy from './Pages/Ts&Cs/Privacypolicy'
import Signup from './Pages/Sign-up/Sign-up'
import TermsandConditions from './Pages/Ts&Cs/TermsandConditions'
import Account from './Pages/Account/AccountPage'
import Footer from './Components/Footer';
import Home from './Pages/Home/Home'
<<<<<<< HEAD
import JoinLobby from './JoinLobby';

=======
import JoinLobby from './Pages/JoinLobby/JoinLobby';
>>>>>>> 584c2f73775fc45d8965115decf8efce3241e6e3

function App() {
  return (
    <>
      <Router>
       
        <Navbar />
           <div className='App'>
            <Routes>
            <Route exact path='/' element={<Home/>} />
            <Route path='/Home' element={<Home/>} />
            <Route path='/Play' element={<Play/>} />
            <Route path='/Leaderboard' element={<Leaderboard/>} />
            <Route path='/PrivacyPolicy' element={<PrivacyPolicy/>} />
            <Route path='/Sign-up' element={<Signup/>} />
            <Route path='/join-lobby' element={<JoinLobby/>} />
            <Route path='/TermsandConditions' element={<TermsandConditions/>} />
            <Route path='/AccountPage' element={<Account/>} />
            <Route path='/JoinLobby' element={<JoinLobby/>}/>
          </Routes>
        </div>
        <Footer />
      
        
      </Router>
    </>
  );
} 

export default App;

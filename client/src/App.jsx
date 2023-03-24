import './App.css';
import Navbar from './Components/Navbar';
import { HashRouter as Router, Routes, Route} from 'react-router-dom';
import Play from './Pages//Play/Play'
import Leaderboard from './Pages/Leaderboards/Leaderboard'
import PrivacyPolicy from './Pages/Ts&Cs/Privacypolicy'
import Signup from './Pages/Sign-up/Sign-up'
import TermsandConditions from './Pages/Ts&Cs/TermsandConditions'
import Account from './Pages/Account/AccountPage'
import Footer from './Components/Footer';
import Home from './Pages/Home/Home'
import JoinLobby from './Pages/JoinLobby/JoinLobby';
import LoginPage from './Pages/Sign-up/LoginPage.jsx'
import Game from './Pages/Gameloop/Game';
import background from './Pages/Home/starry2.png'
import HowToPlay from './Pages/HowToPlay/HowToPlay.jsx'


function App() {
  
  return (
    <>
    <img className='' id='app_background_image' src={background}></img>
      <Router>
           <div className='App'>
           {(window.location.href.includes('/Game'))||(window.location.href.includes('Play'))? null: <Navbar /> }

            <Routes>
            <Route exact path='/' element={<Home/>} />
            <Route path='/Home' element={<Home/>} />
            <Route path='/Play/:sessionID' element={<Play/>} />
            <Route path='/Leaderboard' element={<Leaderboard/>} />
            <Route path='/PrivacyPolicy' element={<PrivacyPolicy/>} />
            <Route path='/Sign-up' element={<Signup/>} />
            <Route path='/Log-in' element={<LoginPage/>} />
            <Route path='/join-lobby' element={<JoinLobby/>} />
            <Route path='/TermsandConditions' element={<TermsandConditions/>} />
            <Route path='/AccountPage' element={<Account/>} />
            <Route path='/JoinLobby' element={<JoinLobby/>}/>
            <Route path='/HowToPlay' element={<HowToPlay/>}/>
            <Route path='/Game' element={<Game/>}/>
          </Routes>
        </div>
        {(window.location.href.includes('/Game'))||(window.location.href.includes('Play'))?  null:<Footer /> }      

      </Router>
    </>
  );
} 

export default App;

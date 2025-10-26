import { Link, NavLink } from 'react-router-dom'
import { useNavigate } from 'react-router'
import { useSelector } from 'react-redux'
import { useEffect, useState } from 'react'
import { showErrorMsg, showSuccessMsg } from '../services/event-bus.service'
import { logout } from '../store/actions/user.actions'
import { StayFilter } from './StayFilter'
import MenuIcon from '@mui/icons-material/Menu';
import { LoginSignupModal } from './LoginSignupModal';
import { useObserver } from "../customHooks/useObserver";
import { useWindowSize } from '../customHooks/useWindowSize'

export function AppHeader() {
	const [isMenuOpen, setIsMenuOpen] = useState(false)
	const user = useSelector(storeState => storeState.userModule.user)
	const navigate = useNavigate()
	const [isLoginModalOpen, setIsLoginModalOpen] = useState(false)
	const [isOnViewPort, observeRef] = useObserver();
	const {width} = useWindowSize();


	

	async function onLogout() {
		try {
			await logout()
			navigate('/')
			showSuccessMsg(`Bye now`)
		} catch (err) {
			showErrorMsg('Cannot logout')
		}
	}

	function toggleMenu() {
		setIsMenuOpen(prev => !prev)
	}

	function openLoginModal() {
		setIsLoginModalOpen(true)
		setIsMenuOpen(false)
	}

	function closeLoginModal() {
		setIsLoginModalOpen(false)
	}
	console.log('header: ', isOnViewPort);
	

	return (
		<>
		<div ref={observeRef}></div>
		<header className="app-header full wrap ">
			<div className='main-header flex'>
				<Link to="/" className='logo not-mobile-item'>
					<img src='public\img\airbnb-icon.svg' alt="Airbnb" /><span>airbnb</span>
				</Link>

				{isOnViewPort && <StayFilter isOnViewPort={isOnViewPort} className='flex align-center'/>}

				<div className='flex align-center not-mobile-item'>
					<a href="/">Become a host</a>
					{ user && (
						<button className='btn-account' >{`${user.fullname[0]}`}</button>
					)}
					<button className='btn-menu' onClick={toggleMenu}><MenuIcon/></button>
				</div>
			</div>

			{!isOnViewPort && <StayFilter isOnViewPort={isOnViewPort} className='flex align-center'/>}



			{isMenuOpen && (
				<>
					<div className="menu-overlay" onClick={toggleMenu}></div>
					<div className="side-menu">
						<nav className="side-menu-nav">
							{user && (
								<>
									<Link to="/wishlist" onClick={toggleMenu}>Wishlists</Link>
									<Link to="/trips" onClick={toggleMenu}>Trips</Link>
									<Link to="/messages" onClick={toggleMenu}>Messages</Link>
									<Link to="/trips" onClick={toggleMenu}>Profile</Link>
									<hr />
									<Link to="/trips" onClick={toggleMenu}>Account settings</Link>
									<Link to="/trips" onClick={toggleMenu}>Languages & currency</Link>
									<hr />
								</>
							)}

							<Link to="/help" onClick={toggleMenu}>Help Center</Link>
							<hr />
							<Link to="" onClick={toggleMenu}>
								Become a host
								<p>it's easy to start hosting and earn extra income.</p>
							</Link>
							{/* <Link to="/account" onClick={toggleMenu}>Account</Link> */}
							<hr />
							<Link to="" onClick={toggleMenu}>Refer a host</Link>
							<Link to="" onClick={toggleMenu}>Find a co-host</Link>
							<Link to="" onClick={toggleMenu}>Gift cards</Link>
							<hr />
							{user ? (
								<button onClick={() => { onLogout(); toggleMenu(); }}>Log out</button>
							) : (
								<button onClick={openLoginModal}>
									Log in or sign up
								</button>
							)}
						</nav>
					</div>
				</>
			)}

			{isLoginModalOpen && (
				<LoginSignupModal onClose={closeLoginModal} />
			)}
		</header>
		</>
	)
}

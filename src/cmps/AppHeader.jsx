import { Link, NavLink } from 'react-router-dom'
import { useNavigate } from 'react-router'
import { useSelector } from 'react-redux'
import { useEffect, useState } from 'react'
import { showErrorMsg, showSuccessMsg } from '../services/event-bus.service'
import { logout } from '../store/actions/user.actions'
import { StayFilter } from './StayFilter'
import MenuIcon from '@mui/icons-material/Menu';
import { LoginSignupModal } from './LoginSignupModal';

export function AppHeader() {
	const [isMenuOpen, setIsMenuOpen] = useState(false)
	const user = useSelector(storeState => storeState.userModule.user)
	const navigate = useNavigate()
	const [isLoginModalOpen, setIsLoginModalOpen] = useState(false)

	

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
	

	return (
		<header className="app-header full">
			<Link to="/" className='logo'>
				<img src='public\img\airbnb-icon.svg' alt="Airbnb" /><span>airbnb</span>
			</Link>

			<div className='flex align-center'>
				{/* filter */}
				<StayFilter/>
			</div>
			
			<div className='flex align-center'>
				<a href="/">Become a host</a>
				{ user && (
					<button className='btn-account' >{`${user.fullname[0]}`}</button>
				)}
				<button className='btn-menu' onClick={toggleMenu}><MenuIcon/></button>
			</div>

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
	)
}

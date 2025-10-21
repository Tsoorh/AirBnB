import { Link, NavLink } from 'react-router-dom'
import { useNavigate } from 'react-router'
import { useSelector } from 'react-redux'
import { showErrorMsg, showSuccessMsg } from '../services/event-bus.service'
import { logout } from '../store/actions/user.actions'
import { StayFilter } from './StayFilter'
import MenuIcon from '@mui/icons-material/Menu';

export function AppHeader() {
	// const user = useSelector(storeState => storeState.userModule.user)
	// const navigate = useNavigate()

	async function onLogout() {
		try {
			await logout()
			navigate('/')
			showSuccessMsg(`Bye now`)
		} catch (err) {
			showErrorMsg('Cannot logout')
		}
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
				<MenuIcon/>
			</div>
		</header>
	)
}

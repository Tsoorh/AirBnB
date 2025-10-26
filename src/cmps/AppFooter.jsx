import { useSelector } from 'react-redux'
import { useLocation } from 'react-router-dom'

export function AppFooter() {
	const location = useLocation()
	const count = useSelector(storeState => storeState.userModule.count)

	// Don't show footer on become-host page
	if (location.pathname === '/become-host') {
		return null
	}

	return (
		<footer className="app-footer full">
			<p>Coffeerights &copy;  </p>
			<p>Count: {count}</p>
            
            {import.meta.env.VITE_LOCAL ? 
                <span className="local-services">Local Services</span> : 
                <span className="remote-services">Remote Services</span>}
		</footer>
	)
}
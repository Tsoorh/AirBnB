import { Link } from 'react-router-dom'

export function StayPreview({ Stay }) {
    return <article className="Stay-preview">
        <header>
            <Link to={`/Stay/${Stay._id}`}>{Stay.vendor}</Link>
        </header>

        <p>Speed: <span>{Stay.speed.toLocaleString()} Km/h</span></p>
        {Stay.owner && <p>Owner: <span>{Stay.owner.fullname}</span></p>}
        
    </article>
}
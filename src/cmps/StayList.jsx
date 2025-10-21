import { StayPreview } from './StayPreview'
import PropTypes from 'prop-types'

export function StayList({ stays }) {
    if (!stays || stays.length === 0) {
        return (
            <div className="stays-grid-empty">
                <h2>No stays available</h2>
                <p>Check back later for new listings</p>
            </div>
        )
    }

    return (
        <section className="stays-section">
            <div className="stays-grid">
                {stays.map(stay => (
                    <div key={stay._id} className="stay-card">
                        <StayPreview stay={stay}/>
                    </div>
                ))}
            </div>
        </section>
    )
}

StayList.propTypes = {
    stays: PropTypes.arrayOf(PropTypes.object)
}


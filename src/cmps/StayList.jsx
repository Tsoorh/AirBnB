import { StayPreview } from './StayPreview'
import PropTypes from 'prop-types'

export function StayList({ stays }) {
    return (
        <div className="stays-horizontal-scroll">
            {stays.map(stay => (
                <div key={stay._id} className="stay-card">
                    <StayPreview stay={stay}/>
                </div>
            ))}
        </div>
    )
}

StayList.propTypes = {
    stays: PropTypes.arrayOf(PropTypes.object).isRequired
}


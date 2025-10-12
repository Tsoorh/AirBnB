import { StayPreview } from './StayPreview'

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
                {stays.map(Stay => (
                    <div key={Stay._id} className="stay-card">
                        <StayPreview Stay={Stay}/>
                    </div>
                ))}
            </div>
        </section>
    )
}
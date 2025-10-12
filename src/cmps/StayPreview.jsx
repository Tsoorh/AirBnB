export function StayPreview({ Stay }) {
    const price = Math.floor(Math.random() * 200) + 50
    
    return (
        <article className="stay-preview">
            <div className="stay-content">
                <div className="stay-image">
                    <img 
                        src={Stay.imgUrls?.[0] || '/img/sunflowers.jpg'} 
                        alt={Stay.name || Stay.vendor}
                    />
                </div>
                
                <div className="stay-info">
                    <h3>{Stay.name || Stay.vendor}</h3>
                    <p className="stay-location">{Stay.loc?.city || 'Tel Aviv'}, {Stay.loc?.country || 'Israel'}</p>
                    <p className="stay-price">${price} / night</p>
                </div>
            </div>
        </article>
    )
}
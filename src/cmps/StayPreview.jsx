import PropTypes from 'prop-types'

export function StayPreview({ Stay }) {
    const price = Stay.price?.base || 0
    
    return (
        <article className="stay-preview">
            <div className="stay-content">
                <div className="stay-image">
                    <img 
                        src={Stay.imgUrls?.[0] || '/img/sunflowers.jpg'} 
                        alt={Stay.name}
                    />
                </div>
                
                <div className="stay-info">
                    <h3>{Stay.name}</h3>
                    <p className="stay-location">{Stay.loc?.city || 'Tel Aviv'}, {Stay.loc?.country || 'Israel'}</p>
                    <p className="stay-price">₪{price} / night</p>
                </div>
            </div>
        </article>
    )
}

StayPreview.propTypes = {
    Stay: PropTypes.shape({
        _id: PropTypes.string,
        name: PropTypes.string,
        imgUrls: PropTypes.arrayOf(PropTypes.string),
        price: PropTypes.shape({
            base: PropTypes.number,
            currency: PropTypes.string
        }),
        loc: PropTypes.shape({
            city: PropTypes.string,
            country: PropTypes.string
        })
    }).isRequired
}

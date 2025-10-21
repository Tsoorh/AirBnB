import PropTypes from 'prop-types'
import { Link, useSearchParams } from 'react-router-dom'

export function StayPreview({ stay }) {
    const price = stay.price?.base || 0
    const [searchParams] = useSearchParams()  
    
    return (
        <Link to={`/stay/${stay._id}?${searchParams.toString()}`} className="stay-preview-link">
            <article className="stay-preview">
                <div className="stay-content">
                    <div className="stay-image">
                        <img 
                            src={stay.imgUrls?.[0] || '/img/sunflowers.jpg'} 
                            alt={stay.name}
                        />
                    </div>
                    
                    <div className="stay-info">
                        <h3>{stay.name}</h3>
                        <p className="stay-location">{stay.loc?.city || 'Tel Aviv'}, {stay.loc?.country || 'Israel'}</p>
                        <p className="stay-price">₪{price} / night</p>
                    </div>
                </div>
            </article>
        </Link>
    )
}

StayPreview.propTypes = {
    stay: PropTypes.shape({
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

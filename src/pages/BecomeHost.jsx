import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { showErrorMsg, showSuccessMsg } from '../services/event-bus.service.js'
import { LoginSignupModal } from '../cmps/LoginSignupModal.jsx'
import { uploadService } from '../services/upload.service.js'
import { addStay } from '../store/actions/stay.actions.js'
import { getEmptyStay } from '../services/stay/index.js'
import MenuIcon from '@mui/icons-material/Menu'
import '../assets/styles/cmps/BecomeHost.css'

export function BecomeHost() {
    const user = useSelector(storeState => storeState.userModule.user)
    const [isLoginModalOpen, setIsLoginModalOpen] = useState(false)
    const [stay, setStay] = useState({
        name: '',
        type: '',
        summary: '',
        imgUrls: [],
        price: {
            base: 0,
            currency: 'ILS',
            cleaningFee: 0,
            serviceFeePct: 0.12
        },
        capacity: {
            guests: 1,
            bedrooms: 1,
            beds: 1,
            bathrooms: 1
        },
        amenities: [],
        loc: {
            country: '',
            countryCode: '',
            city: '',
            address: '',
            lat: null,
            lng: null
        },
        checkIn: {
            from: '15:00',
            to: '22:00'
        },
        checkOut: {
            by: '11:00'
        },
        houseRules: []
    })

    const [selectedAmenities, setSelectedAmenities] = useState([])
    const [uploadingImages, setUploadingImages] = useState(false)
    const navigate = useNavigate()

    const availableAmenities = [
        'Wifi', 'Kitchen', 'Parking', 'Air conditioning', 'Heating', 'Washer', 'Dryer', 'TV', 'Pool', 'Hot tub', 'Gym', 'Pet friendly', 'Smoking allowed', 'Elevator', 'Breakfast'
    ]

    function handleChange(ev) {
        const { name, value } = ev.target
        setStay(prevStay => ({ ...prevStay, [name]: value }))
    }

    function handleNestedChange(ev, section) {
        const { name, value } = ev.target
        setStay(prevStay => ({
            ...prevStay,
            [section]: {
                ...prevStay[section],
                [name]: value
            }
        }))
    }

    function handleNumberChange(ev, section) {
        const { name, value } = ev.target
        setStay(prevStay => ({
            ...prevStay,
            [section]: {
                ...prevStay[section],
                [name]: parseInt(value) || 0
            }
        }))
    }

    function handleAmenityToggle(amenity) {
        setSelectedAmenities(prev => 
            prev.includes(amenity) 
                ? prev.filter(a => a !== amenity)
                : [...prev, amenity]
        )
    }

    async function handleImageUpload(ev) {
        setUploadingImages(true)
        try {
            const { secure_url } = await uploadService.uploadImg(ev)
            setStay(prevStay => ({
                ...prevStay,
                imgUrls: [...prevStay.imgUrls, secure_url]
            }))
        } catch (err) {
            console.error('Failed to upload image:', err)
            showErrorMsg('Failed to upload image')
        } finally {
            setUploadingImages(false)
        }
    }

    function handleImageRemove(index) {
        setStay(prevStay => ({
            ...prevStay,
            imgUrls: prevStay.imgUrls.filter((_, i) => i !== index)
        }))
    }

    function handleHouseRuleAdd(ev) {
        ev.preventDefault()
        const rule = ev.target.rule.value
        if (rule && !stay.houseRules.includes(rule)) {
            setStay(prevStay => ({
                ...prevStay,
                houseRules: [...prevStay.houseRules, rule]
            }))
            ev.target.rule.value = ''
        }
    }

    function handleHouseRuleRemove(rule) {
        setStay(prevStay => ({
            ...prevStay,
            houseRules: prevStay.houseRules.filter(r => r !== rule)
        }))
    }

    async function handleSubmit(ev) {
        ev.preventDefault()
        
        if (!user) {
            setIsLoginModalOpen(true)
            return
        }

        if (!stay.name || !stay.type || !stay.summary || stay.imgUrls.length === 0) {
            showErrorMsg('Please fill in all required fields')
            return
        }

        try {
            const newStay = {
                ...getEmptyStay(),
                ...stay,
                amenities: selectedAmenities,
                host: {
                    _id: user._id,
                    fullname: user.fullname,
                    picture: user.imgUrl || '',
                    isSuperhost: false
                }
            }
            
            const savedStay = await addStay(newStay)
            showSuccessMsg('Property added successfully!')
            navigate(`/stay/${savedStay._id}`)
        } catch (err) {
            console.error('Error adding stay:', err)
            showErrorMsg('Failed to add property')
        }
    }

    function openLoginModal() {
        setIsLoginModalOpen(true)
    }

    function closeLoginModal() {
        setIsLoginModalOpen(false)
    }

    return (
        <div className="become-host-page">
            {!user && isLoginModalOpen && (
                <LoginSignupModal onClose={closeLoginModal} />
            )}

            <header className="simple-header">
                <Link to="/" className='logo'>
                    <img src='public\img\airbnb-icon.svg' alt="Airbnb" />
                    <span>airbnb</span>
                </Link>
                
                <div className='header-right'>
                    <Link to="/become-host">Become a host</Link>
                    {user && (
                        <button className='btn-account'>{`${user.fullname[0]}`}</button>
                    )}
                    <button className='btn-menu'><MenuIcon/></button>
                </div>
            </header>

            <div className="host-container">
                <div className="host-card">
                    <h1 className="host-title">Register Your Property</h1>
                    <p className="host-subtitle">Welcome to Airbnb hosting!</p>

                    {!user && (
                        <div className="login-prompt">
                            <p>You need to be logged in to register a property.</p>
                            <button className="host-login-btn" onClick={openLoginModal}>
                                Log in or Sign up
                            </button>
                        </div>
                    )}

                    {user && (
                        <form onSubmit={handleSubmit} className="host-form">
                            <section className="form-section">
                                <h2>Basic Information</h2>
                                
                                <div className="form-group">
                                    <label htmlFor="name">Property Title *</label>
                                    <input
                                        type="text"
                                        id="name"
                                        name="name"
                                        value={stay.name}
                                        onChange={handleChange}
                                        placeholder="Sunny Loft in Neve Tzedek"
                                        required
                                    />
                                </div>

                                <div className="form-group">
                                    <label htmlFor="type">Property Type *</label>
                                    <select
                                        id="type"
                                        name="type"
                                        value={stay.type}
                                        onChange={handleChange}
                                        required
                                    >
                                        <option value="">Select type</option>
                                        <option value="Apartment">Apartment</option>
                                        <option value="House">House</option>
                                        <option value="Villa">Villa</option>
                                        <option value="Studio">Studio</option>
                                        <option value="Loft">Loft</option>
                                        <option value="Cabin">Cabin</option>
                                    </select>
                                </div>

                                <div className="form-group">
                                    <label htmlFor="summary">Description *</label>
                                    <textarea
                                        id="summary"
                                        name="summary"
                                        value={stay.summary}
                                        onChange={handleChange}
                                        placeholder="Describe your property..."
                                        rows="4"
                                        required
                                    />
                                </div>
                            </section>

                            <section className="form-section">
                                <h2>Photos</h2>
                                <div className="form-group">
                                    <label htmlFor="image-upload">Upload Photos *</label>
                                    <input
                                        type="file"
                                        id="image-upload"
                                        accept="image/*"
                                        onChange={handleImageUpload}
                                        disabled={uploadingImages}
                                    />
                                    {uploadingImages && <p className="upload-status">Uploading...</p>}
                                </div>
                                <div className="image-preview-grid">
                                    {stay.imgUrls.map((url, index) => (
                                        <div key={index} className="image-preview-item">
                                            <img src={url} alt={`Upload ${index + 1}`} />
                                            <button
                                                type="button"
                                                className="remove-image-btn"
                                                onClick={() => handleImageRemove(index)}
                                            >
                                                ×
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </section>

                            <section className="form-section">
                                <h2>Location</h2>
                                
                                <div className="form-group">
                                    <label htmlFor="city">City *</label>
                                    <input
                                        type="text"
                                        id="city"
                                        name="city"
                                        value={stay.loc.city}
                                        onChange={(e) => handleNestedChange(e, 'loc')}
                                        placeholder="Tel Aviv-Yafo"
                                        required
                                    />
                                </div>

                                <div className="form-group">
                                    <label htmlFor="address">Address *</label>
                                    <input
                                        type="text"
                                        id="address"
                                        name="address"
                                        value={stay.loc.address}
                                        onChange={(e) => handleNestedChange(e, 'loc')}
                                        placeholder="Shabazi 23"
                                        required
                                    />
                                </div>

                                <div className="form-row">
                                    <div className="form-group">
                                        <label htmlFor="country">Country *</label>
                                        <input
                                            type="text"
                                            id="country"
                                            name="country"
                                            value={stay.loc.country}
                                            onChange={(e) => handleNestedChange(e, 'loc')}
                                            placeholder="Israel"
                                            required
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="countryCode">Country Code</label>
                                        <input
                                            type="text"
                                            id="countryCode"
                                            name="countryCode"
                                            value={stay.loc.countryCode}
                                            onChange={(e) => handleNestedChange(e, 'loc')}
                                            placeholder="IL"
                                        />
                                    </div>
                                </div>
                            </section>

                            <section className="form-section">
                                <h2>Capacity</h2>
                                
                                <div className="form-row">
                                    <div className="form-group">
                                        <label htmlFor="guests">Guests *</label>
                                        <input
                                            type="number"
                                            id="guests"
                                            name="guests"
                                            value={stay.capacity.guests}
                                            onChange={(e) => handleNumberChange(e, 'capacity')}
                                            min="1"
                                            required
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="bedrooms">Bedrooms *</label>
                                        <input
                                            type="number"
                                            id="bedrooms"
                                            name="bedrooms"
                                            value={stay.capacity.bedrooms}
                                            onChange={(e) => handleNumberChange(e, 'capacity')}
                                            min="1"
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="form-row">
                                    <div className="form-group">
                                        <label htmlFor="beds">Beds *</label>
                                        <input
                                            type="number"
                                            id="beds"
                                            name="beds"
                                            value={stay.capacity.beds}
                                            onChange={(e) => handleNumberChange(e, 'capacity')}
                                            min="1"
                                            required
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="bathrooms">Bathrooms *</label>
                                        <input
                                            type="number"
                                            id="bathrooms"
                                            name="bathrooms"
                                            value={stay.capacity.bathrooms}
                                            onChange={(e) => handleNumberChange(e, 'capacity')}
                                            min="1"
                                            required
                                        />
                                    </div>
                                </div>
                            </section>

                            <section className="form-section">
                                <h2>Pricing</h2>
                                
                                <div className="form-row">
                                    <div className="form-group">
                                        <label htmlFor="base">Price per night (₪) *</label>
                                        <input
                                            type="number"
                                            id="base"
                                            name="base"
                                            value={stay.price.base}
                                            onChange={(e) => handleNumberChange(e, 'price')}
                                            min="0"
                                            required
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="cleaningFee">Cleaning Fee (₪)</label>
                                        <input
                                            type="number"
                                            id="cleaningFee"
                                            name="cleaningFee"
                                            value={stay.price.cleaningFee}
                                            onChange={(e) => handleNumberChange(e, 'price')}
                                            min="0"
                                        />
                                    </div>
                                </div>
                            </section>

                            <section className="form-section">
                                <h2>Amenities</h2>
                                <div className="amenities-grid">
                                    {availableAmenities.map(amenity => (
                                        <label key={amenity} className="amenity-checkbox">
                                            <input
                                                type="checkbox"
                                                checked={selectedAmenities.includes(amenity)}
                                                onChange={() => handleAmenityToggle(amenity)}
                                            />
                                            <span>{amenity}</span>
                                        </label>
                                    ))}
                                </div>
                            </section>

                            <section className="form-section">
                                <h2>Check-in & Check-out Times</h2>
                                
                                <div className="form-row">
                                    <div className="form-group">
                                        <label htmlFor="checkInFrom">Check-in From *</label>
                                        <input
                                            type="time"
                                            id="checkInFrom"
                                            name="from"
                                            value={stay.checkIn.from}
                                            onChange={(e) => handleNestedChange(e, 'checkIn')}
                                            required
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="checkInTo">Check-in Until *</label>
                                        <input
                                            type="time"
                                            id="checkInTo"
                                            name="to"
                                            value={stay.checkIn.to}
                                            onChange={(e) => handleNestedChange(e, 'checkIn')}
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="form-group">
                                    <label htmlFor="checkOutBy">Check-out By *</label>
                                    <input
                                        type="time"
                                        id="checkOutBy"
                                        name="by"
                                        value={stay.checkOut.by}
                                        onChange={(e) => handleNestedChange(e, 'checkOut')}
                                        required
                                    />
                                </div>
                            </section>

                            <section className="form-section">
                                <h2>House Rules</h2>
                                <form onSubmit={handleHouseRuleAdd} className="add-rule-form">
                                    <input
                                        type="text"
                                        name="rule"
                                        placeholder="e.g., No smoking, No parties"
                                    />
                                    <button type="submit">Add Rule</button>
                                </form>
                                <div className="rules-list">
                                    {stay.houseRules.map((rule, index) => (
                                        <div key={index} className="rule-item">
                                            <span>{rule}</span>
                                            <button
                                                type="button"
                                                onClick={() => handleHouseRuleRemove(rule)}
                                            >
                                                ×
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </section>

                            <div className="form-actions">
                                <button type="submit" className="submit-btn">
                                    Register Property
                                </button>
                            </div>
                        </form>
                    )}
                </div>
            </div>
        </div>
    )
}


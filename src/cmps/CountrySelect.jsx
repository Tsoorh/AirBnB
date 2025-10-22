import { useState } from 'react'

export function CountrySelect({ selectedCountry, onCountryChange, className = '' }) {
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [country, setCountry] = useState({code: 'IL', name: 'Israel'})

    const countries = [
        { code: 'IL', name: 'Israel' },
        { code: 'US', name: 'United States' },
        { code: 'GB', name: 'United Kingdom' },
        { code: 'CA', name: 'Canada' },
        { code: 'AU', name: 'Australia' },
        { code: 'FR', name: 'France' },
        { code: 'DE', name: 'Germany' },
        { code: 'IT', name: 'Italy' },
        { code: 'ES', name: 'Spain' },
        { code: 'JP', name: 'Japan' },
        { code: 'CN', name: 'China' },
        { code: 'BR', name: 'Brazil' },
        { code: 'MX', name: 'Mexico' },
        { code: 'IN', name: 'India' },
        { code: 'NL', name: 'Netherlands' },
        { code: 'SE', name: 'Sweden' },
        { code: 'NO', name: 'Norway' },
        { code: 'DK', name: 'Denmark' },
        { code: 'CH', name: 'Switzerland' },
        { code: 'BE', name: 'Belgium' },
    ]

    // const selectedCountryName = countries.find(c => c.code === selectedCountry)?.name || 'Select a country'

    function handleCountrySelect(country) {
        onCountryChange(country)
        setIsModalOpen(false)
        setCountry(country)
    }

    function closeModal() {
        setIsModalOpen(false)
    }
    

    return (
        <>
            <input 
                type="text" 
                className='country-select-button'
                placeholder='country/region'
                onClick={() => setIsModalOpen(true)}
                value={country.name}
                onChange={handleCountrySelect}
                required
            />
            

            {isModalOpen && (
                <div className="country-modal-overlay" onClick={closeModal}>
                    <div className="country-modal" onClick={(e) => e.stopPropagation()}>
                        <div className="country-modal-header">
                            <button className="close-btn" onClick={closeModal}>×</button>
                            <h2>Country/region</h2>
                        </div>
                        <div className="country-list">
                            {countries.map(country => (
                                <button
                                    key={country.code}
                                    className={`country-item ${selectedCountry === country.code ? 'selected' : ''}`}
                                    onClick={() => {
                                        handleCountrySelect(country)}

                                    }
                                >
                                    {country.name}
                                    {selectedCountry === country.code && <span className="checkmark">✓</span>}
                                    <hr />
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </>
    )
}

// import * as React from 'react'
// import Box from '@mui/material/Box'
// import TextField from '@mui/material/TextField'
// import Autocomplete from '@mui/material/Autocomplete'

// export function SearchDestination({ handleChange, isOpen, onCloseModal }) {
//   const [selectedCity, setSelectedCity] = React.useState(null)

//   const handleCityChange = (_event, newValue) => {
//     setSelectedCity(newValue)
//     // IMPORTANT: pass the city (not label), since your filter compares s.loc.city === filter.city
//     handleChange('city', newValue ? newValue.city : '')
//   }

//   return (
//     <Box sx={{ width: '100%', maxWidth: 400 }}>
//       <Autocomplete
//         id="destination-select"
//         sx={{ width: 300 }}
//         open={isOpen}
//         onClose={onCloseModal}
//         options={cities}
//         autoHighlight
//         value={selectedCity}
//         onChange={handleCityChange}
//         // Prevents MUI warning when objects are recreated
//         isOptionEqualToValue={(option, value) =>
//           option.city === value.city && option.code === value.code
//         }
//         getOptionLabel={(option) => option.label}
//         renderOption={(props, option) => {
//           const { key, ...optionProps } = props
//           return (
//             <Box
//               key={key}
//               component="li"
//               sx={{ '& > img': { mr: 2, flexShrink: 0 } }}
//               {...optionProps}
//             >
//               <img
//                 loading="lazy"
//                 width="20"
//                 srcSet={`https://flagcdn.com/w40/${option.code.toLowerCase()}.png 2x`}
//                 src={`https://flagcdn.com/w20/${option.code.toLowerCase()}.png`}
//                 alt=""
//               />
//               {option.label}
//             </Box>
//           )
//         }}
//         renderInput={(params) => (
//           <TextField
//             {...params}
//             placeholder="Search destinations"
//             slotProps={{
//               htmlInput: {
//                 ...params.inputProps,
//                 autoComplete: 'new-password',
//               },
//             }}
//           />
//         )}
//       />
//     </Box>
//   )
// }


// // cities.js (or above the component)
// export const cities = [
//   // Israel
//   { city: 'Tel Aviv-Yafo', label: 'Tel Aviv-Yafo, Israel', code: 'IL', lat: 32.0853, lng: 34.7818 },
//   { city: 'Jerusalem',     label: 'Jerusalem, Israel',     code: 'IL', lat: 31.7683, lng: 35.2137 },
//   { city: 'Haifa',         label: 'Haifa, Israel',         code: 'IL', lat: 32.7940, lng: 34.9896 },
//   { city: 'Eilat',         label: 'Eilat, Israel',         code: 'IL', lat: 29.5577, lng: 34.9519 },
//   { city: 'Zikhron Ya‘akov', label: 'Zikhron Ya‘akov, Israel', code: 'IL', lat: 32.5710, lng: 34.9530 },

//   // Portugal
//   { city: 'Lisbon',  label: 'Lisbon, Portugal',  code: 'PT', lat: 38.7223, lng: -9.1393 },
//   { city: 'Porto',   label: 'Porto, Portugal',   code: 'PT', lat: 41.1579, lng: -8.6291 },

//   // Greece
//   { city: 'Athens',  label: 'Athens, Greece',    code: 'GR', lat: 37.9838, lng: 23.7275 },

//   // France
//   { city: 'Paris',   label: 'Paris, France',     code: 'FR', lat: 48.8566, lng: 2.3522 },
//   { city: 'Nice',    label: 'Nice, France',      code: 'FR', lat: 43.7102, lng: 7.2620 },

//   // UK
//   { city: 'London',  label: 'London, United Kingdom', code: 'GB', lat: 51.5074, lng: -0.1278 },
//   { city: 'Edinburgh', label: 'Edinburgh, United Kingdom', code: 'GB', lat: 55.9533, lng: -3.1883 },

//   // Italy
//   { city: 'Rome',    label: 'Rome, Italy',       code: 'IT', lat: 41.9028, lng: 12.4964 },
//   { city: 'Milan',   label: 'Milan, Italy',      code: 'IT', lat: 45.4642, lng: 9.1900 },

//   // Spain
//   { city: 'Barcelona', label: 'Barcelona, Spain', code: 'ES', lat: 41.3851, lng: 2.1734 },
//   { city: 'Madrid',    label: 'Madrid, Spain',    code: 'ES', lat: 40.4168, lng: -3.7038 },

//   // USA
//   { city: 'New York',  label: 'New York, United States', code: 'US', lat: 40.7128, lng: -74.0060 },
//   { city: 'Los Angeles', label: 'Los Angeles, United States', code: 'US', lat: 34.0522, lng: -118.2437 },

//   // Misc
//   { city: 'Zurich',  label: 'Zurich, Switzerland', code: 'CH', lat: 47.3769, lng: 8.5417 },
//   { city: 'Amsterdam', label: 'Amsterdam, Netherlands', code: 'NL', lat: 52.3676, lng: 4.9041 },
// ]


import { useEffect, useMemo, useRef, useState } from "react";

/**
 * Tiny starter index. Replace with a larger dataset:
 * - Local JSON (top 10k cities) and import it
 * - Or use Fuse.js for better fuzzy
 * Object shape can be anything; we just need name + country
 */
const CITY_INDEX = [
  { name: "Tel Aviv", country: "Israel", countryCode: "IL", lat: 32.0853, lng: 34.7818 },
  { name: "Jerusalem", country: "Israel", countryCode: "IL", lat: 31.7683, lng: 35.2137 },
  { name: "London", country: "United Kingdom", countryCode: "GB", lat: 51.5072, lng: -0.1276 },
  { name: "Paris", country: "France", countryCode: "FR", lat: 48.8566, lng: 2.3522 },
  { name: "New York", country: "United States", countryCode: "US", lat: 40.7128, lng: -74.0060 },
  { name: "Barcelona", country: "Spain", countryCode: "ES", lat: 41.3874, lng: 2.1686 },
  { name: "Tokyo", country: "Japan", countryCode: "JP", lat: 35.6762, lng: 139.6503 },
  { name: "Amsterdam", country: "Netherlands", countryCode: "NL", lat: 52.3676, lng: 4.9041 },
  { name: "Rome", country: "Italy", countryCode: "IT", lat: 41.9028, lng: 12.4964 },
  { name: "Lisbon", country: "Portugal", countryCode: "PT", lat: 38.7223, lng: -9.1393 },
];

function countryCodeToFlag(cc = "") {
  // turns "IL" to 🇮🇱
  return cc
    .toUpperCase()
    .replace(/./g, c => String.fromCodePoint(127397 + c.charCodeAt()));
}

function basicFilter(index, q, limit = 8) {
  if (!q) return index.slice(0, limit);
  const needle = q.trim().toLowerCase();
  const starts = [];
  const contains = [];

  for (const c of index) {
    const city = c.name.toLowerCase();
    const country = c.country.toLowerCase();
    if (city.startsWith(needle) || country.startsWith(needle)) starts.push(c);
    else if (city.includes(needle) || country.includes(needle)) contains.push(c);
    if (starts.length >= limit) break;
  }
  const out = [...starts, ...contains].slice(0, limit);
  return out;
}

export function SearchDestination({ handleChange, isOpen, onCloseModal }) {
  
  const [query, setQuery] = useState("");
  const [results, setResults] = useState(() => CITY_INDEX.slice(0, 8));
  const [loading, setLoading] = useState(false);
  const [activeIdx, setActiveIdx] = useState(0);

  const inputRef = useRef(null);
  const listRef = useRef(null);
  const wrapperRef = useRef(null);

  // Focus input when modal opens
  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select?.();
    }
  }, [isOpen]);

  // Close on outside click
  useEffect(() => {
    function onDocClick(e) {
      if (!wrapperRef.current) return;
      if (!wrapperRef.current.contains(e.target)) onCloseModal?.();
    }
    document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, [onCloseModal]);

  // Debounced search
  useEffect(() => {
    setLoading(true);
    const t = setTimeout(() => {
      setResults(basicFilter(CITY_INDEX, query, 8));
      setActiveIdx(0);
      setLoading(false);
    }, 200);
    return () => clearTimeout(t);
  }, [query]);

  function selectCity(cityObj) {
    handleChange?.("city", cityObj.name);
    onCloseModal?.();
  }

  function onKeyDown(e) {
    if (!results.length) return;

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIdx(i => Math.min(i + 1, results.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIdx(i => Math.max(i - 1, 0));
    } else if (e.key === "Enter") {
      e.preventDefault();
      selectCity(results[activeIdx]);
    } else if (e.key === "Escape") {
      onCloseModal?.();
    }
  }

  return (
    <div
      ref={wrapperRef}
      className="destination-modal p-4"
      role="dialog"
      aria-modal="true"
      aria-label="Search destination"
      onKeyDown={onKeyDown}
    >
        {/* <label htmlFor="dest-input" className="label">Where</label> */}
        <input
          id="dest-input"
          ref={inputRef}
          type="text"
          placeholder="Search destinations (city or country)"
          value={query}
          onChange={e => setQuery(e.target.value)}
          className="input"
          autoComplete="off"
        />

      <div className="results">
        {loading && <div className="muted small">Searching…</div>}
        {!loading && results.length === 0 && (
          <div className="muted small">No matches</div>
        )}

        <ul
          ref={listRef}
          role="listbox"
          aria-label="Destination suggestions"
          className="suggestions"
        >
          {results.map((c, idx) => {
            const isActive = idx === activeIdx;
            return (
              <li
                key={`${c.name}-${c.country}`}
                role="option"
                aria-selected={isActive}
                className={`suggestion ${isActive ? "active" : ""}`}
                onMouseEnter={() => setActiveIdx(idx)}
                onMouseDown={e => e.preventDefault()} // keep focus
                onClick={() => selectCity(c)}
              >
                <span className="flag">{countryCodeToFlag(c.countryCode)}</span>
                <div className="place">
                  <div className="city">{c.name}</div>
                  <div className="country muted">{c.country}</div>
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}

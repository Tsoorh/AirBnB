import React from 'react';
import WifiIcon from '@mui/icons-material/Wifi';
import AcUnitIcon from '@mui/icons-material/AcUnit';
import KitchenIcon from '@mui/icons-material/Kitchen';
import TvIcon from '@mui/icons-material/Tv';
import BalconyIcon from '@mui/icons-material/Balcony';
import DeckIcon from '@mui/icons-material/Deck';
import PoolIcon from '@mui/icons-material/Pool';
import FitnessCenterIcon from '@mui/icons-material/FitnessCenter';
import LocalParkingIcon from '@mui/icons-material/LocalParking';
import OutdoorGrillIcon from '@mui/icons-material/OutdoorGrill';
import SpaIcon from '@mui/icons-material/Spa';
import LocalLaundryServiceIcon from '@mui/icons-material/LocalLaundryService';
import DryCleaningIcon from '@mui/icons-material/DryCleaning';
import WineBarIcon from '@mui/icons-material/WineBar';
import ElevatorIcon from '@mui/icons-material/Elevator';
import WorkIcon from '@mui/icons-material/Work';
import WavesIcon from '@mui/icons-material/Waves';
import YardIcon from '@mui/icons-material/Yard';
import WhatshotIcon from '@mui/icons-material/Whatshot';

export function AmenityIcon({ amenity }) {
  const normalized = amenity?.toLowerCase() || ''
  const icons = {
    wifi: <WifiIcon />,
    ac: <AcUnitIcon />,
    kitchen: <KitchenIcon />,
    tv: <TvIcon />,
    balcony: <BalconyIcon />,
    washer: <LocalLaundryServiceIcon />,
    heating: <WhatshotIcon />,
    garden: <YardIcon />,
    elevator: <ElevatorIcon />,
    'dedicated workspace': <WorkIcon />,
    rooftop: <DeckIcon />,
    'beach access': <WavesIcon />,
    pool: <PoolIcon />,
    gym: <FitnessCenterIcon />,
    'free parking': <LocalParkingIcon />,
    'bbq grill': <OutdoorGrillIcon />,
    'spa access': <SpaIcon />,
    dryer: <DryCleaningIcon />,
    'wine tasting': <WineBarIcon />,
  }

  return icons[normalized] || null
}

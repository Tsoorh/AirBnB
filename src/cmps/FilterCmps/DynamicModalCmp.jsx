import { StayFilterModal } from "./StayFilterModal";
import { SearchDestination } from "./SearchDestination";
import { GuestsPicker } from "./GuestsPicker";
import { ChooseDates } from "./ChooseDates";

export function  DynamicModalCmp({currentModalContent,handleChange}){

    const modalContent = {
    destination: <SearchDestination handleChange={handleChange} />,
    checkIn: <ChooseDates handleChange={handleChange} />,
    checkOut: <ChooseDates handleChange={handleChange} />,
    guest: <GuestsPicker handleChange={handleChange} />,
    };

  const activeComponent = modalContent[currentModalContent];
  if (activeComponent){
    return (
        <StayFilterModal>
            {activeComponent}
        </StayFilterModal>
    )
  }
    return null;
}
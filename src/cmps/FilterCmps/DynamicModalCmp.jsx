import { StayFilterModal } from "./StayFilterModal";
import { SearchDestination } from "./SearchDestination";
import { GuestsPicker } from "./GuestsPicker";
import { ChooseDates } from "./ChooseDates";

export function  DynamicModalCmp({currentModalContent,handleCityChange,handleGuestsChange,handleDateChange, onCloseModal}){

    const modalContent = {
    destination: {
      cmp:<SearchDestination handleChange={handleCityChange} isOpen={currentModalContent === 'destination'} onCloseModal={onCloseModal} />,
      className:"destination"
    },
    dates: {
      cmp:<ChooseDates handleChange={handleDateChange} isOpen={currentModalContent === 'dates'} onCloseModal={onCloseModal}/>,
      className:"dates"
    },
    guest:{
      cmp:<GuestsPicker handleChange={handleGuestsChange} isOpen={currentModalContent === 'guest'} onCloseModal={onCloseModal}/>,
      className:"guest"
    }
    };

  const activeComponent = modalContent[currentModalContent];
  if (activeComponent){
    return (
        <StayFilterModal currentClass={activeComponent.className}>
            {activeComponent.cmp}
        </StayFilterModal>
    )
  }
  return null;
}
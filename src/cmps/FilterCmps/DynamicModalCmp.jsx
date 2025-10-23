import { StayFilterModal } from "./StayFilterModal";
import { SearchDestination } from "./SearchDestination";
import { GuestsPicker } from "./GuestsPicker";
import { ChooseDates } from "./ChooseDates";
import { ClassNames } from "@emotion/react";

export function  DynamicModalCmp({currentModalContent,handleChange, onCloseModal}){

    const modalContent = {
    destination: {
      cmp:<SearchDestination handleChange={handleChange} isOpen={currentModalContent === 'destination'} onCloseModal={onCloseModal} />,
      className:"destination"
    },
    checkIn: {
      cmp:<ChooseDates handleChange={handleChange} isOpen={currentModalContent === 'checkIn'} onCloseModal={onCloseModal}/>,
      className:"dates "
  },
    checkOut: {
      cmp:<ChooseDates handleChange={handleChange} isOpen={currentModalContent === 'checkOut'} onCloseModal={onCloseModal}/>,
      className:"dates"
 },
    guest:{
      cmp:<GuestsPicker handleChange={handleChange} isOpen={currentModalContent === 'guest'} onCloseModal={onCloseModal}/>,
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
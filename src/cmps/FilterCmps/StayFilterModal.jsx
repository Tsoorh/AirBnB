export function StayFilterModal({children,onCloseModal,currentClass}){
        
    console.log(currentClass);
    
    return (
        <section className={`filter-modal shadow ${currentClass}`}>
            {children}
        </section>
    )
}
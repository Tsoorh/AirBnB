export function StayFilterModal({children,onCloseModal,currentClass}){
    
    
    return (
        <section className={`filter-modal shadow ${currentClass}`}>
            {children}
        </section>
    )
}
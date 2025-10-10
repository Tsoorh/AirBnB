import { useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'

import { showSuccessMsg, showErrorMsg } from '../services/event-bus.service'
import { loadStay, addStayMsg } from '../store/actions/stay.actions'


export function StayDetails() {

  const {stayId} = useParams()
  const Stay = useSelector(storeState => storeState.stayModule.Stay)

  useEffect(() => {
    loadStay(stayId)
  }, [stayId])

  async function onAddStayMsg(stayId) {
    try {
        await addStayMsg(stayId, 'bla bla ' + parseInt(Math.random()*10))
        showSuccessMsg(`Stay msg added`)
    } catch (err) {
        showErrorMsg('Cannot add Stay msg')
    }        

}

  return (
    <section className="Stay-details">
      <Link to="/Stay">Back to list</Link>
      <h1>Stay Details</h1>
      {Stay && <div>
        <h3>{Stay.vendor}</h3>
        <h4>{Stay.speed} KMH</h4>
        <pre> {JSON.stringify(Stay, null, 2)} </pre>
      </div>
      }
      <button onClick={() => { onAddStayMsg(Stay._id) }}>Add Stay msg</button>

    </section>
  )
}
'use client'

import { useAppContext } from '../context/AppContext'
import StationInfo from './StationInfo'

const StationModel: React.FC = ({}) => {
  const { viewedStation, setViewedStation, theme } = useAppContext()
  // console.log('viewedStation:', viewedStation)

  const handleClose = () => {
    setViewedStation(null)
  }

  if (!viewedStation) {
    return null
  }

  return (
    <dialog id="my_modal_5" className="modal modal-open">
      <div className="modal-box">
        <StationInfo
          station={viewedStation}
          theme={theme}
          handleClose={handleClose}
        />
      </div>
    </dialog>
  )
}
export default StationModel

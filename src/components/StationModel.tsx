'use client'

import { useAppContext } from '../context/AppContext'
import StationInfo from './StationInfo'

const StationModel: React.FC = ({}) => {
  const { viewedStation, setViewedStation, theme } = useAppContext()
  // console.log('viewedStation:', viewedStation)

  const handleClose = () => {
    setViewedStation(null)
  }

  // This is the new function to handle clicks on the backdrop.
  const handleDialogClick = (event: React.MouseEvent<HTMLDialogElement>) => {
    // Check if the click occurred directly on the dialog element itself.
    // This is true if the user clicks on the backdrop, but not on the modal-box.
    if (event.target === event.currentTarget) {
      handleClose()
    }
  }

  if (!viewedStation) {
    return null
  }

  return (
    <dialog
      id="my_modal_5"
      className="modal modal-open"
      onClick={handleDialogClick}
    >
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

type AlertMessageProps = {
  open: boolean
  message: string
  handleCloseAlertMessage: () => void
}

const AlertMessage = ({ open, message, handleCloseAlertMessage }: AlertMessageProps) => {
  // if (open) {
  //   window.setTimeout((): void => {
  //     handleCloseAlertMessage()
  //   }, 2500)
  // }

  return (
    <>
      {open ? (
        <div className="my-6 mx-auto max-w-3xl text-center px-12 py-4 bg-alertColor border-alertBorderColor text-alertTextColor font-bold rounded-md">
          {message}
        </div>
      ) : (
        <></>
      )}
    </>
  )
}

export default AlertMessage

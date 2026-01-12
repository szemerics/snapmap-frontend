import React from "react"

const HomePage = () => {
  if (!localStorage.getItem("access_token")) {
    window.location.href = "/login"
    return null
  }

  return <div>HomePage</div>
}

export default HomePage

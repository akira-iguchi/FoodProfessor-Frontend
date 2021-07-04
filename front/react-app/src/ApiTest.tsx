import React, {useState, useEffect} from 'react'
import axios from 'axios'

const API = 'http://localhost:3000/api/'

const ApiTest: React.FC = () => {
  const [data, setData] = useState("");

  useEffect(() => {
    axios.get(API).then(( res ) => { 
      setData(JSON.stringify(res.data));
    }).catch((error)=>{
      console.log(error.status)
    })
  })

  return (
    <div>
      <p>{ data }</p>
    </div>
  )
}

export default ApiTest
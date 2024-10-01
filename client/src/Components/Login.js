import React, {useState, useRef} from 'react'
import "./login.css"
import RoomIcon from '@mui/icons-material/Room';
import axios from 'axios'
import CancelIcon from '@mui/icons-material/Cancel';
const Login = ({setShowLogin, myStorage, setCurrentUser}) => {
    
    const [error, setError] = useState(false)
    const nameRef = useRef()
    // const emailRef = useRef()
    const passwordRef = useRef()

    const handleSubmit = async (e) => {
        e.preventDefault();
        const user = {
            username : nameRef.current.value,
            // email:emailRef.current.value,
            password: passwordRef.current.value
        }

        try {
            const res = await axios.post("http://localhost:3002/api/users/login", user)
            console.log(res)
            myStorage.setItem("user", res.data.username)
            setCurrentUser(res.data.username)
            setShowLogin(false)
            // setError(false)
            
        } catch (error) {
            setError(true)
            console.log(error.message)
        }
    }
  return (
    <div className='loginContainer'>
        <div className='logo'>
            <RoomIcon/>
            Genie
        </div>
        <form onSubmit={handleSubmit}>
            <input autoFocus type='text' placeholder='username' ref={nameRef}/>
            {/* <input type='email' placeholder='email' ref={emailRef}/> */}
            <input type='password' placeholder='password' ref={passwordRef}/>
            <button className='loginBtn'>Login</button>
           
            {error && (
                <span className='failure'>Something went wrong</span>
            )}
            
        </form>
        <CancelIcon className='loginCancel' onClick={()=> setShowLogin(false)}/>

    </div>
  )
}

export default Login
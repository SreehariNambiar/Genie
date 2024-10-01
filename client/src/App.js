
import './App.css';
import * as React from 'react';
import { useState, useEffect } from "react";
import Map, { GeolocateControl, Marker, Popup } from 'react-map-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import RoomIcon from '@mui/icons-material/Room';
import StarIcon from '@mui/icons-material/Star';
import axios from 'axios'
import {format} from "timeago.js"
import Register from './Components/Register';
import Login from './Components/Login';
function App() {
  const [currentUser,setCurrentUser] = useState(null)
  // const currentUser='Sreehari'
  const myStorage = window.localStorage
  const [pins, setPins] = useState([])
  const [currentPlaceId, setCurrentPlaceId] = useState(null)
  const [viewport, setViewport] = useState({});
  const [showPopup, setShowPopup] = useState(true);
  const [newPlace, setNewPlace] = useState(null)
  const [title, setTitle] = useState(null)
  const [desc, setDesc] = useState(null)
  const [rating,setRating] = useState(0)
  const [showRegister, setShowRegister] = useState(false)
  const [showLogin, setShowLogin] = useState(false)


  useEffect(() => {
    navigator.geolocation.getCurrentPosition((pos) => {
      setViewport({
        ...viewport,
        latitude: pos.coords.latitude,
        longitude: pos.coords.longitude,
        zoom: 2,
      });
      
      console.log(viewport)
      const getPins = async () => {
        try {
          const res = await axios.get('http://localhost:3002/api/pins')
          setPins(res.data)
          console.log(res.data)

        } catch (error) {
          
        }
      }
      getPins()
    });
  }, []);

  const handleMarkerClick = (e,id) => {
    
    console.log(id)
    if(id === 0){
    handleAddClick(e,id)
    }
    else{
      setCurrentPlaceId(id)
    }

  }

// const handleAddClick = (e) => {
//   console.log(e)
//   if(id === 0){
//   const [long,lat] = e.lngLat.toArray()
//   setNewPlace({
//     lat,
//     long,
//   })
//   // console.log(newPlace)
// }
// else if(id !== 0){
//   setNewPlace(null)

//   setCurrentPlaceId(id)
// }
//   // handleMarkerClick()

// }

const handleAddClick = (e) => {

    console.log(e)
  const [long,lat] = e.lngLat.toArray()
  setNewPlace({
    lat,
    long,
  })
}

const handleSubmit = async(e) => {
  e.preventDefault()
  const newPin = {
    username : currentUser,
    title,
    desc,
    rating,
    lat:newPlace.lat,
    long:newPlace.long

  }
  try {
    const res = await axios.post('/pins', newPin)
    setPins([...pins, res.data]);
    setNewPlace(null)
    
  } catch (error) {
    console.log(error.message)
  }
}
  const handleLogout = () => {
    myStorage.removeItem("user");
    setCurrentUser(null)
  }
  return (
    <div className="App">   
    {viewport.latitude && viewport.longitude && (  
    <Map 
      mapboxAccessToken={process.env.REACT_APP_MAPBOX}
      initialViewState={viewport}
      style={{width: "100vw", height: "100vh"}}
      mapStyle="mapbox://styles/mapbox/streets-v11"
      projection="globe"
      onClick={(e)=>{handleAddClick(e)}}
      
      
      
     
    >
     <Marker
              longitude={viewport.longitude}
              latitude={viewport.latitude}
              offsetLeft={-20}
              pffsetTop={-10}
              onClick={()=> setShowPopup(true)}
            />
    {/* {showPopup && (
      <Popup longitude={viewport.longitude} latitude={viewport.latitude}
        anchor="top" style={{"outline":"none"}}
        closeOnClick={false}
        onClose={() => setShowPopup(false)}>
        You are here
      </Popup>)} */}
    

    {pins.map((p) => {
      return(
        <>
        <Marker
    latitude={p.lat}
    longitude={p.long}
    onClick={(e)=>handleMarkerClick(e,p._id,p.lat,p.long)}
    >
    <RoomIcon style={{fontSize:viewport.zoom*25, color:p.username===currentUser ? 'tomato' : 'indigo', cursor:'pointer'}}  />
    
    </Marker>

 {p._id === currentPlaceId && (
    <Popup latitude={p.lat} longitude={p.long}
        anchor="left" style={{"outline":"none"}}
        closeOnClick={false}
        onClose={() => setCurrentPlaceId(null)}
        >
            {console.log(currentPlaceId===p._id)}
        <div className='card'>
          <label>Place</label>
          <h4 className='place'>{p.title}</h4>
          <label>Review</label>
          <p className='description'>{p.desc}</p>
          <label>Rating</label>
          <div className='stars'>
         { Array(p.rating).fill(<StarIcon className='star'/>)}
          </div>
          
          <label>Place</label>
          <span className='username'>Created by <b>{p.username}</b></span>
          <span className='date'>{format(p.createdAt)}</span>
        </div>
      </Popup>) }
        </>
      )
    })}
   {newPlace && (
    <Popup latitude={newPlace.lat} longitude={newPlace.long}
        anchor="left" style={{"outline":"none"}}
        closeOnClick={false}
        onClose={() => setNewPlace(null)}
        >
      <div>
        <form onSubmit={handleSubmit}>
          <label>Title</label>
          <input placeholder='Enter a title' onChange={(e) => setTitle(e.target.value)}/>
          <label>Review</label>
          <textarea placeholder='Say us something about this place' onChange={(e) => setDesc(e.target.value)}/>
          <label>Rating</label>
          <select onChange={(e) => setRating(e.target.value)}>
            <option value='1'>1</option>
            <option value='2'>2</option>
            <option value='3'>3</option>
            <option value='4'>4</option>
            <option value='5'>5</option>
          </select>
          <button className='submitButton' type='submit'>Add Pin</button>
        </form>
      </div>
       
      </Popup>
   )}
      
         
      <GeolocateControl
          positionOptions={{ enableHighAccuracy: true }}
          trackUserLocation={true}
        />
        <div className='lll'>
        {currentUser ? (
          <button className='button logout' onClick={handleLogout}>Logout</button>
        ) : (
          <div className='buttons'>
        <button className='button login' onClick={() => setShowLogin(true)}>Login</button>
        <button className='button register' onClick={() => setShowRegister(true)}>Register</button>
        </div>
        )}      
       
        </div>
        {showRegister && (<Register setShowRegister={setShowRegister}/> )}
        {showLogin && (<Login setShowLogin={setShowLogin} myStorage={myStorage} setCurrentUser={setCurrentUser}/>)}
        
    </Map>
    )}
    </div>
  );
}

export default App;

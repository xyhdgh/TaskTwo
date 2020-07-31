import React from 'react';

const LogOrRegInput = ({id, placeholder, svg, setHook}) => {
  let uid;
  if (id === 'username' || id === 'email') {
    uid = 'tel'
  } else {
    uid = 'password'
  }
  return (
    <div>
      <input type={uid} id={id} placeholder={placeholder} onChange={(e) => setHook(e.target.value)} />
      <label htmlFor={id}>
        <img src={svg} alt="img" />
      </label>
    </div>
  )
}

export default LogOrRegInput

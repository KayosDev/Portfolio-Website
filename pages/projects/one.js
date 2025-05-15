import React from 'react'
import Head from 'next/head'
import { useRouter } from 'next/router'
import WaveParticles from '../../components/WaveParticles'

export default function ProjectOne() {
  const router = useRouter();

  const handleClick = () => {
    router.push('/');
  };

  return (
    <>
      <Head>
        <title>Web App: Nebula - KayosDev</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      
      <div 
        onClick={handleClick}
        style={{ 
          position: 'fixed', 
          top: 0, 
          left: 0, 
          width: '100%', 
          height: '100%', 
          cursor: 'pointer',
          zIndex: 10
        }}
      />
      <WaveParticles />
    </>
  )
}

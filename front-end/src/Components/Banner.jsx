import React from 'react'

const Banner = ({ matches }) => {
    const firstNotPlayed = matches.find(item => item.score == "0")
    return (
        <div className='w-full overflow-hidden bg-themePurple p-4 lg:p-8 rounded-lg relative bg-[url("/stadium.jpg")] bg-cover bg-center bg-no-repeat'>
            <div className='absolute inset-0 bg-themePurple/80 rounded-lg '></div>

            {
                firstNotPlayed && (
                    <div className='space-y-5'>
                        <div className='relative text-2xl font-bold'>
                            <h2>Sıradaki Maç!</h2>
                        </div>
                        <div className='relative text-xs lg:text-sm flex gap-5 items-center'>
                            <div className='flex items-center gap-2'>
                                <img width={40} src={firstNotPlayed?.homeLogo} alt={firstNotPlayed?.homeLogo} />
                                <span>{firstNotPlayed?.homeTeam}</span>
                            </div>
                            <span>VS</span>
                            <div className='flex items-center gap-2'>
                                <span>{firstNotPlayed?.awayTeam}</span>
                                <img width={40} src={firstNotPlayed?.awayLogo} alt={firstNotPlayed?.awayLogo} />
                            </div>
                        </div>
                        <div>
                            <div className='relative space-y-1'>
                                <div>Tarih : {firstNotPlayed?.date}</div>
                                <div>Saat : {firstNotPlayed?.time}</div>
                            </div>
                        </div>
                    </div>
                )
            }

        </div>
    )
}

export default Banner
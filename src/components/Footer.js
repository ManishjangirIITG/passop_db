import React from 'react'

const Footer = () => {
    return (
        <div className='flex items-center justify-around bg-slate-800 text-white w-full'>
            <div className="logo font-bold text-2xl">
                    <span className="text-green-500">&lt;</span>

                    <span>Pass</span>

                    <span className="text-green-500">OP/&gt;</span>
                </div>
            <div className='flex justify-center'>

                Created with <img className='w-6 mx-1' src="/public/images/heart.png" alt="heart image" /> and react codealong Manish Jangir :)
            </div>
        </div>
    )
}

export default Footer

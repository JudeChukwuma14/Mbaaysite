import React, { useEffect, useState } from 'react'
import Spinner from '@/components/Common/Spinner';
import { Outlet } from 'react-router-dom';
import Footer from '../static/Footer';
import Header from '../static/Header';

const useLoading = (delay = 1500) =>{
    const [loading, setLoading] = useState(true)

    useEffect(()=>{
        const timer = setTimeout(() => {
            setLoading(false)
        }, delay);
        return () => clearTimeout(timer)
    }, [delay])
    return loading
}
    const WebLayout:React.FC = () => {
        const loading = useLoading()
        return loading ? (<Spinner/>) : (
            <div className='overflow-hidden'>
                <Header/>
                <Outlet/>
                <Footer/>
            </div>
        )

}
export default WebLayout
import React, { useEffect, useRef, useState } from 'react'
import { useSelector } from 'react-redux'
import './FeaturedInfo.css'

import { getSum } from '../../helpers/adminDetailsHelpers'

const FeaturedInfo = () => {
    const first = useRef(true)

    const [total, setTotal] = useState(null)

    const adminLogin = useSelector((state) => state.adminLogin)
    const { admin } = adminLogin

    useEffect(async() => {
        if(admin !== undefined) {
            first.current = false
            const sum = await getSum(admin.special, admin.schedule)
            setTotal(sum)
        }
    }, [admin])

    return (
        <div className = 'featured'>
        {
            first.current === false && admin &&
            <>
                <div className="featuredItem">
                    <span className="featuredTitle">Scheduled Pickups</span>
                    <div className="featuredMoneyContainer">
                        <span className="featuredMoney">{admin.scheduleCount}</span>    
                    </div>
                </div>

                <div className="featuredItem">
                    <span className="featuredTitle">Special Pickups</span>
                    <div className="featuredMoneyContainer">
                        <span className="featuredMoney">{admin.specialCount}</span>    
                    </div>
                </div>

                <div className="featuredItem">
                    <span className="featuredTitle">Total Earnings</span>
                    <div className="featuredMoneyContainer">
                        <span className="featuredMoney">Rs. {total}</span>    
                    </div>
                </div>
            </>
        }
        </div>
    )
}

export default FeaturedInfo
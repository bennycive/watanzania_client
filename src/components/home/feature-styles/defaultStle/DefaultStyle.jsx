import React from 'react'
import StyleFourCard from '../styleFour/StyleFourCard'

const DefaultStyle = ({ Data }) => {

    return (
        Data &&
        <section className='container commonMT '>
            <>

                <>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {
                            Data?.map((item, index) => (
                                <div key={index}>
                                    <StyleFourCard value={item} />
                                </div>
                            ))

                        }
                    </div>
                </>

            </>
            {/* newsSect ends from here  */}
        </section>

    )
}

export default DefaultStyle
import React, { useContext, useEffect, useState } from 'react';
import { APIContext } from '../api';
import { useParams, Link } from 'react-router-dom';
import ListingPreview from '../components/ListingPreview';

const Home = () => {
    const [listings, setListings] = useState([]);
    const [loading, setLoading] = useState(true);
    const api = useContext(APIContext)

    const { page } = useParams();
    useEffect(() => {
        api.getListings(page).then(l => {
            console.log(l);
            
            setListings(l);
            setLoading(false);
        })
        
    }, [api, page])

    if (loading) {
        return 'loading...';
    }

    return (<div className="card-container">
        {listings.map(l => (
            <ListingPreview key={l._id} listing={l}/>
        ))}
    </div>);
};

export default Home;

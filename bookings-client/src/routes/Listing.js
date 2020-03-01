import React, { useContext, useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { APIContext } from '../api';
import Review from '../components/Review';

function Listing() {
    const { id } = useParams();
    const [loading, setLoading] = useState(true);
    const [listing, setListing] = useState({});

    const api = useContext(APIContext);

    useEffect(() => {
        api.getListingById(id).then(l => {
            setListing(l);
            setLoading(false);
        });
    }, [api, id]);

    if (loading) {
        return 'loading...';
    }
    return (
        <div>
            <h3>{listing.name}</h3>
            <div className="row">
                <div className="col sm-4">
                    <img src={listing.picture_url} alt={listing.name} />
                </div>
                <div className="col sm-4">
                    <p>{listing.description}</p>
                    <h4>Overview</h4>
                    <p>{listing.neighborhood_overview}</p>
                    <h4>Transit</h4>
                    <p>{listing.neighborhood_overview}</p>
                    <h4>Access</h4>
                    <p>{listing.access}</p>
                    <h4>Amenities</h4>
                    <p>{listing.amenities}</p>
                    <div>price: {listing.price}</div>
                    <br />
                    <h3>Reviews</h3>
                    <div>
                        {listing.reviews.map(review => (
                            <Review key={review._id} review={review} />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Listing;

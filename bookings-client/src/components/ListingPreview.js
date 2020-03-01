import React from 'react';
import { Link, useHistory } from 'react-router-dom';

function ListingPreview({ listing }) {
    const history = useHistory();

    return (
        <div className="card" style={{ width: '20rem', margin: "1rem" }}>
            <div className="card-body">
                <h4 className="card-title">{listing.name}</h4>
                <Link to={`/listing/${listing._id}`}>
                    <img src={listing.picture_url} alt={listing.name} />
                </Link>
                <br></br>
                <p>{listing.summary}</p>
            </div>
            <div className="card-footer">
                <button onClick={() => history.push(`/listing/${listing._id}`)}>More details</button>
            </div>
        </div>
    );
}

export default ListingPreview;

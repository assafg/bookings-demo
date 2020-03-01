import React from 'react';

export const APIContext = React.createContext();

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3000';

console.log('API_URL', API_URL);

class API {
    getListingById(id) {
        return fetch(`${API_URL}/listing/${id}`)
            .then(data => data.json())
            .catch(err => console.log(err));
    }

    getListings(page) {
        return fetch(`${API_URL}/listing?page=${page}`)
            .then(data => data.json())
            .catch(err => console.log(err));
    }
}

export const ApiProvider = ({ children }) => {
    return <APIContext.Provider value={new API()}>{children}</APIContext.Provider>;
};

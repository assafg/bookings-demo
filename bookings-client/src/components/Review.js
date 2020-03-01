import React, { useState } from 'react';

function Review({ review }) {
    const [extended, setExtended] = useState(false);

    let comments = review.comments;
    if (!extended) {
        comments = review.comments.substring(0, 100);
    }
    return (
        <div>
            <div>{review.reviewer_name}</div>
            <p>
                {comments}
                {review.comments.length > 100 && (
                    <span>
                        {!extended && (
                            <span className="App-link" onClick={() => setExtended(true)}>
                                ... show more
                            </span>
                        )}
                        {extended && (
                            <span className="App-link" onClick={() => setExtended(false)}>
                                {' '}show less
                            </span>
                        )}
                    </span>
                )}
            </p>
        </div>
    );
}

export default Review;

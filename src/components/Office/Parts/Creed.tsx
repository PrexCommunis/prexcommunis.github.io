import React from 'react';
import { officeContent } from '../../../data/officeContent';

const Creed: React.FC = () => {
    return (
        <div className="section">
            <p className="rubric">
                Then shall be said the Apostles' Creed by the Minister and the people, standing.
            </p>

            <p className="prayer-text response">
                {officeContent.creed.apostles}
            </p>
        </div>
    );
};

export default Creed;

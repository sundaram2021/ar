import React, { useRef, useEffect } from 'react';

function Quiz() {
    const quizRef = useRef(null);

    useEffect(() => {
        const searchParams = new URLSearchParams(window.location.search);
        const quizLink = searchParams.get('quizLink');

        if (!quizLink) {
            console.error('Missing quizLink parameter in URL search string.');
            return; // Handle missing quizLink gracefully
        }

        const iframe = quizRef.current;
        if (iframe) {
            iframe.src = quizLink || 'https://forms.gle/ddyVH93MDik3w2L6A';
        }
    }, []);

    return (
        <div className='iframe-div'>
            <iframe
                ref={quizRef}
                className='quiz'
                src="" // Initially set to an empty string to avoid potential errors
                width="640"
                height="997"
            >
                Loading...
            </iframe>
        </div>
    );
}

export default Quiz;

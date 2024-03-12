import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Deck = () => {
    const [ deck, setDeck ] = useState( null );
    const [ card, setCard ] = useState( null );
    const [ remaining, setRemaining ] = useState( null );
    const [ isShuffling, setIsShuffling ] = useState(false);

    const drawNextCard = async () => {
        try {
            const response = await axios.get( `https://deckofcardsapi.com/api/deck/${ deck }/draw/?count=1` );
            if ( response.data.cards.length > 0 ) {
                setCard( response.data.cards[0].image );
                setRemaining( response.data.remaining );
            } else {
                loadNewDeck();
            }
        } catch ( error ) {
            console.error( `Error occurred with your request: ${ error }` );
        }
    };

    const loadNewDeck = async () => {
        try {
            const response = await axios.get( 'https://deckofcardsapi.com/api/deck/new/draw/?count=1' );
            setDeck( response.data.deck_id );
            setCard( response.data.cards[0].image );
            setRemaining( response.data.remaining );
        } catch ( error ) {
            console.error( `Error occurred with your request: ${ error }` );
        }
    };

    const shuffleDeck = async () => {
        try {
            setIsShuffling(true);
            const response = await axios.get( `https://deckofcardsapi.com/api/deck/${ deck }/shuffle/` );
            setDeck( response.data.deck_id );
            setRemaining( null );
            setIsShuffling( false );
        } catch ( error ) {
            console.error( `Error occurred with your request: ${ error }`);
            setIsShuffling( false );
        }
    };

    useEffect(() => {
        const getNewDeck = async () => {
            try {
                const response = await axios.get( 'https://deckofcardsapi.com/api/deck/new/draw/?count=1' );
                setDeck( response.data.deck_id );
                setCard( response.data.cards[0].image );
                setRemaining( response.data.remaining );
            } catch (error) {
                console.error( `Error occurred with your request: ${ error }` );
            }
        };

        getNewDeck();
    }, []);

    useEffect(() => {
        if ( deck ) {
            drawNextCard();
        }
    }, [ deck ]);

    if ( !deck ) {
        return <div>....Loading New Deck....</div>;
    }

    return(
        <div>
            <h1> Deck ID: { deck } </h1>
            {!isShuffling && (
                <>
                    <h1> Cards Remaining: { remaining } </h1>
                    <img src = { card } alt = "Card" />
                </>
            )}
            <div>
                <button onClick = {drawNextCard} disabled = { isShuffling }> Draw Card </button>
                <button onClick = {shuffleDeck} disabled = { isShuffling }> Shuffle Deck </button>
            </div>
        </div>
    );
};

export default Deck;

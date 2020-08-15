const initialState = {
    
};
const reducer = (state, action) => {
    switch (action) {
        case 'SET_ROWS': return state + 1;
        default: throw new Error('Unexpected action');
    }
};
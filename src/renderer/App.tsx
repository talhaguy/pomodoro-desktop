import React from "react";
import { connect, useDispatch, useSelector } from "react-redux";
import styled from "styled-components";
import { increment, decrement } from "./counterSlice";

// Counter

function Counter({ count, increment, decrement }) {
    return (
        <div>
            <span>{count}</span>
            <button onClick={increment}>+</button>
            <button onClick={decrement}>-</button>
        </div>
    );
}

// App

const AppStyled = styled.div`
    color: blue;
`;

export function App() {
    const count = useSelector<{ counter: { value: number } }, number>(
        (state) => state.counter.value
    );
    const dispatch = useDispatch();

    return (
        <AppStyled>
            <h1>This is an App</h1>
            <Counter
                count={count}
                increment={() => dispatch(increment())}
                decrement={() => dispatch(decrement())}
            />
        </AppStyled>
    );
}

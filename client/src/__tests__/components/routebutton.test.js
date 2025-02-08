import React from "react";
import { createRoot } from 'react-dom/client';
import RouteButton from '../../components/RouteButton'

import { act } from '@testing-library/react';
import '@testing-library/jest-dom'

test ("renders tile without crashing", () => {
    const div = document.createElement("div");
    const root = createRoot(div)
    act(() => {
    root.render(<RouteButton></RouteButton>)
    });
})
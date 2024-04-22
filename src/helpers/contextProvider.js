import { useState } from "react";
import { GameInfoContext } from "./context";

export const GameInfoProvider = ({ children }) => {
	const [state, setState] = useState(null);

	// Function to update state
	const updateState = (newValue) => {
		setState(newValue);
	};

	return (
		<GameInfoContext.Provider value={{ state, updateState }}>
			{children}
		</GameInfoContext.Provider>
	);
};

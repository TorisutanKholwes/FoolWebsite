import { usePopup } from "../hook/usePopup.tsx";
import InfoButton from "../components/InfoButton.tsx";

export default function TestPage() {

    const { showPopup, hidePopup } = usePopup()

    const textHover = () => {
        showPopup("You hovered the text here")
    }

    return (
        <div>
            <h1 onMouseEnter={textHover} onMouseLeave={hidePopup}>Hello World</h1>
            <InfoButton infoText={"Hello World"}>Un bouton normal</InfoButton>
        </div>
    )

}
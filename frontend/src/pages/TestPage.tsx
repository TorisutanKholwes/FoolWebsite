import { usePopup } from "../hook/usePopup.tsx";
import InfoButton from "../components/InfoButton.tsx";
import { usePanel } from "../hook/usePanel.tsx";
import Button from "../components/button/Button.tsx";
import { PanelType } from "../utils/types.ts";
import Input from "../components/input/Input.tsx";

export default function TestPage() {

    const { showPopup, hidePopup } = usePopup()
    const { showPanel } = usePanel()

    const textHover = () => {
        showPopup("You hovered the text here")
    }

    return (
        <div>
            <h1 onMouseEnter={textHover} onMouseLeave={hidePopup}>Hello World</h1>
            <InfoButton infoText={"Hello World"}>Un bouton normal</InfoButton>
            <Button onClick={() => showPanel("This is an info panel", PanelType.INFO)}>Info panel</Button>
            <Button onClick={() => showPanel("This is a warning panel", PanelType.WARNING)}>Warning panel</Button>
            <Button onClick={() => showPanel("This is an error panel", PanelType.ERROR)}>Error panel</Button>
            <Input type="password" />
        </div>
    )

}
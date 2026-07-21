export type EmptyFunction = () => void

export type UnknowMap = {
    [key: string]: string | null
}

export enum PanelType {
    INFO = 'info',
    WARNING = 'warning',
    ERROR = 'error'
}
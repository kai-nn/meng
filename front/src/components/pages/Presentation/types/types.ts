

export interface IModel {
    id?: number;
    name?: string;
    path: string | null;
}

export interface IModels {
    models: IModel[]
}

export interface ICharacteristics {
    characteristics: string
}

export interface InitialState {
    models: IModels | [],
    selectedModel: IModel | undefined,

    clips: string[],
    selectedClip: string | undefined,

    history: string,
}
import {createSlice, createAsyncThunk} from '@reduxjs/toolkit'
import {InitialState} from '../../components/pages/Presentation/types/types'


const initialState = {
    models: [],
    selectedModel: undefined,

    clips: [],
    selectedClip: undefined,

    history: ''
} as InitialState


export const loadModels = createAsyncThunk(
    'presentation/loadModels',
    (_, thunkApi) => {
        const { extra, dispatch, rejectWithValue, fulfillWithValue } = thunkApi
        console.log('loadModels')
        fetch(
            'presentation',
            {
                method: 'GET',
            }
        )
            .then(res => res.json())
            .then(models => {
                // console.log(models)
                dispatch(addModels(models))
            })
    }
)


export const presentationSlice = createSlice({

    name: 'presentation',
    initialState,
    reducers: {
        addModels: (state, action) => {
            state.models = action.payload
            state.selectedModel = action.payload[0]
            state.history = action.payload[0].history
        },
        selectModel: (state, action) => {
            state.selectedModel = action.payload
            state.history = action.payload.history
        },

        addClips: (state, action) => {
            state.clips = action.payload
        },
        selectClip: (state, action) => {
            console.log(action.payload)
            state.selectedClip = action.payload
        },

        clearState: (state) => {
            state.models = []
            state.clips = []
            state.selectedModel = undefined
            state.selectedClip = undefined
        },
    },

    // extraReducers: (builder) => {
    //     builder
    //         .addCase(loadModels.pending, (state) => {
    //             // state.isLoading = true
    //         })
    //         .addCase(loadModels.fulfilled, (state, action) => {
    //             // state.isLoading = false
    //             console.log('action.payload', action.payload)
    //             // state.models = [...action.payload]
    //         })
    //         .addCase(loadModels.rejected, (state, action) => {
    //             // state.isLoading = false
    //         });
    // }
})


export const {
    addModels,
    selectModel,
    selectClip,
    addClips,
    clearState,
} = presentationSlice.actions
export default presentationSlice.reducer






// import myGLTF from './bolt.json'
// console.log(myGLTF)
// const stringGLTF = JSON.stringify(myGLTF) // convert Object to a String
// const base64EncodedGLTF = btoa(stringGLTF) // Base64 encode the String
// const resultingDataURI = `data:application/octet-stream;base64,${base64EncodedGLTF}`
// const loader = new GLTFLoader()
// loader.load(
//     resultingDataURI,
//     (gltf) => {
//         console.log('Loaded!!!');
//         initialState = {...initialState, model: gltf}
//         console.log(initialState.model)
//
//     },
//     () => {},
//     (e: any) => console.error(e)
// );



// let m
// const loader = new GLTFLoader()
// const parcelPath = new URL('./defaultModel.glb', import.meta.url)
// loader.load(
//     parcelPath.href,
//     function ( glb ) {
//         console.log( glb )
//         m = glb
//     })


// import {createCube, createScene}  from './model'
// let scena = createScene()
// let mesh: any = createCube()
// scena.add(mesh)
// console.log(scena)




// const loader = new GLTFLoader()
// loader.setPath('./public/gltf/')
// loader.load(
//     'defaultModel.glb',
//     function (gltf) {
//         console.log(gltf)
//         initialState.model = gltf
//     },
//     undefined,
//     undefined
// )



// // загрузка GLTF со вставкой в state
// // работает нестабильно и не рекомендуется докуменацией Redux!
// export const loadGltf = createAsyncThunk(
//     'presentation/loadModel',
//     (arg, thunkApi) => {
//         // (modelOption: modelOption) => {
//         // @ts-ignore
//         const selectedModel: Model = arg
//         const { extra, dispatch, rejectWithValue, fulfillWithValue } = thunkApi
//         // console.log(modelOption)
//         // console.log('useGLTF', useGLTF(`./presentation/models/${modelOption.path}`))
//
//         const loader = new GLTFLoader()
//
//         const dracoLoader = new DRACOLoader()
//         dracoLoader.setDecoderConfig({ type: 'js' })
//         // Внимание! Подгружаются файлы декодера общим весом ~7мБ
//         dracoLoader.setDecoderPath('https://www.gstatic.com/draco/v1/decoders/')
//         loader.setDRACOLoader(dracoLoader)
//
//         loader.load(
//             `./presentation/models/${selectedModel.path}`,
//             function (gltf) {
//                 // console.log('gltf', gltf)
//                 dispatch(addGltf(gltf))
//                 // return thunkApi.fulfillWithValue(gltf)
//             },
//             function (xhr) {
//                 // console.log( ( xhr.loaded / xhr.total * 100 ) + '% loaded' )
//             },
//             function (error) {
//                 console.log( 'An error happened', error )
//             }
//         )
//
//     })
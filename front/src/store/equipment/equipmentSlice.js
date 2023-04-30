import {createSlice, createAsyncThunk} from '@reduxjs/toolkit'
import {socket} from "../../general/socket";


const initialState = {
    data: null,
    selected: 1,
    isLoading: false,
    statusConnection: null,
}

let dataNeedsUpdate = true

const autoSelect = parrent => {
    let autoSelect = parrent.id
    autoSelect = autoSelect === 1 && parrent.nodes[0]
        ? parrent.nodes[0]
        : autoSelect
    return autoSelect
}



export const listenChannel = createAsyncThunk(
    'equipment/listenChannel',
    (payload, {dispatch}) => {
        socket.on('connect', () => {
            dispatch(setStatusConnection('connect'))
            // предзагрузки данных
            dataNeedsUpdate && dispatch(sendData({command: 'loadAll', selected: null}))
        })
        socket.on('connect_error', () => {
            dataNeedsUpdate = true
            dispatch(setIsLoading(false))
            dispatch(setStatusConnection('connect_error'))
        })
        socket.on('disconnect', () => {
            dataNeedsUpdate = true
            dispatch(setIsLoading(false))
            dispatch(setStatusConnection('disconnect'))
        })
        socket.on("equipment", serverMessage => {
            dispatch(setIsLoading(true))
            dispatch(changeData(JSON.parse(serverMessage)))
        })
    }
)




export const equipmentSlice = createSlice({

    name: 'equipment',
    initialState,
    reducers: {

        connect: () => {
            socket.connect()
        },

        disconnect: () => {
            socket.off()
            socket.disconnect()
        },

        sendData: (state, action) => {
            const request = JSON.stringify({command: action.payload.command, selected: action.payload.selected})
            state.isLoading = false
            socket.emit('equipment', request)
        },

        updateData: (state, action) => {

        },

        setStatusConnection: (state, action) => {
            // console.log('setStatusConnection', action.payload)
            // console.log('state.isLoading', state.isLoading)
            // console.log('dataNeedsUpdate', dataNeedsUpdate)
            state.statusConnection = action.payload
        },

        setIsLoading: (state, action) => {
            state.isLoading = action.payload
        },

        changeData: (state, action) => {
            // console.log(action.payload)

            // обработка входящего полного пакета данных при запуске и ошибках коннекта
            if(dataNeedsUpdate){
                state.data = action.payload.map(el => {
                    return {
                        ...el,
                        collapsed: true,
                        is_group: !!el.nodes.length,
                        nesting: null,
                    }
                })
                state.selected = autoSelect(state.data[0])
                dataNeedsUpdate = false
                return
            }



            // обработка входящих изменений данных
            let {command, parrent, newElem = null, deleted_nodes = []} = action.payload

            if(command === 'addElem' || command === 'addSubElem') {
                let tempData = [...state.data]
                // console.log('tempData', tempData)

                const parrentIndex = tempData.findIndex(el => el?.id === parrent.id)
                tempData[parrentIndex] = {
                    ...parrent,
                    collapsed: false,
                    is_group: true,
                    nesting: null,
                }
                tempData[newElem.id - 1] = {
                    ...newElem,
                    collapsed: true,
                    is_group: false,
                    nesting: null,
                }
                state.data = tempData
                state.selected = autoSelect(newElem)
            }

            if(command === 'delElem'){
                let tempData = [...state.data]
                tempData[parrent.id - 1] = {...parrent}
                tempData = tempData.filter(el => !deleted_nodes.find(e => e === el?.id))

                parrent = {
                    ...tempData[parrent.id - 1],
                    ...parrent,
                    collapsed: !parrent.nodes.length,
                    is_group: tempData[parrent.id - 1]?.nodes.length === 0 ? false : true,
                    nesting: null,
                }

                // console.log('parrent ', parrent)
                state.data = tempData
                state.selected = autoSelect(parrent)
                // state.isLoading = false
            }
        },



        setSelected: (state, action) => {
            state.selected = action.payload
        },

        collapsEl: (state, action) => {
            const id = action.payload
            const elem = state.data.find(el => el?.id === id)
            elem.collapsed = !elem.collapsed
        },

    },

    extraReducers: {}

})


export const {
    setSelected,
    changeData,
    collapsEl,
    connect,
    disconnect,
    sendData,
    setStatusConnection,
    setIsLoading,
    updateData,
} = equipmentSlice.actions

export default equipmentSlice.reducer
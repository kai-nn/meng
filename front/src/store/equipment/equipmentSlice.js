import {createSlice, createAsyncThunk} from '@reduxjs/toolkit'
import {socket} from "../../general/socket";


const initialState = {
    data: null,
    selected: {id: 1},
    editableElement: null,
    isLoading: false,
    statusConnection: null,
    press: null,
    filterValue: null,
}

let dataNeedsUpdate = true



export const listenChannel = createAsyncThunk(
    'equipment/listenChannel',
    (payload, {dispatch, getState}) => {
        const state = getState()
        const user = state.access.user?.id ? state.access.user?.id : null
        socket.on('connect', () => {
            dispatch(setStatusConnection('connect'))
            // предзагрузка данных
            dataNeedsUpdate && dispatch(sendData({command: 'loadAll', selected: null, user: user}))
        })
        socket.on('connect_error', (err) => {
            console.log('connect_error', err.message)
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
            dispatch(changeData({
                ...JSON.parse(serverMessage),
                user: user
            }))
        })
    }
)


export const sendData = createAsyncThunk(
    'equipment/listenChannel',
    (payload, {dispatch, getState}) => {
        const state = getState()
        const request = JSON.stringify({
            command: payload.command,
            selected: payload.selected,
            sender: state.access.user?.id ? state.access.user?.id : null,
            token: state.access.token ? state.access.token : null
        })
        dispatch(setIsLoading(false))
        socket.emit('equipment', request)
})


export const updateData = createAsyncThunk(
    'equipment/listenChannel',
    (payload, {dispatch, getState}) => {
        const state = getState()
        const request = JSON.stringify({
            command: 'updateElem',
            selected: state.equipment.editableElement,
            sender: state.access.user?.id ? state.access.user?.id : null,
            token: state.access.token ? state.access.token : null
        })
        console.log('updateData')
        socket.emit('equipment', request)
})


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

        changeData: (state, action) => {
            // console.log(action.payload)

            state.editableElement = null
            const {equipment, sender, token, user} = action.payload
            const senderIsUser = (sender === user)

            // обработка входящего полного пакета данных при запуске и ошибках коннекта
            if(dataNeedsUpdate){
                state.data = equipment.map(el => {
                    return {
                        ...el,
                        collapsed: true,
                        is_group: !!el.nodes.length,
                        nesting: null,
                    }
                })

                if(state.data.length !== 1){
                    // выбираем первого потомка корневого элемента
                    const firstChieldId = state.data[0].nodes[0]
                    const firstChield = state.data.find(el => el?.id === firstChieldId)
                    state.selected = firstChield
                } else {
                    // или сам корневой елемент
                    state.selected = state.data[0]
                }

                dataNeedsUpdate = false
                return
            }


            // обработка входящих изменений данных
            let {
                command,
                elem = null,
                parent = null,
                newElem = null,
                deleted_nodes = [],
            } = equipment
            let tempData = [...state.data]


            if(command === 'addElem' || command === 'addSubElem') {

                const parentId = tempData.findIndex(el => el?.id === parent.id)

                tempData[parentId] = {
                    ...parent,
                    // раскрываем группу, если текущий клиент - отправитель, иначе оставляем прежним
                    collapsed: senderIsUser ? false : tempData[parentId].collapsed,
                    is_group: true,
                    nesting: null,
                }
                // tempData = [
                //     ...tempData,
                //     {
                //         ...newElem,
                //         collapsed: true,
                //         is_group: false,
                //         nesting: null,
                //     }
                // ]
                tempData.push({
                    ...newElem,
                    collapsed: true,
                    is_group: false,
                    nesting: null,
                })
                state.data = tempData

                if(senderIsUser){
                    // логика для клиента-автора (отправитель == пользователь)
                    state.selected = newElem
                } else {
                    // логика для клиента-наблюдателя (отправитель != пользователь)
                    if(tempData.length === 2) state.selected = newElem
                }
            }


            if(command === 'updateElem'){
                const elemId = tempData.findIndex(el => el?.id === elem.id)
                tempData[elemId] = {
                    ...tempData[elemId],
                    ...elem
                }
                state.data = tempData
                if(senderIsUser){
                    state.selected = tempData[elemId]
                }
            }


            if(command === 'delElem'){
                tempData = tempData.filter(el => !deleted_nodes.find(e => e === el?.id))
                const parentId = tempData.findIndex(el => el?.id === parent.id)
                parent = {
                    ...parent,
                    collapsed: !parent.nodes.length,
                    is_group: !!parent.nodes.length,
                    nesting: null,
                }
                tempData[parentId] = {...parent}
                state.data = tempData

                const findFirstChield = () => {
                    // выбираем первого потомка этого родителя
                    let firstChield = tempData.find(el => el?.id === parent.nodes[0])
                    // и если потомка нет, то выбираем родителя
                    firstChield = firstChield ? firstChield : parent
                    state.selected = firstChield
                }

                if(senderIsUser){
                    // логика для клиента-автора (отправитель == пользователь)
                    if(tempData.length === 0) {
                        // если данных нет
                        // выбираем корневой элемент
                        state.selected = state.data[0]
                    } else {
                        // данные есть
                        if(parent.id !== 1){
                            // если родитель не является корневым элементом
                            // выбираем этого родителя
                            state.selected = parent
                        } else {
                            findFirstChield()
                        }
                    }
                } else {
                    // логика для клиента-наблюдателя (отправитель != пользователь):
                    if(tempData.length > 1) {
                        // данные есть
                        // проверяем присутствует ли selected в списке удаляемых узлов
                        // если да, то выбираем первый элемент, нет - оставляем прежний selected
                        deleted_nodes.includes(state.selected.id) && findFirstChield()
                    } else {
                        // данных нет
                        // выбираем корневой элемент
                        state.selected = state.data[0]
                    }
                }
            }
        },

        setStatusConnection: (state, action) => {
            state.statusConnection = action.payload
        },

        setIsLoading: (state, action) => {
            state.isLoading = action.payload
        },

        setEditableElement: (state, action) => {
            state.editableElement = action.payload
        },

        setSelected: (state, action) => {
            state.selected = state.data.find(el => el?.id === action.payload)
        },

        collapsEl: (state, action) => {
            const id = action.payload
            const elem = state.data.find(el => el?.id === id)
            elem.collapsed = !elem.collapsed
        },

        press: (state, action) => {
            state.press = action.payload
        },

        setFilterValue: (state, action) => {
            state.filterValue = action.payload
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
    setStatusConnection,
    setIsLoading,
    setEditableElement,
    press,
    setFilterValue,
} = equipmentSlice.actions

export default equipmentSlice.reducer
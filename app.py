from flask import Flask, request, jsonify, send_from_directory
from datetime import datetime, timedelta, timezone, date
from flask_marshmallow import pprint
import os, base64, math
import json


import pandas as pd
# pip install pandas openpyxl

# from openpyxl import load_workbook
# from openpyxl_image_loader import SheetImageLoader

from flask_socketio import SocketIO
# pip install flask-socketio


# работа с токенами
# from flask_jwt_extended import \
#     create_access_token, \
#     get_jwt, \
#     get_jwt_identity,\
#     unset_jwt_cookies, \
#     jwt_required, \
#     JWTManager

app = Flask(__name__, static_folder="./front/build", static_url_path='/')
app.app_context().push()
# jwt = JWTManager(app)

socket = SocketIO(app, cors_allowed_origins='*')

# настройки подключения к базе, токены
from configuration import *


# импорт моделей и схем базы
from models import *


# настройки при первичном запуске
from init import *


# сервис обратной геолокации
# https://dadata.ru/api/geolocate/
from dadata import Dadata


# функции
from defs import *



# ведение журналов
# один печатает журналы (stdout), другой записывает журналы в файл:

# import logging
# import sys
#
# logger = logging.getLogger()
# logger.setLevel(logging.INFO)
# formatter = logging.Formatter('%(levelname)s | %(message)s')
#
# stdout_handler = logging.StreamHandler(sys.stdout)
# stdout_handler.setLevel(logging.DEBUG)
# stdout_handler.setFormatter(formatter)
#
# file_handler = logging.FileHandler('logs.log')
# file_handler.setLevel(logging.DEBUG)
# file_handler.setFormatter(formatter)
#
#
# logger.addHandler(file_handler)
# logger.addHandler(stdout_handler)




########################################
#########  М А Р Ш Р У Т Ы   ###########
########################################



@app.route('/', methods=["GET", "POST"])
def index():
    return app.send_static_file('index.html')


@app.route("/test_jwt", methods=["POST"])
# @jwt_required()
def test_jwt():
    value = request.get_json()
    print('value:', value)
    message = "Защищенная конечная точка"
    return jsonify({'type': 'info', "message": message})


@app.route("/logout", methods=["POST"])
def logout():
    message = "Доступ отсутствует или сеанс работы завершен"
    unset_jwt_cookies(jsonify({"message": message}))
    return jsonify({'type': 'info',
                    "message": message})



@app.route('/authorization', methods=['POST'])
def authorization():
    value = request.get_json()
    login = value['login']
    psw = value['password']

    temp_login = User.query.filter_by(login=login, psw=psw).first()

    if temp_login is None:
        return jsonify({'type': 'error',
                        'message': 'Пользователь с такими Логин | Пароль не зарегистрирован'})

    shtat = Shtat.query.filter_by(user=temp_login).first()

    if shtat is None:
        return jsonify({'type': 'error',
                        'message': f'Пользователь {login} еще не назначен на должность. Ждите...'})

    user_schema = UserSchema()
    user = user_schema.dump(temp_login)

    user.pop('psw')

    shtat_schema = ShtatSchema()
    shtat = shtat_schema.dump(shtat)

    access_token = getAccess(login, user, shtat)

    return jsonify({'type': 'success',
                    'message': 'Вход успешен',
                    'data': user,
                    'access_token': access_token})




@app.route('/list_tech', methods=['POST'])
# @jwt_required()
def list_tech():

    value = request.get_json()
    print('value', '\n', value)
    page = value['page']
    page_len = value['page_len']
    # value = {'url': 'list_tech', 'filter': 'Мои'}


    if value['filter'] == 'Мои':
        user = User.query.filter_by(login=creater).first()
        tech = Tech.query.filter_by(user=user).all()
        detail = db.session.query(Detail).join(Tech).filter_by(user=user).all()
    else:
        # fields = [Tech.name, Tech.description, Tech.version]
        # tech = db.session.query(*fields).paginate(page, pages, error_out=False).items
        tech = Tech.query

        tech_count = tech.count()
        page_count = math.ceil(tech_count / page_len)

        tech = tech.order_by(Tech.detail_id, Tech.version)
        tech = tech.paginate(page=page, per_page=page_len, error_out=False).items
        # detail = db.session.query(Detail).join(Tech, Detail.id == Tech.detail_id).all()
        arr_det_id = []
        for t in tech: arr_det_id.append(t.detail_id)
        arr_det_id = list(set(arr_det_id))
        detail = db.session.query(Detail).filter(Detail.id.in_(arr_det_id)).all()

    # print(tech)

    # технологии на неповторяющиеся детали
    # t = list({x.detail_id: x for x in tech}.values())

    tech_schema = TechSchema(many=True)
    tech = tech_schema.dump(tech)

    detail_schema = DetailSchema(many=True)
    detail = detail_schema.dump(detail)

    # объединение в пакет
    output = {
        'tech': tech,
        'detail': detail,
        'page_count': page_count,
        'tech_count': tech_count,
        'message': {'type': 'info', 'message': 'Ок'}
    }

    # pprint(output)
    return jsonify(output)


@app.route('/location', methods=['POST'])
def location():
    value = request.get_json()
    print(value)

    if value is None:
        print('Геоданные отсутствуют')
        return jsonify([])

    lat = value['latitude']
    lon = value['longitude']
    # print(lat, lon)

    dadata = Dadata(DADATA_TOKEN)
    try:
        result = dadata.geolocate(name="address", radius_meters=55.601983, lat=lat, lon=lon)
    except:
        result = []
    # result = [{'value': 'Клоака'}]
    # print(result)

    return jsonify(result)



@app.route('/img_store/<path:name>', methods=['GET'])
def img_store(name):
    return send_from_directory("static/images", name)


@socket.event
def equipment(arg):
    request = json.loads(arg)

    command = request['command']
    selected = request['selected']
    sender = request['sender']
    token = request['token']
    # print('token', token)

    if command == 'loadAll':
        eq = Equipment.query.all()
        equipment = []
        for e in eq:
            equipment += [{
                'id': e.id,
                'nodes': eval(e.nodes),
                'parent': e.parent,

                'type': e.type,
                'name': e.name,
                'description': e.description,
                'code': e.code,
                'firm': e.firm,
                'path': e.path,
                'data_added': e.data_added,

                'options': eval(e.options),

                'relevance': e.relevance,
                'added_id': e.added_id,
            }]
            # response = json.dumps(equipment)

    if command == 'addElem':
        equipment = add_equipment_element(selected, sender)

    if command == 'addSubElem':
        equipment = add_equipment_sub_element(selected, sender)

    if command == 'delElem':
        equipment = del_elem(selected)

    if command == 'updateElem':
        equipment = update_elem(selected)


    # equipment['sender'] = sender
    # print(equipment)
    response = json.dumps({
        'equipment': equipment,
        'sender': sender,
        'token': token
    })
    socket.emit('equipment', response)


@app.route('/equipment_http', methods=['GET', 'POST', 'DELETE'])
def equipment_http():

    if request.method == 'GET':
        eq = Equipment.query.all()
        equipment = []
        for e in eq:
            equipment += [{
                'id': e.id,
                'type': e.type,
                'name': e.name,
                'description': e.description,
                'code': e.code,
                'firm': e.firm,
                'path': e.path,
                'data_added': e.data_added,

                'nodes': eval(e.nodes),
                'parent': e.parent,

                'options': eval(e.options),

                'relevance': e.relevance,
                'added_id': e.added_id,
                # 'collapsed': True,
                # 'is_group': e.is_group,
            }]
        return equipment

    if request.method == 'POST':
        value = request.get_json()
        # print('value: ', value)
        selected = value['selected']
        command = value['command']

        if command == 'addElem':
            response = add_equipment_element(selected)
            socket.emit('equipmentСhange', response)
            return 'addElem OK'

        if command == 'addSubElem':
            response = add_equipment_sub_element(selected)
            socket.emit('equipmentСhange', response)
            return 'addSubElem OK'

    if request.method == 'DELETE':
        value = request.get_json()
        # print('value: ', value)
        selected = value['selected']

        response = del_elem(selected)
        # print(response)

        socket.emit('equipmentСhange', response)
        return 'deleteElem OK'


def update_elem(value):
    id = value['id']
    elem = Equipment.query.get(id)

    elem.name = value['name']
    elem.code = value['code']
    elem.description = value['description']
    elem.path = value['path']

    db.session.commit()
    print(elem.name)

    equipment_schema = EquipmentSchema()
    return {
        'elem': {**equipment_schema.dump(elem), 'nodes': eval(elem.nodes), 'options': eval(elem.options)},
        'command': 'updateElem',
    }


def create_new_equipment(parent, sender):
    newElem = Equipment(
        type=None,
        name=None,
        description=None,
        code=None,
        firm=None,
        path=None,
        data_added=datetime.now().date().strftime("%d.%m.%Y"),

        nodes=str([]),
        parent=parent.id,

        options=str(None),

        relevance=1,
        added_id=None if sender == None else sender,
    )
    db.session.add(newElem)
    db.session.commit()
    newElem = db.session.query(Equipment)
    newElem = newElem.order_by(Equipment.id.desc()).first()
    newElem.name = f'Новый {newElem.id}'
    return newElem


def add_equipment_element(sel, sender):

    selected = Equipment.query.get(sel)
    parent = Equipment.query.get(selected.parent)
    new = create_new_equipment(parent, sender)

    parent_nodes = eval(parent.nodes)
    # print('parent_nodes: ', parent_nodes)
    position_in_list = parent_nodes.index(sel)
    parent_nodes.insert(position_in_list + 1, new.id)
    # print('new nodes list: ', parent_nodes )
    parent.nodes = str(parent_nodes)

    db.session.commit()

    equipment_schema = EquipmentSchema()
    return {
        'parent': {**equipment_schema.dump(parent), 'nodes': eval(parent.nodes), 'options': eval(parent.options)},
        'newElem': {**equipment_schema.dump(new), 'nodes': eval(new.nodes), 'options': eval(new.options)},
        'command': 'addElem',
    }


def add_equipment_sub_element(sel, sender):

    selected = Equipment.query.get(sel)
    # print('parent', sel)
    parent = selected
    new = create_new_equipment(parent, sender)

    parent_nodes = eval(parent.nodes)
    # print('parent_nodes: ', parent_nodes)
    parent_nodes.append(new.id)

    # print('new nodes list: ', parent_nodes)
    parent.nodes = str(parent_nodes)
    db.session.commit()

    equipment_schema = EquipmentSchema()
    # print(equipment_schema.dump(parent))
    return {
        'parent': {**equipment_schema.dump(parent), 'nodes': eval(parent.nodes), 'options': eval(parent.options)},
        'newElem': {**equipment_schema.dump(new), 'nodes': eval(new.nodes), 'options': eval(new.options)},
        'command': 'addSubElem',
    }




def del_elem(selected):
    """ ID цепочки вложенных элементов """
    deleted_nodes = [selected]
    def chain(nodes):
        for nod in nodes:
            deleted_nodes.append(nod)
            chain(eval(Equipment.query.get(nod).nodes))
    chain(eval(Equipment.query.get(selected).nodes))

    selected_elem = Equipment.query.get(selected)
    parent = Equipment.query.get(selected_elem.parent)
    temp_parent_nodes = eval(parent.nodes)
    temp_parent_nodes.remove(selected_elem.id)
    parent.nodes = str(temp_parent_nodes)

    # id_deleted_elem = del_elem(selected)
    eq = db.session.query(Equipment).filter(Equipment.id.in_(deleted_nodes))
    eq.delete()

    db.session.commit()

    equipment_schema = EquipmentSchema()
    return {
        'parent': {**equipment_schema.dump(parent), 'nodes': eval(parent.nodes), 'options': eval(parent.options)},
        'deleted_nodes': deleted_nodes,
        'command': 'delElem',
    }




@app.route('/workplaces', methods=['GET', 'POST'])
def workplaces():

    if request.method == 'GET':
        response = wp()
        return jsonify(response)




def wp():
    df = pd.read_excel(
        io='Подетальная загрузка оборудования БПЗМП 2023.xlsx',
        header=3,
    )

    # удаление строк по критериям
    df = df[df['Деталь'].str.contains('Ʃ трудоемкость|Авиация|Наземка|Коэффициент загрузки') == False]
    df.dropna()  # удаление пустых строк
    df.dropna(subset=['Кол-во'])  # удаление строк с NaN
    df = df.reset_index(drop=True)  # сброс индексов после удаления строк
    df = df.fillna('')  # замена NaN на '' во всех ячейках

    # удаление неиспользуемых столбцов
    columns = df.columns.values.tolist()
    removed_columns = []
    i = 0
    while i < len(columns):
        if not columns[i].find('Трудоемкость'):
            removed_columns.append(columns[i])
        i += 1
    df.drop(columns=removed_columns, axis=1, inplace=True)
    # print(df)

    # список рабочих мест
    columns = df.columns.values.tolist()
    workplaces = []
    i = 0
    while i < len(columns):
        if not columns[i] in ['Наименование', 'Деталь', 'Кол-во']:
            workplaces.append(columns[i])
        i += 1
    # print(workplaces)

    work = df.loc[0:3]

    # print(work)

    work = work.rename(columns={'Деталь': 'wp'})

    # work = work.drop(labels=[0], axis=0)

    # print(work)

    work = work.set_index('wp').T
    work = work.drop(labels=['Наименование', 'Кол-во'])
    work = work.rename(columns={
        # 'Деталь': 'wp',
        'Кол-во станков': 'wp_quantity',
        'Кисп': 'k_isp',
        'Сменность': 'shift',
        'Календарный фонд, ч': 'fond',
    })
    # print(work)
    work = json.loads(
        work.to_json(orient='index')
    )


    # Выборка технологий
    df = df.iloc[6:]
    # print(df)
    tech_array = dict.fromkeys(workplaces)
    for wp in workplaces:
        # print(f'\n{wp}')
        query = df[['Деталь', 'Наименование', 'Кол-во', wp]]
        query = query.loc[(
                (df[wp] != 0) &
                (df[wp] != '') &
                (df['Кол-во'] != 0)
        )]
        query = query.rename(columns={
            'Деталь': 'drawing',
            'Наименование': 'name',
            'Кол-во': 'count',
            wp: 'tm'
        })
        query = query.assign(tm_sum=query['count'] * query['tm'])
        # print(query[0:5])

        tech_array[wp] = json.loads(
            query.to_json(orient='records')
        )

    # вставка изображений из ячеек
    # wb = load_workbook('./Подетальная загрузка оборудования БПЗМП 2023.xlsx')
    # sheet = wb['Загрузка']
    # # print(sheet)
    #
    # image_loader = SheetImageLoader(sheet)
    # image = image_loader.get('D5')
    # # image.show()
    #
    # for row in sheet.iter_rows():
    #     for cell in row:
    #         if cell.value in workplaces:
    #             cellAddr = 'D' + str(cell.column+1)
    #             print(cell.value, cell.row, cell.column, cellAddr)
    #             image = image_loader.get('D5')
    #             image.show()

    return {
        'workplaces': work,
        'tech_array': tech_array
    }


# wp()



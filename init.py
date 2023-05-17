from app import *


db.create_all()

from models import *


# Тест подключения к БД
try:
    exist = User.query.all()
    print('\nТест подключения к БД - успешно\n')
except Exception as ex:
    print('\nОшибка подключения к БД!\n')



# Закрепление п.п. меню для разных ролей
menu = {

    'Гость': {
        'Главная',
        'Регистрация',
        'Вход'
    },

    'Администратор': {
        'Главная',
        'Тесты',
        'Регистрация',
        'Штат',
        'Оборудование',
        'Закрепление',
        'Деталь',
        'Оснастка',
        'Маршрут',
        'Разработка УП',
        'Тех. менеджмент',
        'Вход',
        'Выход'
    },

    'Технолог': {
        'Главная',
        'Оборудование',
        'Деталь',
        'Маршрут',
        'Выход'
    },

    'Конструктор оснастки': {
        'Главная',
        'Оснастка',
        'Выход'
    },

    'Программист': {
        'Главная',
        'Оборудование',
        'Разработка УП',
        'Выход'
    },

    'Начальник ТБ': {
        'Главная',
        'Оборудование',
        'Деталь',
        'Маршрут',
        'Тех. менеджмент',
        'Выход'
    },

    'Оператор': {
        'Главная',
        'Обработка',
        'Выход'
    },

    'Контролер': {
        'Главная',
        'Выход'
    },

    'Кадры': {
        'Главная',
        'Выход'
    },

    'Рабочий': {
        'Главная',
        'Выход'
    },

    'Сервисный работник': {
        'Главная',
        'Выход'
    },

    'ОТИЗ': {
        'Главная',
        'Закрепление',
        'Выход'
    },

    'ПДБ': {
        'Главная',
        'Оборудование',
        'Выход'
    },

}

url = {
    'Главная': '/',
    'Тесты': '/test',
    'Регистрация': '/reg',
    'Штат': '/shtat',
    'Оборудование': '/mashine',
    'Закрепление': '/fixing',
    'Обработка': '/processing',
    'Деталь': '/detail',
    'Оснастка': '/tools',
    'Ред. детали': '/detail_edit',
    'Маршрут': '/tech',
    'Разработка УП': '/cnc',
    'Тех. менеджмент': '/tech_manage',
    'Выход': '/exit',
    'Вход': '/authorization',
}

if len(User.query.all()) <= 0:

    # настройка статусов пользователя
    status = {None, 'Работает', 'Уволен', 'В отпуске', 'На больничном'}
    for s in status:
        set_status = Status(status=s)
        db.session.add(set_status)

    # настройка штата
    for m in menu:
        if m != '':
            set_role = Role(role=m)
            db.session.add(set_role)

    # настройка администратора
    admin = Role.query.filter_by(role='Администратор').first()
    user = User(first_name='Александр',
                 last_name='Корпусов',
                otchestvo='Иванович',
                path='avatar/kainn.jpg',

                login=secret_admin_login,
                psw=secret_admin_pass,

                 email='kai.nn@mail.ru',
                 phone='9601698300',

                 birthday='10.03.1979',
                 reg_date=date.today())

    user.status = Status.query.filter_by(status='Работает').first()

    shtat = Shtat(division='300',
                  subdivision='Администрация',
                  position='Главный инженер',
                  user=user,
                  role_in_shtat=admin)

    db.session.add(user)
    db.session.add(shtat)
    db.session.commit()
    print('\nСозданы default\'ные записи User, Shtat.\n')




equipment_bd = [
    {
        'name': 'Root',
        'type': None,
        'description': 'Корневая запись',
        'code': None,
        'firm': None,
        'path': None,
        'data_added': None,

        'nodes': [2, 4, 8],
        'parent': None,

        'options': None,

        'relevance': True,
        'added_id': None,
        # 'collapsed': None,
        # 'is_group': True,
    },
    {
        'name': 'Приспособление',
        'type': None,
        'description': None,
        'code': None,
        'firm': None,
        'path': 'equipment/default_prisp.png',
        'data_added': None,

        'nodes': [3],
        'parent': 1,

        'options': None,

        'relevance': True,
        'added_id': None,
        # 'collapsed': None,
        # 'is_group': True,
    },
    {
        'name': 'Планшайба токарная',
        'type': None,
        'description': 'Токарное приспособление (планшайба)',
        'code': '63030-100',
        'firm': 'цех 50',
        'path': 'equipment/Планшайба.jpg',
        'data_added': '20.09.2022',

        'nodes': [],
        'parent': 2,

        'options': {'detail': '11.4201.3080.00'},

        'relevance': True,
        'added_id': None,
        # 'collapsed': None,
        # 'is_group': False,
    },
    {
        'name': 'Инструмент',
        'type': None,
        'description': None,
        'code': None,
        'firm': None,
        'path': 'equipment/default_tool.png',
        'data_added': '20.09.2022',

        'nodes': [5, 6],
        'parent': 1,

        'options': None,

        'relevance': True,
        'added_id': None,
        # 'collapsed': None,
        # 'is_group': True,
    },
    {
        'name': 'Резец',
        'type': None,
        'description': 'Оправка токарная',
        'code': '61510-500',
        'firm': 'Цех 50',
        'path': 'equipment/Резец.png',
        'data_added': '20.01.1990',

        'nodes': [],
        'parent': 4,

        'options': {'len': 200, 'b*h': '30*30'},

        'relevance': True,
        'added_id': None,
        # 'collapsed': None,
        # 'is_group': False,
    },
    {
        'name': 'Сверло',
        'type': None,
        'description': 'Инструмент для сверления отверстий',
        'code': None,
        'firm': None,
        'path': 'equipment/Сверла.jpg',
        'data_added': '20.01.1988',

        'nodes': [7],
        'parent': 4,

        'options': None,

        'relevance': True,
        'added_id': None,
        # 'collapsed': None,
        # 'is_group': True,
    },
    {
        'name': 'Сверло спиральное',
        'type': None,
        'description': 'Сверло спиральное твердосплавное',
        'code': '61510-2000',
        'firm': 'Guring',
        'path': 'equipment/Сверло.webp',
        'data_added': '20.01.2021',

        'nodes': [],
        'parent': 6,

        'options': {'len': 150, 'diam': 32},

        'relevance': True,
        'added_id': None,
        # 'collapsed': None,
        # 'is_group': False,
    },

    {
        'name': 'Средство контроля',
        'type': None,
        'description': None,
        'code': None,
        'firm': None,
        'path': 'equipment/default_control.png',
        'data_added': '20.09.2022',

        'nodes': [],
        'parent': 1,

        'options': {'detail': '11.4201.3080.00'},

        'relevance': True,
        'added_id': None,
        # 'collapsed': None,
        # 'is_group': True,
    },
]


def filling_equipment_bd():
    """ Наполнение базы Equipment """
    lenght = len(equipment_bd)
    index = 0
    user = User.query.first()
    if Equipment.query.count() <= 0:
        while index <= lenght - 1:
            equipment = Equipment(
                name=equipment_bd[index]['name'],
                type=equipment_bd[index]['type'],
                description=equipment_bd[index]['description'],
                code=equipment_bd[index]['code'],
                path=equipment_bd[index]['path'],
                data_added=equipment_bd[index]['data_added'],

                nodes=str(equipment_bd[index]['nodes']),
                parent=equipment_bd[index]['parent'],

                options=str(equipment_bd[index]['options']),

                relevance=equipment_bd[index]['relevance'],
                user=user,
                # collapsed=equipment_bd[index]['collapsed'],
                # is_group=equipment_bd[index]['is_group'],
            )
            index += 1
            db.session.add(equipment)

        print('\nСозданы default\'ные записи Equipment.\n')
    try:
        db.session.commit()
    except:
        print('Проблемы с заполнением базы Equipment')


# Настройки базы Equipment (оснащение)
filling_equipment_bd()


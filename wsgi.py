# import eventlet
# from eventlet import wsgi
from app import app, socketIo
# wsgi.server(eventlet.listen(('127.0.0.1', 8000), app))


# from app import app
# if __name__ == "__main__":
#         app.run()


if __name__ == '__main__':
    socketIo.run(app)
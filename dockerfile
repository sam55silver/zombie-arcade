FROM python:3.12-alpine
COPY ./server.py /app/
COPY ./requirements.txt /app/
COPY ./dist /app/dist
WORKDIR /app
RUN pip install --no-cache-dir -r requirements.txt
VOLUME /app/data
EXPOSE 8000
CMD ["gunicorn", "--workers=5", "-b", "0.0.0.0:8000", "server:create_app()"]

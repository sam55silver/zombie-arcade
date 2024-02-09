FROM python:3.12-alpine

RUN apk add --no-cache nodejs npm

COPY ./ /app/
WORKDIR /app

RUN pip install --no-cache-dir -r requirements.txt
RUN npm install
RUN npm run build

VOLUME /app/data
VOLUME /app/public
EXPOSE 8000
CMD ["gunicorn", "--workers=5", "-b", "0.0.0.0:8000", "server:create_app()"]

FROM python:3.12-alpine
WORKDIR /app
COPY requirements.txt /app/
RUN pip install --no-cache-dir -r requirements.txt
COPY server.py /app/
EXPOSE 8000
CMD ["gunicorn", "-b", "0.0.0.0:8000", "server:create_app()"]

FROM python:3.11-slim

WORKDIR /app

COPY backend/requirements.txt ./backend/requirements.txt
RUN pip install --no-cache-dir -r backend/requirements.txt

COPY backend ./backend

EXPOSE 5000

ENV FLASK_APP=backend.app

CMD ["flask", "run", "--host=0.0.0.0", "--port=5000"]
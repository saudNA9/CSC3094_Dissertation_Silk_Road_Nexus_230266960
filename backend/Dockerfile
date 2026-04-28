FROM python:3.11-slim

WORKDIR /app

RUN adduser --disabled-password --gecos "" appuser

COPY backend/requirements.txt ./backend/requirements.txt
RUN pip install --no-cache-dir -r backend/requirements.txt

COPY backend ./backend

RUN chown -R appuser:appuser /app
USER appuser

EXPOSE 5000

CMD ["flask", "run", "--host=0.0.0.0"]
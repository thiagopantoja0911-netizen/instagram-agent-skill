FROM python:3.12-slim
ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1
WORKDIR /app
COPY server/requirements.txt /app/server/requirements.txt
RUN pip install --no-cache-dir -r /app/server/requirements.txt
COPY . /app
RUN useradd --create-home --uid 10001 agent && chown -R agent:agent /app
USER agent
EXPOSE 8000
# The protected ASGI app aborts startup if its OAuth environment is absent.
# TLS must terminate at the deployment platform or a trusted reverse proxy.
CMD ["uvicorn", "server.remote_app:app", "--host", "0.0.0.0", "--port", "8000", "--no-access-log"]

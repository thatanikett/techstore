FROM postgres:16-alpine

ENV POSTGRES_DB=ecom
ENV POSTGRES_USER=ecom_user
ENV POSTGRES_PASSWORD=ecom_pass

COPY init.sql /docker-entrypoint-initdb.d/001-init.sql

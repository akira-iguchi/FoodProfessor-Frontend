FROM node:14.15.4-alpine3.10

WORKDIR /usr/src/food_professor

COPY start.sh /usr/src/food_professor/react-app/start.sh

RUN chmod +x /usr/src/food_professor/react-app/*

ENTRYPOINT [ "/usr/src/food_professor/react-app/start.sh" ]
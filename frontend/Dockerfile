FROM node:20

WORKDIR /app

ENV VITE_API_BASE_URL=https://projeto-de-gestao-e-consulta.onrender.com

COPY package.json ./
RUN npm install

COPY . .

RUN npm run build

EXPOSE 3000

CMD ["npm", "run", "preview"]

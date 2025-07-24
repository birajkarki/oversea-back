FROM node:20

WORKDIR /app

COPY package*.json ./
COPY prisma ./prisma

RUN npm install --legacy-peer-deps
RUN npx prisma generate

COPY . .

EXPOSE 4007

CMD ["sh", "-c", "npm run build && node dist/index.js"]
# Maxion MCP gateway — stdio proxy.
# The hosted Lambda holds every tool, license check, and secret; this image
# runs the thin local bridge over stdio (no HTTP port; EXPOSE not needed).
FROM node:20-alpine

WORKDIR /app

COPY package.json ./
RUN npm install --omit=dev

COPY index.js ./

ENTRYPOINT ["node", "index.js"]

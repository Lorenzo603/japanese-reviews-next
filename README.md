This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

This project uses [`next/font`](https://nextjs.org/docs/basic-features/font-optimization) to automatically optimize and load Inter, a custom Google Font.

## Run Drizzle Studio
```npx drizzle-kit studio --port 3001```

## Steps to deploy on server
On local, run:
```./scripts/deploy.sh```

On remote installation folder, run:
```npm i```
```npm run build```

## Using pm2
Use pm2 tool

Installing pm2 (only once)
```sudo npm install pm2 -g```

Running
```pm2 --time --name JapaneseReviewsNext start npm -- start```

Listing running processes
```pm2 ps```

Stopping
```pm2 delete 0```

Check application logs
```pm2 logs 0```

Empty logs
```pm2 flush 0```


## Docker deployment

On Macos, make sure Colima is started

```bash
colima status
colima start -f
```

```bash
docker build --platform=linux/amd64 -t tomomoji .
docker save -o tomomoji.tar tomomoji
scp tomomoji.tar user@your-vps-ip:/path/on/vps/
```

on VPS:
```bash
docker load -i tomomoji.tar
docker run -d -p 3000:3000 tomomoji
```

Inspect container from inside :
```bash
docker exec -it <ID> sh
```
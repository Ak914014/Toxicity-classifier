# Toxicity classifier

The toxicity model detects whether text contains toxic content such as threatening language, insults, obscenities, identity-based hate, or sexually explicit language.

![image](https://github.com/user-attachments/assets/09ca2051-9fcb-4d86-96a8-06306d2c2722)

## Getting Started

### Front-end 

To run the front-end use these following steps :

```
cd client 
npm install 
npm run dev 
```
now use http://localhost:3000 to view your front-end app

### Back-end 

To run the Back-end use these following steps :

```
cd server
```
Make sure you already have docker installed in your system

now first build the container
```
docker build -t toxic .
```

after this run the docker image 

```
docker run -p 5000:5000 toxic
```

to see the documantaion go to this port
http://localhost:5000/api-docs/



---
title: Dev Environment
date: 15-07-2024
tags:
    - slide
font: Mali
fontSize: 28
theme: default
---

<!--
class: flex flex-col
 -->

# Dev Environment

Kong Sakchai Paoin @{ .mt-auto .font-bold .mb-0 }

Backend Engineer @ Arise by Infinitas

---

> [!info] Ref
>
> [4 เทคนิคง่ายๆ เพื่อจัดการ Dev Environment แบบเนี๊ยบๆ ทันใจวัยทีน ⚡️](https://medium.com/@phoomparin/4-%E0%B9%80%E0%B8%97%E0%B8%84%E0%B8%99%E0%B8%B4%E0%B8%84%E0%B8%87%E0%B9%88%E0%B8%B2%E0%B8%A2%E0%B9%86-%E0%B9%80%E0%B8%9E%E0%B8%B7%E0%B9%88%E0%B8%AD%E0%B8%88%E0%B8%B1%E0%B8%94%E0%B8%81%E0%B8%B2%E0%B8%A3-dev-environment-%E0%B9%81%E0%B8%9A%E0%B8%9A%E0%B9%80%E0%B8%99%E0%B8%B5%E0%B9%8A%E0%B8%A2%E0%B8%9A%E0%B9%86-%E0%B8%97%E0%B8%B1%E0%B8%99%E0%B9%83%E0%B8%88%E0%B8%A7%E0%B8%B1%E0%B8%A2%E0%B8%97%E0%B8%B5%E0%B8%99-%EF%B8%8F-bf06f5a58a6e)

---

## 📂 Directory Structure

```sh
~/kong

├── labs
├── projects
└── workspaces
```

```sh
~/kong

├── labs
├── projects
└── workspaces
```

```sh
~/kong

├── labs
├── projects
└── workspaces
```

```sh
~/kong

├── labs
├── projects
└── workspaces
```

```sh
~/kong

├── labs
├── projects
└── workspaces
```

```sh
~/kong

├── labs
├── projects
└── workspaces
```

```sh
~/kong

├── labs
├── projects
└── workspaces
```

```sh
~/kong

├── labs
├── projects
└── workspaces
```

```sh
~/kong

├── labs
├── projects
└── workspaces
```

---

### 🧪 Labs

สำหรับในการทดลองทำ ลองเล่นอะไรใหม่ ๆ

```sh
~/kong/labs

├── basic
├── fizzbuzz
├── go-api
├── todoapidb
└── etc.
```

---

### 🗂️ Projects

โฟลเดอร์ที่ใช้สำหรับเก็บโปรเจคงานต่าง ๆ

```sh
~/kong/projects

└── my-project
```

---

### 📚 Workspaces

สำหรับในการเก็บ Environment Services ต่าง ๆ (Postgres, MySQL, MinIO)

```sh
~/kong/workspaces

├── madoka #redis
├── rick #mongodb
└── rin #postgres
```

---

## ⚙️ Shell Script

---

### ⚙️ Shell Script

```sh
~/kong/workspaces/

├── madoka #redis
├── rick #mongodb
├── rin #postgres
└── script.sh 👈
```

---

### 💨 CD Commands

```sh
# pg: Go to Projects

pg() {
  cd "kong/projects/$1"
}
```

<br/>

ไปยังโฟลเดอร์ใน Project ด้วยคำสั่ง pg \<name\>

```sh
source ~/kong/workspaces

pg my-project
```

---

```sh
# pg: Go to Projects

pg() {
  cd "kong/projects/$1"
}

# lg: Go to Labs

lg() {
  cd "kong/labs/$1"
}

# wg: Go to Workspaces

wg() {
  cd "kong/workspaces/$1"
}
```

---

เพิ่มคำสั่ง `source` ในไฟล์ `.zshrc` หรือ `.bashrc`

```sh
# ~/.zshrc or ~/.bashrc

source ~/kong/workspaces
```

---

## 📚 Workspaces

---

### 🐳 docker-compose.yml

```sh
~/kong/workspaces/

├── rin
│ 
│   └── docker-compose.yml 👈
└── script.sh
```

---

### 🐳 docker-compose.yml

Script ไฟล์ที่ใช้สำหรับในการสร้าง Container

```yml
services:
    db:
        container_name: rin_db
        image: postgres:latest
        environment:
            POSTGRES_USER: postgres
            POSTGRES_PASSWORD: example
        ports:
            - '5432:5432'
        volumes:
            - ./backup/postgres:/var/lib/postgresql/data
```

---

**No docker-compose.yml**

```sh
docker run --name rin_db -e POSTGRES_USER=postgres POSTGRES_PASSWORD=example -d postgres
```

<br/>

**docker-compose.yml**

```sh
docker compose up -d
```

---

**Now**

```sh
# ~/
wg rin

# ~/kong/workspaces/rin
docker compose up -d
```

---

**Docker compose commands**

```sh
# start docker
docker compose up -d

# stop docker
docker compose down
```

---

### ⚙️ makefile

```sh
~/kong/workspaces/

├── rin
│ 
│   ├── docker-compose.yml
│   └── makefile 👈
└── script.sh
```

---

### ⚙️ makefile

ไฟล์ที่เราสามารถสร้างคำสั่งต่าง ๆ ทำให้เราสามารถ run คำสั่งยาว ๆ ได้ง่ายขึ้น

```makefile
.PHONY: start
start:
 docker compose up -d

.PHONY: stop
stop:
 docker compose down
```

```sh
make start

# or

make
```

---

### 📚 Workspaces

```sh
~/kong/workspaces/

├── madoka #redis
│
│   ├── docker-file.yml
│   └── makefile
├── rick #mongodb
│
│   ├── docker-file.yml
│   └── makefile
├── rin #postgres
│
│   ├── docker-file.yml
│   └── makefile
└── script.sh
```

---

```sh
# ~/
wg rin

# ~/kong/workspaces/rin
make
```

---

**<center> สั้นอีก!!! </center>**

---

### ⚙️ Shell Script

```sh
# pg: Go to Projects

ws() {
  make -C "~/kong/workspaces/$1" $2
}
```

```sh
ws rin

# or

ws rin stop
```
